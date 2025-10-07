import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitHubIcon, GoogleIcon } from "@/components/icons";
import { Code } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 font-bold text-2xl mb-2">
            <Code className="w-8 h-8 text-primary" />
            <h1 className="font-headline">CodeStudio</h1>
          </Link>
          <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to continue to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full h-12 text-base">
              <GitHubIcon className="mr-2 h-5 w-5" />
              Sign in with GitHub
            </Button>
            <Button variant="outline" className="w-full h-12 text-base">
              <GoogleIcon className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>By signing in, you agree to our Terms of Service.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
