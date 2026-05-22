"use client";

import { Shield, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileStats } from "./profile-stats";
import { ProfileForm } from "./profile-form";
import { SecurityForm } from "./security-form";
import type { ProfileUser } from "./types";

interface ProfilePageProps {
  user: ProfileUser;
}

const TABS = [
  { value: "profile", icon: User, label: "Profile" },
  { value: "security", icon: Shield, label: "Security" },
] as const;

export function ProfilePage({ user }: ProfilePageProps) {
  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your account settings and preferences</p>
        </div>
        <Badge variant="outline" className="text-xs rounded-xl px-3 py-1 font-medium">
          Member since {joinedDate}
        </Badge>
      </div>

      <ProfileStats applicationsCount={user.applicationsCount} interviewsCount={user.interviewsCount} offersCount={user.offersCount} />

      <Tabs defaultValue="profile" className="space-y-5">
        <TabsList className="rounded-full bg-muted p-1 h-auto gap-1">
          {TABS.map(({ value, icon: Icon, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="rounded-full text-xs font-medium px-3 py-1.5 gap-1.5 cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Icon size={13} />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile">
          <ProfileForm user={user} />
        </TabsContent>

        <TabsContent value="security">
          <SecurityForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
