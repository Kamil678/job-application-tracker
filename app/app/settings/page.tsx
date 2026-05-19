import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { ProfilePage } from "@/components/app/profile/profile-page";
import type { ProfileUser } from "@/components/app/profile/types";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  const profileUser: ProfileUser = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? null,
    jobTitle: "", // profile?.jobTitle ?? ""
    location: "", // profile?.location ?? ""
    phone: "", // profile?.phone ?? ""
    website: "", // profile?.website ?? ""
    github: "", // profile?.github ?? ""
    linkedin: "", // profile?.linkedin ?? ""
    bio: "", // profile?.bio ?? ""
    plan: "free" as const,
    createdAt: session.user.createdAt?.toISOString() ?? new Date().toISOString(),
    applicationsCount: 0, // await db.applications.count({ userId: session.user.id })
    interviewsCount: 0,
    offersCount: 0,
  };

  return <ProfilePage user={profileUser} />;
}
