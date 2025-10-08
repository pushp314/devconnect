import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { PopulatedMarketplaceComponent } from "@/app/actions/marketplace";

interface MarketplaceComponentCardProps {
  component: PopulatedMarketplaceComponent;
}

export function MarketplaceComponentCard({ component }: MarketplaceComponentCardProps) {
  const author = component.creator;
  const authorInitials = author.name?.split(' ').map(n => n[0]).join('') ?? '';

  return (
    <Link href={`/components-marketplace/${component.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 h-full flex flex-col">
        <CardHeader className="p-0 border-b">
          <div className="relative aspect-video">
            <Image
              src={component.previewUrls[0] || `https://picsum.photos/seed/${component.id}/600/400`}
              alt={component.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              data-ai-hint="component preview"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
            <h3 className="font-bold font-headline text-lg truncate group-hover:text-primary">{component.title}</h3>
            <div className="mt-2 flex flex-wrap gap-1">
                {component.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
            </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm">
           <div className="flex items-center gap-2 text-muted-foreground">
             <Avatar className="h-6 w-6">
                <AvatarImage src={author.image ?? undefined} alt={author.name ?? ''} data-ai-hint="person face" />
                <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
             </Avatar>
             <span className="truncate text-xs">{author.name}</span>
           </div>
           <span className="font-semibold text-base text-primary">
                {component.price === 0 ? 'Free' : `₹${component.price}`}
           </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
