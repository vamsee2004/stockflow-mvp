import { getSession } from "@/lib/session";

export default async function Dashboard() {
  const session = await getSession();
  return <main className="p-6">Dashboard. Logged in as {session?.email}</main>;
}