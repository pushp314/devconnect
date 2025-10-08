'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

async function verifyAdmin() {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.ADMIN) {
        throw new Error("Unauthorized");
    }
    return session.user;
}

export async function getAdminDashboardAnalytics() {
    await verifyAdmin();

    const totalRevenue = await db.order.aggregate({
        _sum: {
            amount: true,
        }
    });

    const totalSales = await db.order.count();

    const pendingComponents = await db.component.count({
        where: {
            status: 'pending'
        }
    });

    const totalUsers = await db.user.count();

    return {
        totalRevenue: totalRevenue._sum.amount ?? 0,
        totalSales,
        pendingComponents,
        totalUsers,
    }
}

export async function getUsersForAdmin() {
    await verifyAdmin();
    return db.user.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
}

const updateUserRoleSchema = z.object({
    userId: z.string(),
    role: z.nativeEnum(Role),
});

export async function updateUserRole(values: z.infer<typeof updateUserRoleSchema>) {
    await verifyAdmin();
    
    const validatedFields = updateUserRoleSchema.safeParse(values);
    if (!validatedFields.success) {
        throw new Error("Invalid input.");
    }
    const { userId, role } = validatedFields.data;

    await db.user.update({
        where: { id: userId },
        data: { role },
    });

    revalidatePath('/admin/users');
}


const updateUserStatusSchema = z.object({
  userId: z.string(),
  isBlocked: z.boolean(),
});

export async function updateUserStatus(values: z.infer<typeof updateUserStatusSchema>) {
  const admin = await verifyAdmin();

  const validatedFields = updateUserStatusSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error('Invalid input.');
  }
  const { userId, isBlocked } = validatedFields.data;

  if (userId === admin.id) {
    throw new Error("Admins cannot block themselves.");
  }

  await db.user.update({
    where: { id: userId },
    data: { isBlocked },
  });

  revalidatePath('/admin/users');
}
