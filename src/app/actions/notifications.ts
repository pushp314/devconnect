'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getNotifications() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in to view notifications.');
  }

  return db.notification.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function markAsRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in.');
  }

  await db.notification.update({
    where: { id: notificationId, userId: session.user.id },
    data: { read: true },
  });

  revalidatePath('/notifications'); // Or wherever notifications are displayed
}
