import { getMarketplaceComponents } from "@/app/actions/marketplace";
import { MarketplaceComponentCard } from "@/components/marketplace/component-card";
import { auth } from "@/lib/auth";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { MarketplaceSearch } from "@/components/marketplace/marketplace-search";

export default async function ComponentsMarketplacePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  
  const query = typeof searchParams.query === "string" ? searchParams.query : undefined;
  const sortBy = typeof searchParams.sortBy === "string" ? searchParams.sortBy : "newest";
  
  const components = await getMarketplaceComponents({ query, sortBy });

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold font-headline">Component Marketplace</h1>
            <p className="text-muted-foreground mt-2">Discover components built by the CodeStudio community.</p>
        </div>
        <div className="flex items-center gap-4">
          <MarketplaceSearch />
          {session?.user && (
              <Button asChild>
                  <Link href="/marketplace/upload">
                      <PlusCircle className="mr-2" />
                      <span className="hidden sm:inline">Upload</span>
                  </Link>
              </Button>
          )}
        </div>
      </div>
      {components.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {components.map((component) => (
            <MarketplaceComponentCard key={component.id} component={component} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No Components Found</h2>
          <p className="mt-2">Try adjusting your search or filter. Or, be the first to upload!</p>
        </div>
      )}
    </div>
  );
}
