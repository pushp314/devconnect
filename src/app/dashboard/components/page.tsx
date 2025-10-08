import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPurchasedComponentsForUser, getUploadedComponentsForUser } from "@/app/actions/marketplace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default async function DashboardComponentsPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/auth/signin?callbackUrl=/dashboard/components");
    }

    const purchasedComponents = await getPurchasedComponentsForUser();
    const uploadedComponents = await getUploadedComponentsForUser();

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold font-headline mb-6">My Components</h1>
            
            <Tabs defaultValue="purchased">
                <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
                    <TabsTrigger value="purchased">My Purchases</TabsTrigger>
                    <TabsTrigger value="uploaded">My Uploads</TabsTrigger>
                </TabsList>
                <TabsContent value="purchased" className="mt-8">
                    {purchasedComponents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {purchasedComponents.map(comp => (
                                <Card key={comp.id}>
                                    <CardHeader className="p-0">
                                        <Image src={comp.previewUrls[0]} alt={comp.title} width={400} height={225} className="aspect-video object-cover rounded-t-lg" data-ai-hint="component preview" />
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <CardTitle className="text-lg font-headline">{comp.title}</CardTitle>
                                    </CardContent>
                                    <CardFooter>
                                        <Button asChild className="w-full">
                                            <a href={comp.zipFileUrl} download>
                                                <Download className="mr-2 h-4 w-4" />
                                                Download
                                            </a>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                         <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground mt-8">
                            <h2 className="text-xl font-semibold">No Purchases Yet</h2>
                            <p className="mt-2 mb-4">Components you buy will appear here.</p>
                             <Button asChild>
                                <Link href="/marketplace">
                                    Explore Marketplace
                                </Link>
                            </Button>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="uploaded" className="mt-8">
                     {uploadedComponents.length > 0 ? (
                        <div className="space-y-4">
                            {uploadedComponents.map(comp => (
                                <Card key={comp.id} className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <Image src={comp.previewUrls[0]} alt={comp.title} width={120} height={67} className="aspect-video object-cover rounded-md" data-ai-hint="component preview" />
                                        <div>
                                            <h3 className="font-semibold font-headline">{comp.title}</h3>
                                            <p className="text-sm text-muted-foreground">{comp.price === 0 ? 'Free' : `₹${comp.price}`}</p>
                                        </div>
                                    </div>
                                    <Badge variant={
                                        comp.status === 'approved' ? 'default'
                                        : comp.status === 'pending' ? 'secondary'
                                        : 'destructive'
                                    } className={cn(
                                        comp.status === 'approved' && 'bg-green-600 text-white'
                                    )}>
                                        {comp.status}
                                    </Badge>
                                </Card>
                            ))}
                        </div>
                    ) : (
                         <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground mt-8">
                            <h2 className="text-xl font-semibold">No Uploads Yet</h2>
                            <p className="mt-2 mb-4">Share your first component with the community.</p>
                             <Button asChild>
                                <Link href="/marketplace/upload">
                                    Upload Component
                                </Link>
                            </Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
