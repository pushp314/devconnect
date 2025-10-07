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
  if (!session?.user?.id || !session.user.username) {
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
  revalidatePath(`/profile/${session.user.username}`);
  return snippet;
}

const updateSnippetFormSchema = snippetFormSchema.extend({
    id: z.string(),
});

export async function updateSnippet(values: z.infer<typeof updateSnippetFormSchema>) {
    const session = await auth();
    if (!session?.user?.id || !session.user.username) {
        throw new Error('You must be logged in to update a snippet.');
    }

    const validatedFields = updateSnippetFormSchema.safeParse(values);
    if (!validatedFields.success) {
        throw new Error('Invalid snippet data.');
    }

    const { id, title, description, language, code, tags } = validatedFields.data;

    const snippetToUpdate = await db.snippet.findUnique({ where: { id } });
    if (!snippetToUpdate) {
        throw new Error('Snippet not found.');
    }
    if (snippetToUpdate.authorId !== session.user.id) {
        throw new Error('You are not authorized to edit this snippet.');
    }

    const updatedSnippet = await db.snippet.update({
        where: { id },
        data: {
            title,
            description,
            language,
            code,
            tags: { set: tags },
        },
    });

    revalidatePath('/feed');
    revalidatePath('/explore');
    revalidatePath(`/profile/${session.user.username}`);
    
    return updatedSnippet;
}

export async function getSnippetById(id: string) {
    return db.snippet.findUnique({ where: { id } });
}


export async function getSnippets({ page = 1, limit = 10, query, language, sortBy }: { page?: number; limit?: number; query?: string, language?: string, sortBy?: 'newest' | 'most-liked' | 'most-commented' }) {
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
            _count: {
                select: {
                    likes: true,
                    comments: true,
                }
            }
        }
    });
    
    const session = await auth();
    const currentUserId = session?.user?.id;

    return snippets.map(snippet => ({
        ...snippet,
        likesCount: snippet._count.likes,
        commentsCount: snippet._count.comments,
        isLiked: currentUserId ? !!snippet.likes.find(like => like.userId === currentUserId) : false,
        isSaved: currentUserId ? !!snippet.savedBy.find(save => save.userId === currentUserId) : false,
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

export async function deleteSnippet(snippetId: string) {
    const session = await auth();
    if (!session?.user?.id || !session.user.username) {
        throw new Error('You must be logged in to delete a snippet.');
    }

    const snippet = await db.snippet.findUnique({
        where: { id: snippetId },
    });

    if (!snippet) {
        throw new Error('Snippet not found.');
    }

    if (snippet.authorId !== session.user.id) {
        throw new Error('You are not authorized to delete this snippet.');
    }

    await db.snippet.delete({
        where: { id: snippetId },
    });
    
    revalidatePath('/feed');
    revalidatePath('/explore');
    revalidatePath(`/profile/${session.user.username}`);
}

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty.'),
  snippetId: z.string(),
});

export async function addSnippetComment(values: z.infer<typeof commentSchema>) {
  const session = await auth();
  if (!session?.user?.id || !session.user.name) {
    throw new Error('You must be logged in to comment.');
  }

  const validatedFields = commentSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error('Invalid comment data.');
  }

  const { content, snippetId } = validatedFields.data;
  
  const snippet = await db.snippet.findUnique({ where: { id: snippetId }});
  if (!snippet) throw new Error('Snippet not found');

  await db.comment.create({
    data: {
      content,
      authorId: session.user.id,
      snippetId,
    },
  });
  
  if (session.user.id !== snippet.authorId) {
    await createNotification({
        userId: snippet.authorId,
        type: 'COMMENT',
        message: `${session.user.name} commented on your snippet: "${snippet.title}"`,
        link: `/feed#${snippet.id}`,
    });
  }

  revalidatePath('/feed');
  revalidatePath('/explore');
}

export async function getSnippetComments(snippetId: string) {
  return db.comment.findMany({
    where: { snippetId },
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}
