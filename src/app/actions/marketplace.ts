'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import type { Component, User } from '@prisma/client';
import { z } from 'zod';

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


const uploadComponentSchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(10).max(1000),
    price: z.number().min(0),
    tags: z.array(z.string()).min(1).max(10),
    previewUrls: z.array(z.string()).min(1),
    zipFileUrl: z.string().min(1),
});

export async function uploadComponent(values: z.infer<typeof uploadComponentSchema>) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('You must be logged in to upload a component.');
    }

    const validatedFields = uploadComponentSchema.safeParse(values);
    if (!validatedFields.success) {
        console.error(validatedFields.error);
        throw new Error('Invalid component data.');
    }

    const { title, description, price, tags, previewUrls, zipFileUrl } = validatedFields.data;

    await db.component.create({
        data: {
            title,
            description,
            price,
            tags,
            previewUrls,
            zipFileUrl,
            creatorId: session.user.id,
            status: 'pending',
        }
    });

    revalidatePath('/components-marketplace');
    revalidatePath('/dashboard/components');
}
