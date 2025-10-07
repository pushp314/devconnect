import { auth } from "@/lib/auth";
import { getUserProfile } from "@/app/actions/users";
import { SettingsForm } from "@/components/forms/settings-form";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.username) {
    redirect("/auth/signin");
  }

  const profile = await getUserProfile(session.user.username);
  if (!profile) {
    notFound();
  }

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Settings</CardTitle>
          <CardDescription>Manage your account and profile settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
}
