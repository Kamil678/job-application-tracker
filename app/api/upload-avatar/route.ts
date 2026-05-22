import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("avatar") as File;

  if (!file) return Response.json({ error: "No file provided" }, { status: 400 });
  if (!file.type.startsWith("image/")) return Response.json({ error: "File must be an image" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return Response.json({ error: "File must be under 5MB" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "avatars",
    public_id: `user_${session.user.id}`,
    overwrite: true,
    transformation: [{ width: 256, height: 256, crop: "fill", gravity: "face" }],
  });

  await db.collection("user").updateOne({ _id: new ObjectId(session.user.id) }, { $set: { image: result.secure_url } });

  return Response.json({ url: result.secure_url });
}
