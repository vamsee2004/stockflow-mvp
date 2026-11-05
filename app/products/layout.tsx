import Navbar from "@/components/Navbar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar email={session.email} />
      <div className="max-w-5xl mx-auto p-6">{children}</div>
    </div>
  );
}