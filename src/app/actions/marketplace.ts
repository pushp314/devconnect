'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import type { Component, User, Order, Review } from '@prisma/client';
import { z } from 'zod';
import { notFound, redirect } from 'next/navigation';

export type PopulatedMarketplaceComponent = Component & {
    creator: User;
    reviews: (Review & { user: User })[];
}

export type ReviewStats = {
    averageRating: number;
    totalReviews: number;
}

export async function getMarketplaceComponents({ query, sortBy = 'newest' }: { query?: string, sortBy?: string }) {
  const whereClause: any = {
      status: 'approved',
  };
  if (query) {
      whereClause.OR = [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } },
      ];
  }

  let orderBy: any;
  switch (sortBy) {
    case 'price-asc':
      orderBy = { price: 'asc' };
      break;
    case 'price-desc':
      orderBy = { price: 'desc' };
      break;
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' };
      break;
  }

  const components = await db.component.findMany({
    where: whereClause,
    orderBy: orderBy,
    include: {
      creator: true,
      reviews: {
        include: {
          user: true
        }
      }
    },
  });
  return components as PopulatedMarketplaceComponent[];
}


export async function getMarketplaceComponentById(id: string) {
    const session = await auth();
    const component = await db.component.findUnique({
        where: { id },
        include: {
            creator: true,
            reviews: {
              include: {
                user: true
              },
              orderBy: {
                createdAt: 'desc'
              }
            }
        },
    });

    // Only allow viewing if approved, or if the viewer is the creator
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
            zipFileUrl, // This should be zipFileUrl based on the previous implementation
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

  // For paid components, verify the price matches.
  if (component.price > 0 && component.price !== amount) {
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
    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { purchasedComponentIds: true }
    });

    if (!user?.purchasedComponentIds.includes(componentId)) {
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
    
    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { purchasedComponentIds: true }
    });

    if (!user?.purchasedComponentIds || user.purchasedComponentIds.length === 0) {
        return [];
    }

    return db.component.findMany({
        where: {
            id: {
                in: user.purchasedComponentIds
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
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


// --- Admin Actions ---
export async function getPendingComponents() {
  const session = await auth();
  // In a real app, you'd check for an admin role here
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return db.component.findMany({
    where: { status: "pending" },
    include: { creator: true },
    orderBy: { createdAt: "asc" },
  });
}

async function updateComponentStatus(componentId: string, status: "approved" | "rejected") {
    const session = await auth();
    // In a real app, you'd check for an admin role here
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    await db.component.update({
        where: { id: componentId },
        data: { status },
    });
    revalidatePath('/admin/components');
    revalidatePath('/components-marketplace');
}

export async function approveComponent(componentId: string) {
    await updateComponentStatus(componentId, 'approved');
}

export async function rejectComponent(componentId: string) {
    await updateComponentStatus(componentId, 'rejected');
}

// --- Review Actions ---

const reviewSchema = z.object({
    componentId: z.string(),
    rating: z.number().min(1).max(5),
    text: z.string().min(10, 'Review must be at least 10 characters.').max(1000).optional(),
});

export async function submitReview(values: z.infer<typeof reviewSchema>) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('You must be logged in to leave a review.');
    }
    const userId = session.user.id;

    // 1. Validate input
    const validatedFields = reviewSchema.safeParse(values);
    if (!validatedFields.success) {
        throw new Error('Invalid review data.');
    }

    const { componentId, rating, text } = validatedFields.data;
    
    // 2. Verify user has purchased the component
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { purchasedComponentIds: true }
    });

    if (!user?.purchasedComponentIds.includes(componentId)) {
        throw new Error("You must purchase a component to review it.");
    }

    // 3. Create or update the review (upsert)
    await db.review.upsert({
        where: {
            userId_componentId: {
                userId,
                componentId,
            }
        },
        update: {
            rating,
            text,
        },
        create: {
            userId,
            componentId,
            rating,
            text,
        }
    });

    // 4. Revalidate the component page
    revalidatePath(`/components-marketplace/${componentId}`);
}
