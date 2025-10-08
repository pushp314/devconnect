'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';

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
