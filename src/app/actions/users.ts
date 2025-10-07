'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getUserProfile(username: string) {
  const session = await auth();
  const currentUser = session?.user;

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
                }
            }
        }
      },
      savedDocuments: {
         include: {
            document: {
                include: {
                    author: true,
                    likes: true,
                    comments: true,
                }
            }
         }
      }
    },
  });

  if (!user) {
    return null;
  }

  const isFollowing = currentUser
    ? !!(await db.follows.findFirst({
        where: {
          followerId: currentUser.id,
          followingId: user.id,
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

export async function toggleFollow(userId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in to follow a user.');
  }

  const currentUserId = session.user.id;

  if (currentUserId === userId) {
    throw new Error('You cannot follow yourself.');
  }

  const existingFollow = await db.follows.findFirst({
    where: {
      followerId: currentUserId,
      followingId: userId,
    },
  });

  if (existingFollow) {
    await db.follows.delete({
      where: {
        id: existingFollow.id,
      },
    });
    revalidatePath(`/profile/${userId}`);
    return { followed: false };
  } else {
    await db.follows.create({
      data: {
        followerId: currentUserId,
        followingId: userId,
      },
    });
    revalidatePath(`/profile/${userId}`);
    return { followed: true };
  }
}

export async function updateUserProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('You must be logged in to update your profile.');
    }

    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;
    // Add other fields as necessary

    const updatedUser = await db.user.update({
        where: { id: session.user.id },
        data: {
            name,
            bio,
        },
    });
    
    revalidatePath(`/profile/${updatedUser.username}`);
    revalidatePath('/settings');
    
    return updatedUser;
}

export async function getUsers({ query }: { query?: string }) {
    const users = await db.user.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { username: { contains: query, mode: 'insensitive' } },
            ],
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return users;
}
