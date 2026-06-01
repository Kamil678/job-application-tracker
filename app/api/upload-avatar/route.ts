import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";

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

  const db = await getDb();
  await db.collection("user").updateOne({ _id: new ObjectId(session.user.id) }, { $set: { image: result.secure_url } });

  return Response.json({ url: result.secure_url });
}
