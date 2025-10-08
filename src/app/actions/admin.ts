'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// A real app would have role-based access control.
// For this MVP, we just check if the user is logged in.
async function verifyAdmin() {
    const session = await auth();
    if (!session?.user) {
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