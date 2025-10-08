import { auth } from "@/lib/auth";
import { getUserProfile, getBlockedUsers } from "@/app/actions/users";
import { SettingsForm } from "@/components/forms/settings-form";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlockedUsersList } from "@/components/blocked-users-list";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.username) {
    redirect("/auth/signin");
  }

  const profile = await getUserProfile(session.user.username);
  if (!profile) {
    notFound();
  }

  const blockedUsers = await getBlockedUsers();

  return (
    <div className="container max-w-3xl mx-auto py-8">
       <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="profile">Profile & Appearance</TabsTrigger>
          <TabsTrigger value="blocked">Blocked Users</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Profile Settings</CardTitle>
              <CardDescription>Manage your public profile and theme preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm profile={profile} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="blocked">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Blocked Users</CardTitle>
              <CardDescription>Users you block will not be able to interact with you or view your profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <BlockedUsersList initialBlockedUsers={blockedUsers} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
