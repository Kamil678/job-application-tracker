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

  const user = session.user;

  const profileUser: ProfileUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    jobTitle: user.jobTitle ?? "",
    location: user.location ?? "",
    phone: user.phone ?? "",
    websiteUrl: user.websiteUrl ?? "",
    githubUrl: user.githubUrl ?? "",
    linkedinUrl: user.linkedinUrl ?? "",
    bio: user.bio ?? "",
    plan: "free" as const,
    createdAt: session.user.createdAt?.toISOString() ?? new Date().toISOString(),
    applicationsCount: 0,
    interviewsCount: 0,
    offersCount: 0,
  };

  return <ProfilePage user={profileUser} />;
}
