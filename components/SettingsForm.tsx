"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsForm({ initial }: { initial: number }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("Settings saved");
      router.refresh();
    } else {
      setError((await res.json()).error ?? "Something went wrong");
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md bg-white p-6 rounded-lg shadow space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      {message && <p className="text-green-700 text-sm">{message}</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <label className="block text-sm">Default low stock threshold
        <input name="defaultLowStock" type="number" min="0" step="1" required defaultValue={initial} className="w-full border rounded p-2 bg-white mt-1" />
      </label>
      <p className="text-xs text-gray-500">Used for products that have no threshold of their own.</p>
      <button disabled={loading} className="bg-black text-white rounded px-4 py-2 disabled:opacity-50">
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}