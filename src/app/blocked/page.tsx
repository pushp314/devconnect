
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from "next-auth/react";
import { SignOutButton } from '@/components/auth/signout-button';


export default function BlockedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-destructive">
        <CardHeader className="text-center">
          <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="font-headline text-2xl mt-4 text-destructive">Account Suspended</CardTitle>
          <CardDescription>
            Your account has been suspended due to a violation of our community guidelines.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-6">
            If you believe this is a mistake, please contact our support team. Otherwise, you can sign out of your account.
          </p>
          <SignOutButton />
        </CardContent>
      </Card>
    </div>
  );
}
