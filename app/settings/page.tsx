import SettingsForm from "@/components/SettingsForm";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function SettingsPage() {
  const session = (await getSession())!;
  const org = await prisma.organization.findUnique({ where: { id: session.orgId } });
  return <SettingsForm initial={org?.defaultLowStock ?? 5} />;
}