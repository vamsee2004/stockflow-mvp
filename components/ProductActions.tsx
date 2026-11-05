"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductActions({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  async function remove() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Could not delete product");
  }

  return (
    <div className="flex gap-3">
      <Link href={`/products/${id}/edit`} className="underline">Edit</Link>
      <button onClick={remove} className="text-red-600 underline">Delete</button>
    </div>
  );
}