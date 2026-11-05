"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Initial = {
  id?: string; name?: string; sku?: string; description?: string | null;
  quantity?: number; costPrice?: string | null; sellingPrice?: string | null;
  lowStockThreshold?: number | null;
};

export default function ProductForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const editing = !!initial?.id;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch(editing ? `/api/products/${initial!.id}` : "/api/products", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/products");
      router.refresh();
    } else {
      setError((await res.json()).error ?? "Something went wrong");
    }
  }

  const input = "w-full border rounded p-2 bg-white";
  return (
    <form onSubmit={onSubmit} className="max-w-lg bg-white p-6 rounded-lg shadow space-y-4">
      <h1 className="text-2xl font-semibold">{editing ? "Edit product" : "Add product"}</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <label className="block text-sm">Name *
        <input name="name" required defaultValue={initial?.name ?? ""} className={input} />
      </label>
      <label className="block text-sm">SKU *
        <input name="sku" required defaultValue={initial?.sku ?? ""} className={input} />
      </label>
      <label className="block text-sm">Description
        <textarea name="description" defaultValue={initial?.description ?? ""} className={input} />
      </label>
      <label className="block text-sm">Quantity on hand *
        <input name="quantity" type="number" min="0" step="1" required defaultValue={initial?.quantity ?? 0} className={input} />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm">Cost price
          <input name="costPrice" type="number" min="0" step="0.01" defaultValue={initial?.costPrice ?? ""} className={input} />
        </label>
        <label className="block text-sm">Selling price
          <input name="sellingPrice" type="number" min="0" step="0.01" defaultValue={initial?.sellingPrice ?? ""} className={input} />
        </label>
      </div>
      <label className="block text-sm">Low stock threshold (blank = use default)
        <input name="lowStockThreshold" type="number" min="0" step="1" defaultValue={initial?.lowStockThreshold ?? ""} className={input} />
      </label>
      <div className="flex gap-3">
        <button disabled={loading} className="bg-black text-white rounded px-4 py-2 disabled:opacity-50">
          {loading ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={() => router.push("/products")} className="border rounded px-4 py-2">Cancel</button>
      </div>
    </form>
  );
}