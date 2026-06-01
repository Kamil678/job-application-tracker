import { getSession } from "@/lib/auth/auth";
import { ProfilePage } from "@/components/app/profile/profile-page";
import type { ProfileUser } from "@/components/app/profile/types";

export default async function Page() {
  const session = await getSession();
  const user = session!.user;

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
    createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
    applicationsCount: 0,
    interviewsCount: 0,
    offersCount: 0,
  };

  return <ProfilePage user={profileUser} />;
}
