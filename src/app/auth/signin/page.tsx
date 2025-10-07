import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GitHubIcon, GoogleIcon } from "@/components/icons";
import { Code } from "lucide-react";
import { signIn } from "next-auth/react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/auth/signin-button";

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/feed");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="text-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 font-bold text-2xl mb-2"
          >
            <Code className="w-8 h-8 text-primary" />
            <h1 className="font-headline">CodeStudio</h1>
          </Link>
          <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to continue to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <SignInButton provider="github" icon={<GitHubIcon className="mr-2 h-5 w-5" />}>
                Sign in with GitHub
            </SignInButton>
             <SignInButton provider="google" icon={<GoogleIcon className="mr-2 h-5 w-5" />}>
                Sign in with Google
            </SignInButton>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>By signing in, you agree to our Terms of Service.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
