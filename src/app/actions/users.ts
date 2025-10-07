'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createNotification } from './notifications';
import type { User, Snippet, Document, Like, Comment, SavedSnippet, DocumentSave } from '@prisma/client';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  bio: z.string().max(200, 'Bio must be less than 200 characters.').optional(),
  githubUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  twitterUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
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
    savedDocs: (DocumentSave & { document: PopulatedDocForProfile })[];
}

export async function getUserProfile(username: string) {
  const session = await auth();
  const currentUserId = session?.user?.id;

  const user = await db.user.findUnique({
    where: { username },
    include: {
      snippets: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: true,
          likes: true,
          comments: true,
        },
      },
      documents: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: true,
          likes: true,
          comments: true,
        },
      },
      followers: true,
      following: true,
      savedSnippets: {
        include: {
          snippet: {
            include: {
              author: true,
              likes: true,
              comments: true,
            },
          },
        },
      },
      savedDocs: {
        include: {
          document: {
            include: {
              author: true,
              likes: true,
              comments: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return null;
  }

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

  return {
    ...user,
    isFollowing,
    followersCount: user.followers.length,
    followingCount: user.following.length,
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

  const targetUser = await db.user.findUnique({ where: { id: targetUserId } });
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
        link: `/profile/${session.user.username}`,
    });
  }
  revalidatePath(`/profile/${targetUser.username}`);
}

export async function updateUserProfile(values: z.infer<typeof profileSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in to update your profile.');
  }
  
  const validatedFields = profileSchema.safeParse(values);
  if (!validatedFields.success) {
      throw new Error("Invalid profile data.");
  }

  const { name, bio, githubUrl, twitterUrl } = validatedFields.data;

  const updatedUser = await db.user.update({
    where: { id: session.user.id },
    data: {
      name,
      bio: bio ?? null,
      githubUrl: githubUrl ?? null,
      twitterUrl: twitterUrl ?? null,
    },
  });

  revalidatePath(`/profile/${updatedUser.username}`);
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
      createdAt: 'desc',
    },
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
                    author: true,
                    likes: true,
                    comments: true,
                    savedBy: true,
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
                    author: true,
                    likes: true,
                    comments: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const populatedSnippets = savedSnippets.map(s => {
        const snippet = s.snippet;
        return {
            ...snippet,
            likesCount: snippet.likes.length,
            commentsCount: snippet.comments.length,
            isLiked: !!snippet.likes.find(like => like.userId === session.user?.id),
            isSaved: !!snippet.savedBy.find(save => save.userId === session.user?.id),
        }
    });
    
    const populatedDocs = savedDocuments.map(d => ({
        ...d.document,
        likesCount: d.document.likes.length,
        commentsCount: d.document.comments.length,
    }));

    return { savedSnippets: populatedSnippets, savedDocuments: populatedDocs };
}
