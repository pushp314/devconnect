'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

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
    orderBy: { createdAt: 'desc' },
    include: {
      reporter: true,
      upvotes: true,
      comments: true,
    },
  });
}
