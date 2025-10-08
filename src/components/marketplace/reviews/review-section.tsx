"use client";

import type { Review, User } from "@prisma/client";
import { ReviewCard } from "./review-card";
import { ReviewForm } from "./review-form";
import { StarRating } from "../star-rating";

type PopulatedReview = Review & { user: User };

interface ReviewSectionProps {
    componentId: string;
    reviews: PopulatedReview[];
    averageRating: number;
    totalReviews: number;
    hasPurchased: boolean;
    userReview?: Review;
}

export function ReviewSection({
    componentId,
    reviews,
    averageRating,
    totalReviews,
    hasPurchased,
    userReview,
}: ReviewSectionProps) {

  return (
    <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
            <div>
                <h2 className="text-2xl font-bold font-headline">Reviews</h2>
                <div className="flex items-center gap-2 mt-2">
                    <StarRating rating={averageRating} />
                    <span className="text-muted-foreground">({totalReviews})</span>
                </div>
                <p className="text-muted-foreground text-sm mt-2">{averageRating.toFixed(1)} out of 5 stars</p>

                <div className="mt-8">
                    {hasPurchased && (
                        <ReviewForm
                            componentId={componentId}
                            existingReview={userReview}
                        />
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))
                ) : (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                        <h3 className="text-lg font-semibold">No Reviews Yet</h3>
                        <p className="text-sm mt-1">Be the first to review this component after purchasing.</p>
                    </div>
                )}
            </div>
        </div>
    </section>
  );
}
