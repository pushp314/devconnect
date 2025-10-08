import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createOrder } from '@/app/actions/marketplace';

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            componentId,
            amount
        } = await req.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');
        
        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Payment is authentic, create order in DB
            await createOrder({ componentId, amount });
            
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
        }

    } catch (error) {
        console.error('RAZORPAY_VERIFY_ERROR', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
