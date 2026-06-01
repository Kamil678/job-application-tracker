"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { profileSchema, type ProfileFormData } from "@/components/app/profile/profile.schema";

type FieldErrors = Partial<Record<keyof ProfileFormData, string>>;
type ActionResult = { success: true } | { success: false; errors: FieldErrors };

export async function updateProfile(data: ProfileFormData): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) {
    const errors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof ProfileFormData;
      if (field && !errors[field]) errors[field] = issue.message;
    }
    return { success: false, errors };
  }

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, errors: { name: "No session found, please log in again" } };

    const db = await getDb();
    await db.collection("user").updateOne({ _id: new ObjectId(session.user.id) }, { $set: parsed.data });
    revalidatePath("/app/settings");
    return { success: true };
  } catch {
    return { success: false, errors: { name: "Server error, please try again" } };
  }
}
