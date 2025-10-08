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
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { StarRating } from "@/components/marketplace/star-rating";
import { Separator } from "@/components/ui/separator";
import { ReviewSection } from "@/components/marketplace/reviews/review-section";
import type { Review } from "@prisma/client";

export default async function ComponentDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const component = await getMarketplaceComponentById(params.id);
  const author = component.creator;
  const authorInitials = author.name?.split(' ').map(n => n[0]).join('') ?? '';

  const hasPurchased = session?.user?.purchasedComponentIds.includes(component.id) ?? false;
  const userReview = component.reviews.find(review => review.userId === session?.user?.id);

  const totalReviews = component.reviews.length;
  const averageRating = totalReviews > 0
    ? component.reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
    : 0;

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-x-12 gap-y-8">
        {/* Left Column: Previews and Description */}
        <div>
          <h1 className="text-4xl font-extrabold font-headline tracking-tight lg:text-5xl mb-2">
            {component.title}
          </h1>

           <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground mb-8">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={author.image ?? undefined} alt={author.name ?? ''} data-ai-hint="person face" />
                  <AvatarFallback>{authorInitials}</AvatarFallback>
                </Avatar>
                <Link href={`/profile/${author.username}`} className="font-medium text-lg hover:underline">{author.name}</Link>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={averageRating} />
                <span className="text-sm">({totalReviews} reviews)</span>
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
          
          <div className="prose dark:prose-invert max-w-none mb-12">
            <h2 className="font-headline text-2xl mb-4">About this Component</h2>
            <p className="text-muted-foreground">{component.description}</p>
          </div>

          <Separator />
          
          <ReviewSection 
            componentId={component.id}
            reviews={component.reviews as any}
            averageRating={averageRating}
            totalReviews={totalReviews}
            hasPurchased={hasPurchased}
            userReview={userReview}
          />
        </div>

        {/* Right Column: Purchase Box */}
        <aside className="sticky top-24 h-fit">
          <div className="border rounded-lg p-6">
              <h2 className="text-3xl font-bold mb-6">
                  {component.price === 0 ? "Free Download" : `₹${component.price}`}
              </h2>
              
              {hasPurchased ? (
                  <Button asChild className="w-full text-lg h-12">
                    <a href={component.zipFileUrl} download>
                      <Download className="mr-2" />
                      Download
                    </a>
                  </Button>
              ) : (
                <ComponentPurchaseClient component={component} />
              )}
              

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
