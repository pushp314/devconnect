'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const docSchema = z.object({
  title: z.string().min(5).max(100),
  slug: z.string().min(5).max(120),
  content: z.string().min(50),
  tags: z.array(z.string()).min(1).max(10),
});

export async function createDocument(values: z.infer<typeof docSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in to create a document.');
  }

  const validatedFields = docSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error('Invalid document data.');
  }

  const { title, slug, content, tags } = validatedFields.data;

  const newDoc = await db.document.create({
    data: {
      title,
      slug,
      content,
      tags: {
        set: tags,
      },
      authorId: session.user.id,
    },
  });

  revalidatePath('/docs');
  revalidatePath(`/profile/${session.user.username}`);
  return newDoc;
}

export async function getDocuments({ query }: { query?: string }) {
  return db.document.findMany({
    where: {
      OR: query
        ? [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } },
          ]
        : undefined,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
      likes: true,
      comments: true,
    },
  });
}

export async function getDocumentBySlug(slug: string) {
    const doc = await db.document.findUnique({
        where: { slug },
        include: {
            author: true,
            likes: true,
            comments: true,
        }
    });
    if (!doc) return null;

    const session = await auth();
    const isLiked = session?.user?.id ? !!doc.likes.find(like => like.userId === session?.user?.id) : false;
    const isSaved = false; // TODO: Implement saved documents check

    return {
        ...doc,
        isLiked,
        isSaved,
        likesCount: doc.likes.length,
        commentsCount: doc.comments.length,
    };
}


export async function toggleDocumentLike(documentId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('You must be logged in to like a document.');
    }
    
    const existingLike = await db.documentLike.findFirst({
        where: {
            documentId,
            userId: session.user.id,
        },
    });

    const doc = await db.document.findUnique({ where: { id: documentId }});
    if (!doc) throw new Error('Document not found');

    if (existingLike) {
        await db.documentLike.delete({ where: { id: existingLike.id } });
    } else {
        await db.documentLike.create({
            data: {
                documentId,
                userId: session.user.id,
            },
        });
    }
    revalidatePath(`/docs/${doc.slug}`);
}

export async function toggleDocumentSave(documentId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('You must be logged in to save a document.');
    }

    const existingSave = await db.documentSave.findFirst({
        where: {
            documentId,
            userId: session.user.id,
        },
    });
    
    const doc = await db.document.findUnique({ where: { id: documentId }});
    if (!doc) throw new Error('Document not found');

    if (existingSave) {
        await db.documentSave.delete({ where: { id: existingSave.id } });
    } else {
        await db.documentSave.create({
            data: {
                documentId,
                userId: session.user.id,
            },
        });
    }
    revalidatePath(`/docs/${doc.slug}`);
    revalidatePath('/saved');
}
