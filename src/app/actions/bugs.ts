'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { createNotification } from './notifications';

const bugReportSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10),
});

export async function reportBug(values: z.infer<typeof bugReportSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in to report a bug.');
  }

  const validatedFields = bugReportSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error('Invalid bug report data.');
  }

  const { title, description } = validatedFields.data;

  await db.bug.create({
    data: {
      title,
      description,
      reporterId: session.user.id,
      status: 'OPEN',
    },
  });

  revalidatePath('/bugs');
}

export async function upvoteBug(bugId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in to upvote.');
  }

  const existingUpvote = await db.bugUpvote.findFirst({
    where: {
      bugId,
      userId: session.user.id,
    },
  });

  if (existingUpvote) {
    await db.bugUpvote.delete({ where: { id: existingUpvote.id } });
  } else {
    await db.bugUpvote.create({
      data: {
        bugId,
        userId: session.user.id,
      },
    });
  }

  revalidatePath(`/bugs/${bugId}`);
  revalidatePath('/bugs');
}

export async function getBugs({
  status,
}: {
  status?: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
}) {
  return db.bug.findMany({
    where: {
      status,
    },
    orderBy: { upvotes: { _count: 'desc' } },
    include: {
      reporter: true,
      _count: {
        select: {
          upvotes: true,
          comments: true,
        },
      },
    },
  });
}

export async function getBugById(id: string) {
  const session = await auth();
  const currentUserId = session?.user?.id;

  const bug = await db.bug.findUnique({
    where: { id },
    include: {
      reporter: true,
      upvotes: {
        select: {
          userId: true,
        },
      },
       _count: {
        select: {
          upvotes: true,
          comments: true,
        },
      },
    },
  });

  if (!bug) return null;

  return {
    ...bug,
    isUpvoted: currentUserId ? bug.upvotes.some(upvote => upvote.userId === currentUserId) : false,
    upvotesCount: bug._count.upvotes,
    commentsCount: bug._count.comments,
  };
}

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty.'),
  bugId: z.string(),
});

export async function addBugComment(values: z.infer<typeof commentSchema>) {
  const session = await auth();
  if (!session?.user?.id || !session.user.name) {
    throw new Error('You must be logged in to comment.');
  }

  const validatedFields = commentSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error('Invalid comment data.');
  }

  const { content, bugId } = validatedFields.data;
  
  const bug = await db.bug.findUnique({ where: { id: bugId }});
  if (!bug) throw new Error('Bug not found');

  await db.bugComment.create({
    data: {
      content,
      authorId: session.user.id,
      bugId,
    },
  });
  
  if (session.user.id !== bug.reporterId) {
    await createNotification({
        userId: bug.reporterId,
        type: 'COMMENT',
        message: `${session.user.name} commented on your bug report: "${bug.title}"`,
        link: `/bugs/${bug.id}`,
    });
  }

  revalidatePath(`/bugs/${bugId}`);
}

export async function getBugComments(bugId: string) {
  return db.bugComment.findMany({
    where: { bugId },
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}
