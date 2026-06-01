import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { headers } from "next/headers";
import { cache } from "react";
import connectDB from "../db";
import { initUserBoard } from "../init-user-board";

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
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user.id) {
            await initUserBoard(user.id);
          }
        },
      },
    },
  },
});

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});
