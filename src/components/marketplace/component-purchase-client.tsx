"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Download, Loader2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import type { PopulatedMarketplaceComponent } from "@/app/actions/marketplace";
import { useToast } from '@/hooks/use-toast';
import { downloadFreeComponent } from '@/app/actions/marketplace';

declare const Razorpay: any;

interface ComponentPurchaseClientProps {
    component: PopulatedMarketplaceComponent;
}

export function ComponentPurchaseClient({ component }: ComponentPurchaseClientProps) {
    const user = useCurrentUser();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleFreeDownload = async () => {
        setIsLoading(true);
        try {
            const result = await downloadFreeComponent(component.id);
            if (result.fileUrl) {
                // Trigger download
                const link = document.createElement('a');
                link.href = result.fileUrl;
                link.setAttribute('download', '');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                toast({ title: "Download started!" });
                router.refresh(); // Refresh to show the download button
            }
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Download failed', description: (error as Error).message });
        } finally {
            setIsLoading(false);
        }
    }

    const handlePaidPurchase = async () => {
        setIsLoading(true);
        try {
            // 1. Create order on server
            const orderResponse = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ componentId: component.id }),
            });
            
            if (!orderResponse.ok) throw new Error('Failed to create order.');
            const { order } = await orderResponse.json();

            // 2. Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "CodeStudio",
                description: `Purchase: ${component.title}`,
                order_id: order.id,
                handler: async function (response: any) {
                    // 3. Verify payment on server
                    const verifyResponse = await fetch('/api/razorpay/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            componentId: component.id,
                            amount: component.price,
                        }),
                    });

                    if (!verifyResponse.ok) throw new Error('Payment verification failed.');

                    toast({ title: 'Payment Successful!', description: 'Your component is ready to download.' });
                    router.push('/dashboard/components'); // Redirect to dashboard
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: {
                    color: "#3399cc"
                }
            };
            
            const rzp = new Razorpay(options);
            rzp.on('payment.failed', function (response: any){
                toast({ variant: 'destructive', title: 'Payment Failed', description: response.error.description });
                setIsLoading(false);
            });
            rzp.open();

        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Purchase Failed', description: (error as Error).message });
            setIsLoading(false);
        }
    };
    
    const handlePurchase = async () => {
        if (!user) {
            router.push('/auth/signin?callbackUrl=' + encodeURIComponent(`/components-marketplace/${component.id}`));
            return;
        }

        if (component.price === 0) {
            await handleFreeDownload();
        } else {
            await handlePaidPurchase();
        }
    };

    return (
        <Button onClick={handlePurchase} className="w-full text-lg h-12" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 animate-spin" />}
            {component.price === 0 ? (
                <>
                    <Download className="mr-2" />
                    Download for Free
                </>
            ) : (
                <>
                    <ShoppingCart className="mr-2" />
                    Buy Now
                </>
            )}
        </Button>
    )
}