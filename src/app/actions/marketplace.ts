'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import type { Component, User } from '@prisma/client';

export type PopulatedMarketplaceComponent = Component & {
    creator: User
}

export async function getMarketplaceComponents({ query }: { query?: string }) {
  const components = await db.component.findMany({
    where: {
      status: 'approved',
      OR: query
        ? [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } },
          ]
        : undefined,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      creator: true,
    },
  });
  return components as PopulatedMarketplaceComponent[];
}
