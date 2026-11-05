import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const schema = z.object({
  defaultLowStock: z.coerce.number().int("Must be a whole number").min(0, "Cannot be negative"),
});

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await prisma.organization.update({
    where: { id: session.orgId },
    data: { defaultLowStock: parsed.data.defaultLowStock },
  });
  return NextResponse.json({ ok: true });
}