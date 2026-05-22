import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { headers } from "next/headers";
import connectDB from "../db";

const mongooseInstance = await connectDB();
const client = mongooseInstance.connection.getClient();
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      jobTitle: { type: "string", nullable: true },
      location: { type: "string", nullable: true },
      phone: { type: "string", nullable: true },
      websiteUrl: { type: "string", nullable: true },
      githubUrl: { type: "string", nullable: true },
      linkedinUrl: { type: "string", nullable: true },
      bio: { type: "string", nullable: true },
    },
  },
});

export async function getSession() {
  const result = await auth.api.getSession({
    headers: await headers(),
  });

  return result;
}
