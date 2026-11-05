import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validations";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  const parsed = signupSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { password, organizationName } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  if (await prisma.user.findUnique({ where: { email } })) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const org = await prisma.organization.create({
    data: { name: organizationName, users: { create: { email, passwordHash } } },
    include: { users: true },
  });
  const user = org.users[0];

  await createSession({ userId: user.id, orgId: org.id, email });
  return NextResponse.json({ ok: true });
}
