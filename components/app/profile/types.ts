export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  jobTitle?: string;
  location?: string;
  phone?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  bio?: string;
  plan: "free" | "pro" | "team";
  createdAt: string;
  applicationsCount: number;
  interviewsCount: number;
  offersCount: number;
}
