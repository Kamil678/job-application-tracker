import { NextResponse, type NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { revalidatePath } from "next/cache";
import { updateApplicationSchema } from "@/features/applications/schema";
import { deleteApplication, updateApplication } from "@/modules/applications/service";
import { problem, requireUserId, validationProblem } from "@/modules/api/http";

function revalidateApplicationViews() {
  revalidatePath("/board");
  revalidatePath("/dashboard");
}

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/applications/[id]">) {
  const userId = await requireUserId();
  if (!userId) return problem(401, "Unauthorized");

  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return problem(400, "Invalid application id");

  const body = await request.json().catch(() => null);
  if (body === null) return problem(400, "Request body must be valid JSON");

  const parsed = updateApplicationSchema.safeParse(body);
  if (!parsed.success) return validationProblem(parsed.error);

  const application = await updateApplication(userId, id, parsed.data);
  if (!application) return problem(404, "Application not found");

  revalidateApplicationViews();
  return NextResponse.json({ data: application });
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<"/api/applications/[id]">) {
  const userId = await requireUserId();
  if (!userId) return problem(401, "Unauthorized");

  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return problem(400, "Invalid application id");

  await deleteApplication(userId, id);

  revalidateApplicationViews();
  return new NextResponse(null, { status: 204 });
}
