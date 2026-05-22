"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

type ProfileData = {
  name?: string;
  jobTitle?: string;
  location?: string;
  phone?: string;
  websiteUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  bio?: string;
};

type ActionResult = { success: true } | { success: false; errors: Partial<Record<keyof ProfileData, string>> };

export async function updateProfile(data: ProfileData): Promise<ActionResult> {
  const errors: Partial<Record<keyof ProfileData, string>> = {};

  if (!data.name?.trim()) {
    errors.name = "Full name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Full name must be at least 2 characters";
  }

  if (data.phone && !/^\+?[\d\s\-()]{7,}$/.test(data.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  if (data.bio && data.bio.length > 500) {
    errors.bio = `Bio can be max 500 characters (you have ${data.bio.length})`;
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, errors: { name: "No session found, please log in again" } };

    await db.collection("user").updateOne({ _id: new ObjectId(session.user.id) }, { $set: data });

    return { success: true };
  } catch {
    return { success: false, errors: { name: "Server error, please try again" } };
  }
}
