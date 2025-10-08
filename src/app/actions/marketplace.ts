'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import type { Component, User, Order } from '@prisma/client';
import { z } from 'zod';
import { notFound, redirect } from 'next/navigation';

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

export async function getMarketplaceComponentById(id: string) {
    const session = await auth();
    const component = await db.component.findUnique({
        where: { id }, // Allow viewing pending components if you have the link
        include: {
            creator: true,
        },
    });

    if (!component || (component.status !== 'approved' && component.creatorId !== session?.user?.id)) {
        notFound();
    }
    
    return component as PopulatedMarketplaceComponent;
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

export async function createOrder({
  componentId,
  amount,
}: {
  componentId: string;
  amount: number;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Authentication required.');
  }

  const component = await db.component.findUnique({ where: { id: componentId } });
  if (!component) throw new Error('Component not found');

  if (component.price !== amount) {
    throw new Error('Price mismatch detected.');
  }

  // Add to purchased IDs first
  await db.user.update({
    where: { id: session.user.id },
    data: {
      purchasedComponentIds: {
        push: componentId,
      },
    },
  });

  const order = await db.order.create({
    data: {
      userId: session.user.id,
      componentId: componentId,
      amount: amount,
      status: 'completed',
    },
  });

  revalidatePath(`/components-marketplace/${componentId}`);
  revalidatePath('/dashboard/components');
  return order;
}

export async function downloadFreeComponent(componentId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Authentication required.');
    }

    const component = await db.component.findUnique({ where: { id: componentId } });
    if (!component) throw new Error('Component not found');

    if (component.price !== 0) {
        throw new Error('This component is not free.');
    }

    // Check if already "purchased"
    const existingOrder = await db.order.findFirst({
        where: { userId: session.user.id, componentId: componentId }
    });

    if (!existingOrder) {
        await createOrder({ componentId, amount: 0 });
    }

    revalidatePath(`/components-marketplace/${componentId}`);
    return { fileUrl: component.zipFileUrl };
}


export async function getPurchasedComponentsForUser() {
    const session = await auth();
    if (!session?.user?.id) {
        return [];
    }

    const orders = await db.order.findMany({
        where: { userId: session.user.id },
        include: {
            component: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return orders.map(order => order.component);
}

export async function getUploadedComponentsForUser() {
    const session = await auth();
    if (!session?.user?.id) {
        return [];
    }

    return db.component.findMany({
        where: { creatorId: session.user.id },
        orderBy: {
            createdAt: 'desc'
        }
    });
}
