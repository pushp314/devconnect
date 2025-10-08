import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { z } from 'zod';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const orderSchema = z.object({
  componentId: z.string(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { componentId } = orderSchema.parse(body);

    const component = await db.component.findUnique({
      where: { id: componentId },
    });

    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }
    
    if (component.price <= 0) {
        return NextResponse.json({ error: 'This is a free component' }, { status: 400 });
    }

    const amount = component.price * 100; // Amount in paisa
    const currency = 'INR';

    const options = {
      amount,
      currency,
      receipt: `receipt_component_${component.id}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ order });

  } catch (error) {
    console.error('[RAZORPAY_CREATE_ORDER]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
