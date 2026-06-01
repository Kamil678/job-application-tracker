import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";

export async function DELETE() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await cloudinary.uploader.destroy(`avatars/user_${session.user.id}`);

  const db = await getDb();
  await db.collection("user").updateOne({ _id: new ObjectId(session.user.id) }, { $unset: { image: "" } });

  return Response.json({ success: true });
}
