import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import * as LucideIcons from "lucide-react";

type IconName = keyof typeof LucideIcons;

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: IconName;
  description?: string;
}

export function AnalyticsCard({ title, value, icon, description }: AnalyticsCardProps) {
  const Icon = LucideIcons[icon] as React.ElementType;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <div className="text-muted-foreground"><Icon className="h-4 w-4" /></div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}

export function AnalyticsCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-2/4" />
                <Skeleton className="h-6 w-6 rounded-sm" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-7 w-1/4 mb-2" />
                <Skeleton className="h-3 w-3/4" />
            </CardContent>
        </Card>
    );
}
