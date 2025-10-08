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
