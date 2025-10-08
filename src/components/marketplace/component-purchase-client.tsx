"use client";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Download, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import type { PopulatedMarketplaceComponent } from "@/app/actions/marketplace";

interface ComponentPurchaseClientProps {
    component: PopulatedMarketplaceComponent;
}

export function ComponentPurchaseClient({ component }: ComponentPurchaseClientProps) {
    const user = useCurrentUser();
    const router = useRouter();

    const handlePurchase = async () => {
        if (!user) {
            router.push('/auth/signin');
            return;
        }

        if (component.price === 0) {
            // Handle free download
            console.log("Downloading free component...");
        } else {
            // Handle paid purchase
            console.log("Initiating payment for component...");
        }
    };

    return (
        <Button onClick={handlePurchase} className="w-full text-lg h-12">
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
