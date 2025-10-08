import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Review, User } from "@prisma/client";
import Link from "next/link";
import { StarRating } from "../star-rating";

type PopulatedReview = Review & { user: User };

interface ReviewCardProps {
  review: PopulatedReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const user = review.user;
  const userInitials = user.name?.split(' ').map(n => n[0]).join('') ?? '';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <Avatar>
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? ''} data-ai-hint="person face" />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Link href={`/${user.username}`} className="font-semibold hover:underline">{user.name}</Link>
          <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
        <StarRating rating={review.rating} />
      </CardHeader>
      <CardContent>
        {review.text && <p className="text-sm text-muted-foreground">{review.text}</p>}
      </CardContent>
    </Card>
  );
}
