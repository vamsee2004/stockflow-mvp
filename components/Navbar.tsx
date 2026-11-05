"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ email }: { email: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="bg-white border-b px-6 py-3 flex items-center justify-between text-black">
      <div className="flex items-center gap-6">
        <span className="font-bold">StockFlow</span>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <Link href="/products" className="hover:underline">Products</Link>
        <Link href="/settings" className="hover:underline">Settings</Link>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-600">{email}</span>
        <button onClick={logout} className="border rounded px-3 py-1 hover:bg-gray-100">Log out</button>
      </div>
    </nav>
  );
}