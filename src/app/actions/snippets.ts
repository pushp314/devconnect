'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { createNotification } from './notifications';

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

export async function getSnippets({ page = 1, limit = 10, query, language, sortBy }: { page?: number; limit?: number; query?: string, language?: string, sortBy?: string }) {
    const whereClause: any = {};
     if (language && language !== 'All') {
        whereClause.language = language;
    }
    if (query) {
        whereClause.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } },
        ];
    }
    
    let orderBy: any = { createdAt: 'desc' };

    if (sortBy === 'most-liked') {
        orderBy = { likes: { _count: 'desc' } };
    } else if (sortBy === 'most-commented') {
        orderBy = { comments: { _count: 'desc' } };
    }

    const snippets = await db.snippet.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereClause,
        orderBy: orderBy,
        include: {
            author: true,
            likes: true,
            comments: true,
            savedBy: true,
        }
    });
    
    const session = await auth();

    return snippets.map(snippet => ({
        ...snippet,
        likesCount: snippet.likes.length,
        commentsCount: snippet.comments.length,
        isLiked: session?.user?.id ? !!snippet.likes.find(like => like.userId === session?.user.id) : false,
        isSaved: session?.user?.id ? !!snippet.savedBy.find(save => save.userId === session.user.id) : false,
    }));
}


export async function toggleSnippetLike(snippetId: string) {
    const session = await auth();
    if (!session?.user?.id || !session.user.name) {
        throw new Error('You must be logged in to like a snippet.');
    }
    
    const snippet = await db.snippet.findUnique({ where: { id: snippetId }});
    if (!snippet) throw new Error('Snippet not found');

    const existingLike = await db.like.findFirst({
        where: {
            snippetId,
            userId: session.user.id,
        },
    });

    if (existingLike) {
        await db.like.delete({ where: { id: existingLike.id } });
    } else {
        await db.like.create({
            data: {
                snippetId,
                userId: session.user.id,
            },
        });
        
        if (session.user.id !== snippet.authorId) {
             await createNotification({
                userId: snippet.authorId,
                type: 'LIKE',
                message: `${session.user.name} liked your snippet: "${snippet.title}"`,
                link: `/feed#${snippet.id}`, // Example link
            });
        }
    }
    revalidatePath('/feed');
    revalidatePath('/explore');
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
    } else {
        await db.savedSnippet.create({
            data: {
                snippetId,
                userId: session.user.id,
            },
        });
    }
    
    revalidatePath('/feed');
    revalidatePath('/explore');
    revalidatePath('/saved');
}
