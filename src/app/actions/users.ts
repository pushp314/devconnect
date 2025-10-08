'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { createNotification } from './notifications';
import type { User, Snippet, Document, Like, Comment, SavedSnippet, DocumentSave, DocumentLike, DocumentComment, Follows } from '@prisma/client';


const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  bio: z.string().max(200, 'Bio must be less than 200 characters.').optional(),
  githubUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  instagramUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

type PopulatedSnippetForProfile = Snippet & {
  author: User;
  likes: Like[];
  comments: Comment[];
};

type PopulatedDocForProfile = Document & {
    author: User;
    likes: DocumentLike[];
    comments: DocumentComment[];
};

type UserProfile = User & {
    snippets: (Snippet & { likes: Like[], comments: Comment[] })[];
    documents: (Document & { likes: DocumentLike[], comments: DocumentComment[] })[];
    followers: Follows[];
    following: Follows[];
    savedSnippets: (SavedSnippet & { snippet: PopulatedSnippetForProfile })[];
    documentSaves: (DocumentSave & { document: PopulatedDocForProfile })[];
}

export async function getUserProfile(username: string) {
  const session = await auth();
  const currentUserId = session?.user?.id;

  const user = await db.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          snippets: true,
          documents: true,
        },
      }
    },
  });

  if (!user) {
    return null;
  }

  // --- Block check ---
  let isBlockedByCurrentUser = false;
  let isBlockingCurrentUser = false;

  if (currentUserId && currentUserId !== user.id) {
    const blockAsBlocker = await db.blockedUser.findFirst({
        where: { blockerId: currentUserId, blockedId: user.id }
    });
    isBlockedByCurrentUser = !!blockAsBlocker;

    const blockAsBlocked = await db.blockedUser.findFirst({
        where: { blockerId: user.id, blockedId: currentUserId }
    });
    isBlockingCurrentUser = !!blockAsBlocked;
  }

  // If there's a block, return minimal info immediately
  if (isBlockedByCurrentUser || isBlockingCurrentUser) {
      return {
          ...user,
          snippets: [],
          documents: [],
          savedSnippets: [],
          savedDocuments: [],
          isFollowing: false,
          followersCount: 0,
          followingCount: 0,
          snippetsCount: 0,
          documentsCount: 0,
          isBlockedByCurrentUser,
          isBlockingCurrentUser
      }
  }


  // Determine if the current user can see private snippets
  const canViewPrivate = currentUserId === user.id || (currentUserId ? !!(await db.follows.findFirst({ where: { followerId: currentUserId, followingId: user.id } })) : false);

  const snippets = await db.snippet.findMany({
    where: {
      authorId: user.id,
      ...(canViewPrivate ? {} : { visibility: 'public' })
    },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true, image: true, username: true } },
      likes: { select: { userId: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  const documents = await db.document.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true, image: true, username: true } },
      likes: { select: { userId: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
  
  const savedSnippetsData = await db.savedSnippet.findMany({
    where: { userId: user.id },
    include: {
      snippet: {
        include: {
          author: { select: { name: true, image: true, username: true } },
          likes: { select: { userId: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
    },
  });

  const savedDocumentsData = await db.documentSave.findMany({
    where: { userId: user.id },
    include: {
      document: {
        include: {
          author: { select: { name: true, image: true, username: true } },
           likes: { select: { userId: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
    },
  });
  
  const isFollowing = currentUserId
    ? !!(await db.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: user.id,
          },
        },
      }))
    : false;

  const processItems = (items: any[], currentUserId?: string) => {
    return items.map((item: any) => ({
      ...item,
      likesCount: item._count.likes,
      commentsCount: item._count.comments,
      isLiked: currentUserId ? !!item.likes.find((like: any) => like.userId === currentUserId) : false,
      isSaved: false, // This needs to be determined differently if we add saved status here
    }));
  };

  const processSavedSnippets = (items: any[], currentUserId?: string) => {
    return items.map((item: any) => {
      const snippet = item.snippet;
      return {
      ...snippet,
      likesCount: snippet._count.likes,
      commentsCount: snippet._count.comments,
      isLiked: currentUserId ? !!snippet.likes.find((like: any) => like.userId === currentUserId) : false,
      isSaved: true,
    }});
  };
  const processSavedDocs = (items: any[], currentUserId?: string) => {
     return items.map((item: any) => {
      const doc = item.document;
      return {
      ...doc,
      likesCount: doc._count.likes,
      commentsCount: doc._count.comments,
      isLiked: currentUserId ? !!doc.likes.find((like: any) => like.userId === currentUserId) : false,
      isSaved: true,
    }});
  };

  return {
    ...user,
    snippets: processItems(snippets, currentUserId),
    documents: processItems(documents, currentUserId),
    savedSnippets: processSavedSnippets(savedSnippetsData, currentUserId),
    savedDocuments: processSavedDocs(savedDocumentsData, currentUserId),
    isFollowing,
    followersCount: user._count.followers,
    followingCount: user._count.following,
    snippetsCount: user._count.snippets,
    documentsCount: user._count.documents,
    isBlockedByCurrentUser,
    isBlockingCurrentUser,
  };
}

export async function toggleFollow(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id || !session.user.name || !session.user.username) {
    throw new Error('You must be logged in to follow a user.');
  }

  const currentUserId = session.user.id;

  if (currentUserId === targetUserId) {
    throw new Error('You cannot follow yourself.');
  }

  const existingFollow = await db.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    },
  });

  const targetUser = await db.user.findUnique({ where: { id: targetUserId }, select: { username: true } });
  if (!targetUser || !targetUser.username) throw new Error('Target user not found');

  if (existingFollow) {
    await db.follows.delete({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });
  } else {
    await db.follows.create({
      data: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    });
    // Create a notification for the user who is being followed
    await createNotification({
        userId: targetUserId,
        type: 'FOLLOW',
        message: `${session.user.name} started following you.`,
        link: `/${session.user.username}`,
    });
  }
  revalidatePath(`/${targetUser.username}`);
}

export async function updateUserProfile(values: z.infer<typeof profileSchema>) {
  const session = await auth();
  if (!session?.user?.id || !session.user.username) {
    throw new Error('You must be logged in to update your profile.');
  }
  
  const validatedFields = profileSchema.safeParse(values);
  if (!validatedFields.success) {
      throw new Error("Invalid profile data.");
  }

  const { name, bio, githubUrl, instagramUrl } = validatedFields.data;

  const updatedUser = await db.user.update({
    where: { id: session.user.id },
    data: {
      name,
      bio: bio ?? null,
      githubUrl: githubUrl ?? null,
      instagramUrl: instagramUrl ?? null,
    },
  });

  revalidatePath(`/${updatedUser.username}`);
  revalidatePath('/settings');

  return updatedUser;
}

export async function getUsers({ query }: { query?: string }) {
  const session = await auth();
  const currentUserId = session?.user?.id;

  return db.user.findMany({
    where: {
      id: { not: currentUserId }, // Exclude the current user from the list
      OR: query
        ? [
            { name: { contains: query, mode: 'insensitive' } },
            { username: { contains: query, mode: 'insensitive' } },
          ]
        : undefined,
    },
    orderBy: {
      name: 'asc',
    },
    take: 10,
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    }
  });
}


