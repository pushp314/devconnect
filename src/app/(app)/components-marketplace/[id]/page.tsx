import { getMarketplaceComponentById } from "@/app/actions/marketplace";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { ComponentPurchaseClient } from "@/components/marketplace/component-purchase-client";

export default async function ComponentDetailPage({ params }: { params: { id: string } }) {
  const component = await getMarketplaceComponentById(params.id);
  const author = component.creator;
  const authorInitials = author.name?.split(' ').map(n => n[0]).join('') ?? '';

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
        {/* Left Column: Previews and Description */}
        <div>
          <h1 className="text-4xl font-extrabold font-headline tracking-tight lg:text-5xl mb-4">
            {component.title}
          </h1>

           <div className="flex items-center gap-4 text-muted-foreground mb-8">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={author.image ?? undefined} alt={author.name ?? ''} data-ai-hint="person face" />
                  <AvatarFallback>{authorInitials}</AvatarFallback>
                </Avatar>
                <Link href={`/profile/${author.username}`} className="font-medium text-lg hover:underline">{author.name}</Link>
              </div>
            </div>

          <Carousel className="w-full mb-8 rounded-lg overflow-hidden border">
            <CarouselContent>
              {component.previewUrls.map((url, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-video">
                    <Image
                      src={url}
                      alt={`${component.title} preview ${index + 1}`}
                      fill
                      className="object-cover"
                      data-ai-hint="component preview"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
          
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="font-headline text-2xl">About this Component</h2>
            <p className="text-muted-foreground">{component.description}</p>
          </div>
        </div>

        {/* Right Column: Purchase Box */}
        <aside className="sticky top-24 h-fit">
          <div className="border rounded-lg p-6">
              <h2 className="text-3xl font-bold mb-6">
                  {component.price === 0 ? "Free Download" : `₹${component.price}`}
              </h2>
              
              <ComponentPurchaseClient component={component} />

              <div className="mt-8">
                <h3 className="font-headline font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {component.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
              </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
