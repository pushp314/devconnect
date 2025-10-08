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
                    Follow on GitHub
                </CardTitle>
                <CardDescription>
                    Get updates on new projects and contribute to the platform.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="w-full">
                    <Link href="https://github.com/pushprajsharma" target="_blank" rel="noopener noreferrer">
                        Follow @pushprajsharma
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
