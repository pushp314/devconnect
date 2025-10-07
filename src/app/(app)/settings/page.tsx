"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Settings</CardTitle>
          <CardDescription>Manage your account and profile settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-headline">Profile</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="jane.doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" placeholder="Tell us about yourself" defaultValue="I'm a passionate developer who loves building cool things with Next.js and Tailwind!" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input id="github" placeholder="https://github.com/username" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="twitter">Twitter / X</Label>
              <Input id="twitter" placeholder="https://twitter.com/username" />
            </div>
          </div>
          <div className="space-y-4">
             <h3 className="text-lg font-semibold font-headline">Appearance</h3>
             <div className="space-y-2">
               <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Select the theme for the dashboard.</p>
             </div>
          </div>
           <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
