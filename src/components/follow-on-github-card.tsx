import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "./icons";
import Link from "next/link";

export function FollowOnGitHubCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <GitHubIcon className="h-5 w-5" />
                    Follow the Team on GitHub
                </CardTitle>
                <CardDescription>
                    Get updates from the core developers and organization behind CodeStudio.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button asChild className="w-full">
                    <Link href="https://github.com/pushp314" target="_blank" rel="noopener noreferrer">
                        Follow @pushp314
                    </Link>
                </Button>
                <Button asChild className="w-full" variant="secondary">
                    <Link href="https://github.com/jsaurabh334" target="_blank" rel="noopener noreferrer">
                        Follow @jsaurabh334
                    </Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                    <Link href="https://github.com/appnity-softwares" target="_blank" rel="noopener noreferrer">
                        Follow @appnity-softwares
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
