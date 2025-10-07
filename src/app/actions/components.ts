'use server';

import { db } from '@/lib/db';

export async function getComponents({ query }: { query?: string }) {
  return db.component.findMany({
    where: {
      OR: query
        ? [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } },
          ]
        : undefined,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
    },
  });
}
