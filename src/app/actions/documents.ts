'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { createNotification } from './notifications';
import { redirect } from 'next/navigation';

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

  const existingDoc = await db.document.findFirst({ where: { slug } });
  if (existingDoc) {
      throw new Error("A document with this slug already exists.");
  }

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

const updateDocSchema = docSchema.extend({
    id: z.string(),
});

export async function updateDocument(values: z.infer<typeof updateDocSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in to update a document.');
  }

  const validatedFields = updateDocSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error('Invalid document data.');
  }
  
  const { id, title, slug, content, tags } = validatedFields.data;
  
  const docToUpdate = await db.document.findUnique({ where: { id } });
  if (!docToUpdate) throw new Error('Document not found.');
  if (docToUpdate.authorId !== session.user.id) throw new Error('Unauthorized');

  const updatedDoc = await db.document.update({
    where: { id },
    data: {
      title,
      slug,
      content,
      tags: { set: tags },
    },
  });
  
  revalidatePath(`/docs/${updatedDoc.slug}`);
  revalidatePath('/docs');
  revalidatePath(`/profile/${session.user.username}`);

  return updatedDoc;
}

export async function deleteDocument(documentId: string) {
    const session = await auth();
    if (!session?.user?.id || !session.user.username) {
        throw new Error('You must be logged in to delete a document.');
    }

    const docToDelete = await db.document.findUnique({ where: { id: documentId }});
    if (!docToDelete) throw new Error('Document not found.');
    if (docToDelete.authorId !== session.user.id) throw new Error('Unauthorized');

    await db.document.delete({ where: { id: documentId } });
    
    revalidatePath('/docs');
    revalidatePath(`/profile/${session.user.username}`);
    redirect('/docs');
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
    if (!session?.user?.id || !session?.user?.name) {
        throw new Error('You must be logged in to like a document.');
    }
    
    const doc = await db.document.findUnique({ where: { id: documentId }});
    if (!doc) throw new Error('Document not found');

    const existingLike = await db.documentLike.findFirst({
        where: {
            documentId,
            userId: session.user.id,
        },
    });


    if (existingLike) {
        await db.documentLike.delete({ where: { id: existingLike.id } });
    } else {
        await db.documentLike.create({
            data: {
                documentId,
                userId: session.user.id,
            },
        });
        if (session.user.id !== doc.authorId) {
             await createNotification({
                userId: doc.authorId,
                type: 'LIKE',
                message: `${session.user.name} liked your document: "${doc.title}"`,
                link: `/docs/${doc.slug}`,
            });
        }
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
