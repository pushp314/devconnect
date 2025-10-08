'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { createNotification } from './notifications';
import { redirect } from 'next/navigation';

const snippetFormSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(500),
  language: z.string(),
  code: z.string().min(10),
  tags: z.array(z.string()).min(1).max(10),
  visibility: z.string().optional().default('public'),
  allowForks: z.boolean().optional().default(true),
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

  const { title, description, language, code, tags, visibility, allowForks } = validatedFields.data;

  const snippet = await db.snippet.create({
    data: {
      title,
      description,
      language,
      code,
      tags: {
        set: tags,
      },
      visibility,
      allowForks,
      authorId: session.user.id,
    },
  });

  revalidatePath('/feed');
  revalidatePath(`/${session.user.username}`);
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

    const { id, title, description, language, code, tags, visibility, allowForks } = validatedFields.data;

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
            visibility,
            allowForks,
        },
    });

    revalidatePath('/feed');
    revalidatePath('/explore');
    revalidatePath(`/${session.user.username}`);
    revalidatePath(`/snippets/${id}`);
    
    return updatedSnippet;
}

export async function getSnippetById(id: string) {
    const session = await auth();
    const currentUserId = session?.user?.id;

    const snippet = await db.snippet.findUnique({ 
        where: { id },
        include: {
            author: true,
            forkedFrom: {
                include: {
                    author: true,
                }
            }
        }
    });

    if (!snippet) return null;

    if (snippet.visibility === 'private') {
        if (!currentUserId) return null; // Not logged in, can't see private
        if (snippet.authorId !== currentUserId) {
            // Check if current user is a follower
            const isFollower = await db.follows.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: currentUserId,
                        followingId: snippet.authorId
                    }
                }
            });
            if (!isFollower) return null; // Not the author and not a follower
        }
    }
    
    return snippet;
}

export async function forkSnippet(snippetId: string) {
    const session = await auth();
    if (!session?.user?.id || !session.user.username) {
        throw new Error('You must be logged in to fork a snippet.');
    }

    const originalSnippet = await db.snippet.findUnique({
        where: { id: snippetId },
    });

    if (!originalSnippet || !originalSnippet.allowForks) {
        throw new Error('This snippet cannot be forked.');
    }
    
    if (originalSnippet.authorId === session.user.id) {
        throw new Error("You cannot fork your own snippet.");
    }

    const forkedSnippet = await db.snippet.create({
        data: {
            title: `Fork of ${originalSnippet.title}`,
            description: originalSnippet.description,
            language: originalSnippet.language,
            code: originalSnippet.code,
            tags: originalSnippet.tags,
            authorId: session.user.id,
            visibility: 'public', // Forks are public by default
            forkedFromId: originalSnippet.id,
        },
    });

    return forkedSnippet;
}


export async function getSnippets({ page = 1, limit = 20, query, language, sortBy }: { page?: number; limit?: number; query?: string, language?: string, sortBy?: 'newest' | 'most-liked' | 'most-commented' }) {
    const session = await auth();
    const currentUserId = session?.user?.id;

    let followingIds: string[] = [];
    if (currentUserId) {
        const follows = await db.follows.findMany({
            where: { followerId: currentUserId },
            select: { followingId: true }
        });
        followingIds = follows.map(f => f.followingId);
    }

    const whereClause: any = {
        OR: [
            { visibility: 'public' },
            ...(currentUserId ? [
                { // User's own private snippets
                    AND: [
                        { authorId: currentUserId },
                        { visibility: 'private' }
                    ]
                },
                { // Private snippets of people the user follows
                    AND: [
                        { authorId: { in: followingIds } },
                        { visibility: 'private' }
                    ]
                }
            ] : [])
        ]
    };
     if (language && language !== 'All') {
        whereClause.language = language;
    }
    if (query) {
        whereClause.AND = [
            ...(whereClause.AND || []),
            {
                 OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { tags: { has: query } },
                ]
            }
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
                link: `/snippets/${snippet.id}`,
            });
        }
    }
    revalidatePath('/feed');
    revalidatePath('/explore');
    revalidatePath(`/snippets/${snippetId}`);
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
    revalidatePath(`/${session.user.username}`);
}

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty.'),
  snippetId: z.string(),
});

export async function addSnippetComment(values: z.infer<typeof commentSchema>) {
  const session = await auth();
  if (!session?.user?.id || !session.user.name || !session.user.username) {
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
  
  // Create notifications
  const mentionRegex = /@(\w+)/g;
  const mentions = content.match(mentionRegex)?.map(m => m.substring(1)) || [];
  
  // Notify author if they weren't mentioned and didn't post the comment
  if (session.user.id !== snippet.authorId && !mentions.includes(snippet.author.username!)) {
    await createNotification({
        userId: snippet.authorId,
        type: 'COMMENT',
        message: `${session.user.name} commented on your snippet: "${snippet.title}"`,
        link: `/snippets/${snippet.id}`,
    });
  }

  // Notify mentioned users
  if (mentions.length > 0) {
      const mentionedUsers = await db.user.findMany({
          where: {
              username: { in: mentions },
              id: { not: session.user.id } // don't notify self
          },
      });

      for (const mentionedUser of mentionedUsers) {
          await createNotification({
              userId: mentionedUser.id,
              type: 'MENTION',
              message: `${session.user.name} mentioned you in a comment on "${snippet.title}"`,
              link: `/snippets/${snippet.id}`,
          });
      }
  }

  revalidatePath('/feed');
  revalidatePath('/explore');
  revalidatePath(`/snippets/${snippetId}`);
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