export async function getSavedItems() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('You must be logged in to view saved items.');
    }

    const savedSnippets = await db.savedSnippet.findMany({
        where: { userId: session.user.id },
        include: {
            snippet: {
                include: {
                    author: { select: { name: true, image: true, username: true } },
                    likes: { select: { userId: true } },
                    savedBy: { select: { userId: true } },
                    _count: { select: { likes: true, comments: true } },
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
    
    const savedDocuments = await db.documentSave.findMany({
        where: { userId: session.user.id },
        include: {
            document: {
                include: {
                    author: { select: { name: true, image: true, username: true } },
                    likes: { select: { userId: true } },
                    savedBy: { select: { userId: true } },
                    _count: { select: { likes: true, comments: true } },
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const populatedSnippets = savedSnippets.map(s => {
        const snippet = s.snippet;
        return {
            ...snippet,
            likesCount: snippet._count.likes,
            commentsCount: snippet._count.comments,
            isLiked: !!snippet.likes.find(like => like.userId === session.user?.id),
            isSaved: !!snippet.savedBy.find(save => save.userId === session.user?.id),
        }
    });
    
    const populatedDocs = savedDocuments.map(d => {
        const doc = d.document;
        return {
        ...doc,
        likesCount: doc._count.likes,
        commentsCount: doc._count.comments,
        isLiked: !!doc.likes.find(like => like.userId === session.user?.id),
        isSaved: !!doc.savedBy.find(save => save.userId === session.user?.id),
    }});

    return { savedSnippets: populatedSnippets, savedDocuments: populatedDocs };
}

export async function getRecommendedItems() {
    const session = await auth();
    if (!session?.user?.id) {
      return { recommendedSnippets: [], recommendedDocs: [] };
    }
    const userId = session.user.id;
  
    // 1. Get tags from user's liked and saved items
    const likedSnippets = await db.like.findMany({
      where: { userId },
      select: { snippet: { select: { tags: true } } },
    });
    const savedSnippets = await db.savedSnippet.findMany({
      where: { userId },
      select: { snippet: { select: { tags: true } } },
    });
    const likedDocs = await db.documentLike.findMany({
        where: { userId },
        select: { document: { select: { tags: true } } },
    });
    const savedDocs = await db.documentSave.findMany({
        where: { userId },
        select: { document: { select: { tags: true } } },
    });
  
    const userTags = new Set([
      ...likedSnippets.flatMap(i => i.snippet.tags),
      ...savedSnippets.flatMap(i => i.snippet.tags),
      ...likedDocs.flatMap(i => i.document.tags),
      ...savedDocs.flatMap(i => i.document.tags),
    ]);
  
    if (userTags.size === 0) {
      // Fallback for new users: get popular items
      const popularSnippets = await db.snippet.findMany({
        where: { visibility: 'public' },
        orderBy: { likes: { _count: 'desc' } },
        take: 10,
        include: { author: { select: { name: true, image: true, username: true } }, likes: { select: { userId: true } }, savedBy: { select: { userId: true } }, _count: { select: { likes: true, comments: true } } }
      });
       const popularDocs = await db.document.findMany({
        orderBy: { likes: { _count: 'desc' } },
        take: 10,
        include: { author: { select: { name: true, image: true, username: true } }, _count: { select: { likes: true, comments: true } } }
      });
      return { 
          recommendedSnippets: popularSnippets.map(snippet => ({
            ...snippet,
            likesCount: snippet._count.likes,
            commentsCount: snippet._count.comments,
        })),
        recommendedDocs: popularDocs.map(doc => ({
            ...doc,
            likesCount: doc._count.likes,
            commentsCount: doc._count.comments,
        }))
       };
    }
  
    // 2. Find items with matching tags, excluding user's own and already interacted items
    const interactedSnippetIds = (await db.snippet.findMany({
        where: {
            OR: [
                { authorId: userId },
                { likes: { some: { userId } } },
                { savedBy: { some: { userId } } },
            ]
        },
        select: { id: true }
    })).map(s => s.id);

    const interactedDocIds = (await db.document.findMany({
        where: {
            OR: [
                { authorId: userId },
                { likes: { some: { userId } } },
                { savedBy: { some: { userId } } },
            ]
        },
        select: { id: true }
    })).map(d => d.id);
  
    const recommendedSnippets = await db.snippet.findMany({
      where: {
        visibility: 'public',
        id: { notIn: interactedSnippetIds },
        tags: { hasSome: Array.from(userTags) },
      },
      take: 10,
      orderBy: { likes: { _count: 'desc' } },
      include: { author: { select: { name: true, image: true, username: true } }, likes: { select: { userId: true } }, savedBy: { select: { userId: true } }, _count: { select: { likes: true, comments: true } } }
    });

     const recommendedDocs = await db.document.findMany({
      where: {
        id: { notIn: interactedDocIds },
        tags: { hasSome: Array.from(userTags) },
      },
      take: 10,
      orderBy: { likes: { _count: 'desc' } },
      include: { author: { select: { name: true, image: true, username: true } }, _count: { select: { likes: true, comments: true } } }
    });
  
    return { 
        recommendedSnippets: recommendedSnippets.map(snippet => ({
            ...snippet,
            likesCount: snippet._count.likes,
            commentsCount: snippet._count.comments,
        })),
        recommendedDocs: recommendedDocs.map(doc => ({
            ...doc,
            likesCount: doc._count.likes,
            commentsCount: doc._count.comments,
        }))
    };
}


// --- User Blocking and Reporting ---

export async function blockUser(targetUserId: string) {
    const session = await auth();
    const currentUserId = session?.user?.id;

    if (!currentUserId) throw new Error('Authentication required.');
    if (currentUserId === targetUserId) throw new Error("You cannot block yourself.");

    await db.blockedUser.create({
        data: {
            blockerId: currentUserId,
            blockedId: targetUserId,
        }
    });

    // Also remove any existing follow relationships
    await db.follows.deleteMany({
        where: {
            OR: [
                { followerId: currentUserId, followingId: targetUserId },
                { followerId: targetUserId, followingId: currentUserId },
            ]
        }
    });

    revalidatePath(`/${targetUserId}`);
    revalidatePath('/settings');
}

export async function unblockUser(targetUserId: string) {
    const session = await auth();
    const currentUserId = session?.user?.id;

    if (!currentUserId) throw new Error('Authentication required.');

    await db.blockedUser.deleteMany({
        where: {
            blockerId: currentUserId,
            blockedId: targetUserId,
        }
    });
    
    revalidatePath(`/${targetUserId}`);
    revalidatePath('/settings');
}

const reportUserSchema = z.object({
  targetUserId: z.string(),
  reason: z.string().min(10, "Please provide a reason with at least 10 characters."),
});

export async function reportUser(values: z.infer<typeof reportUserSchema>) {
    const session = await auth();
    const currentUserId = session?.user?.id;

    if (!currentUserId) throw new Error('Authentication required.');

    const validatedFields = reportUserSchema.safeParse(values);
    if (!validatedFields.success) {
        throw new Error('Invalid report data.');
    }

    const { targetUserId, reason } = validatedFields.data;

    if (currentUserId === targetUserId) throw new Error("You cannot report yourself.");

    await db.userReport.create({
        data: {
            reporterId: currentUserId,
            reportedId: targetUserId,
            reason: reason,
        }
    });
}

export async function getBlockedUsers() {
    const session = await auth();
    const currentUserId = session?.user?.id;

    if (!currentUserId) return [];

    const blocks = await db.blockedUser.findMany({
        where: { blockerId: currentUserId },
        include: {
            blocked: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                }
            },
        }
    });

    return blocks.map(b => b.blocked);
}

    