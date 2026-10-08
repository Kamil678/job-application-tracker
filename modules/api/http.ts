import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { getSession } from "@/modules/auth/server";

export function problem(status: number, error: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ error, ...extra }, { status });
}

export function validationProblem(error: ZodError) {
  return problem(400, "Validation failed", {
    issues: error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
  });
}

export async function requireUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.user.id ?? null;
}
