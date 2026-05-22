import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

export async function DELETE() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await cloudinary.uploader.destroy(`avatars/user_${session.user.id}`);

  await db.collection("user").updateOne({ _id: new ObjectId(session.user.id) }, { $unset: { image: "" } });

  return Response.json({ success: true });
}
