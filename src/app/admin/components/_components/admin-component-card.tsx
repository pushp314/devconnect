import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PopulatedMarketplaceComponent } from '@/app/actions/marketplace';
import { AdminActions } from './admin-actions';

interface AdminComponentCardProps {
    component: PopulatedMarketplaceComponent
}

export function AdminComponentCard({ component }: AdminComponentCardProps) {
    const author = component.creator;
    const authorInitials = author.name?.split(' ').map(n => n[0]).join('') ?? '';
    
    return (
        <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4 flex-grow">
                    <Image 
                        src={component.previewUrls[0]} 
                        alt={component.title}
                        width={160}
                        height={90}
                        className="aspect-video object-cover rounded-md border"
                        data-ai-hint="component preview"
                    />
                    <div className="flex-grow">
                        <Link href={`/components-marketplace/${component.id}`} target="_blank" className="font-bold text-lg font-headline hover:underline">
                            {component.title}
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={author.image ?? undefined} alt={author.name ?? ''} data-ai-hint="person face" />
                                <AvatarFallback>{authorInitials}</AvatarFallback>
                            </Avatar>
                            <span>{author.name}</span>
                        </div>
                         <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{component.description}</p>
                         <div className="mt-2 flex flex-wrap gap-1">
                             {component.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                         </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 self-stretch justify-between shrink-0 ml-4">
                     <div className="font-semibold text-lg">{component.price === 0 ? 'Free' : `₹${component.price}`}</div>
                     <AdminActions componentId={component.id} />
                </div>
            </CardContent>
        </Card>
    )
}
