'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import type { Notification } from '@prisma/client';

export async function createNotification(data: Omit<Notification, 'id' | 'read' | 'createdAt'>) {
    await db.notification.create({
        data,
    });
    revalidatePath('/layout'); // Revalidate layout to update header
}


export async function getNotifications() {
  const session = await auth();
  if (!session?.user?.id) {
    // Return empty array if not logged in, as this is called by a server component
    return [];
  }

  return db.notification.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: { createdAt: 'desc' },
    take: 10, // Limit to 10 recent notifications
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

  revalidatePath('/layout'); // Revalidate layout to update header
}
