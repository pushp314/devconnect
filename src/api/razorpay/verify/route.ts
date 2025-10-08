import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import { createOrder } from '@/app/actions/marketplace';

const verifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  componentId: z.string(),
  amount: z.number(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = verifySchema.parse(body);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, componentId, amount } = parsedBody;

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    
    // If signature is valid, create an order in our database
    const newOrder = await createOrder({ componentId, amount });

    return NextResponse.json({ success: true, orderId: newOrder.id });
    
  } catch (error) {
    console.error('[RAZORPAY_VERIFY]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
