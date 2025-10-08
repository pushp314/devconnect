import { getMarketplaceComponents } from "@/app/actions/marketplace";
import { MarketplaceComponentCard } from "@/components/marketplace/component-card";
import { auth } from "@/lib/auth";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default async function ComponentsMarketplacePage() {
  const session = await auth();
  const components = await getMarketplaceComponents({});

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold font-headline">Component Marketplace</h1>
            <p className="text-muted-foreground mt-2">Discover components built by the CodeStudio community.</p>
        </div>
        {session?.user && (
            <Button asChild>
                <Link href="/components-marketplace/upload">
                    <PlusCircle className="mr-2" />
                    Upload Component
                </Link>
            </Button>
        )}
      </div>
      {components.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {components.map((component) => (
            <MarketplaceComponentCard key={component.id} component={component} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">Marketplace is Empty</h2>
          <p className="mt-2">No components have been uploaded yet. Be the first!</p>
        </div>
      )}
    </div>
  );
}
