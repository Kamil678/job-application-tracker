import { NextResponse, type NextRequest } from "next/server";
import { listApplicationsQuerySchema } from "@/features/applications/schema";
import { listApplications } from "@/modules/applications/service";
import { problem, requireUserId, validationProblem } from "@/modules/api/http";

export async function GET(request: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return problem(401, "Unauthorized");

  const params = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = listApplicationsQuerySchema.safeParse(params);
  if (!parsed.success) return validationProblem(parsed.error);

  const { items, total, page, pageSize } = await listApplications(userId, parsed.data);

  return NextResponse.json({
    data: items,
    meta: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
  });
}
