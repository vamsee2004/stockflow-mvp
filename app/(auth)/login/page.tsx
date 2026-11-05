"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError((await res.json()).error ?? "Something went wrong");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow space-y-4">
        <h1 className="text-2xl font-semibold">Log in to StockFlow</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input name="email" type="email" placeholder="Email" required className="w-full border rounded p-2" />
        <input name="password" type="password" placeholder="Password" required className="w-full border rounded p-2" />
        <button disabled={loading} className="w-full bg-black text-white rounded p-2 disabled:opacity-50">
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p className="text-sm text-center">
          No account? <Link href="/signup" className="underline">Sign up</Link>
        </p>
      </form>
    </main>
  );
}
