import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { componentId } = await req.json();
    const component = await db.component.findUnique({ where: { id: componentId } });

    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }

    if (component.price === 0) {
        return NextResponse.json({ error: 'Component is free' }, { status: 400 });
    }

    const options = {
      amount: component.price * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_${component.id.slice(0,10)}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json({ order });

  } catch (error) {
    console.error('RAZORPAY_CREATE_ORDER_ERROR', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
