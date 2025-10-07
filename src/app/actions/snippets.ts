'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const snippetFormSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(500),
  language: z.string(),
  code: z.string().min(10),
  tags: z.array(z.string()).min(1).max(10),
});

export async function createSnippet(values: z.infer<typeof snippetFormSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in to create a snippet.');
  }

  const validatedFields = snippetFormSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Invalid snippet data.');
  }

  const { title, description, language, code, tags } = validatedFields.data;

  const snippet = await db.snippet.create({
    data: {
      title,
      description,
      language,
      code,
      tags: {
        set: tags,
      },
      authorId: session.user.id,
    },
  });

  revalidatePath('/feed');
  revalidatePath(`/profile/${session.user.name}`);
  return snippet;
}

export async function getSnippets({ page = 1, limit = 10, query }: { page?: number; limit?: number; query?: string }) {
    const snippets = await db.snippet.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
             OR: query ? [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { language: { contains: query, mode: 'insensitive' } },
                { tags: { has: query } },
             ] : undefined,
        },
        orderBy: { createdAt: 'desc' },
        include: {
            author: true,
            likes: true,
            comments: true,
        }
    });

    return snippets.map(snippet => ({
        ...snippet,
        likesCount: snippet.likes.length,
        commentsCount: snippet.comments.length,
    }));
}


export async function toggleSnippetLike(snippetId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('You must be logged in to like a snippet.');
    }
    
    const existingLike = await db.like.findFirst({
        where: {
            snippetId,
            userId: session.user.id,
        },
    });

    if (existingLike) {
        await db.like.delete({ where: { id: existingLike.id } });
        revalidatePath('/feed');
        return { liked: false };
    } else {
        await db.like.create({
            data: {
                snippetId,
                userId: session.user.id,
            },
        });
        revalidatePath('/feed');
        return { liked: true };
    }
}

export async function toggleSnippetSave(snippetId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('You must be logged in to save a snippet.');
    }

    const existingSave = await db.savedSnippet.findFirst({
        where: {
            snippetId,
            userId: session.user.id,
        },
    });

    if (existingSave) {
        await db.savedSnippet.delete({ where: { id: existingSave.id } });
        revalidatePath('/feed');
        revalidatePath('/saved');
        return { saved: false };
    } else {
        await db.savedSnippet.create({
            data: {
                snippetId,
                userId: session.user.id,
            },
        });
        revalidatePath('/feed');
        revalidatePath('/saved');
        return { saved: true };
    }
}
