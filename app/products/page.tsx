import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import ProductActions from "@/components/ProductActions";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = (await getSession())!;
  const { q } = await searchParams;
  const query = q?.trim();

  const [org, products] = await Promise.all([
    prisma.organization.findUnique({ where: { id: session.orgId } }),
    prisma.product.findMany({
      where: {
        organizationId: session.orgId,
        ...(query
          ? { OR: [{ name: { contains: query, mode: "insensitive" } }, { sku: { contains: query, mode: "insensitive" } }] }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  const defaultThreshold = org?.defaultLowStock ?? 5;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/products/new" className="bg-black text-white rounded px-4 py-2">Add Product</Link>
      </div>
      <form className="flex gap-2">
        <input name="q" defaultValue={query ?? ""} placeholder="Search by name or SKU" className="border rounded p-2 bg-white w-72" />
        <button className="border rounded px-3 bg-white">Search</button>
      </form>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th><th className="p-3">SKU</th><th className="p-3">Quantity</th>
              <th className="p-3">Status</th><th className="p-3">Selling price</th><th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">No products yet.</td></tr>
            )}
            {products.map((p) => {
              const low = p.quantity <= (p.lowStockThreshold ?? defaultThreshold);
              return (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.sku}</td>
                  <td className="p-3">{p.quantity}</td>
                  <td className="p-3">
                    {low
                      ? <span className="bg-red-100 text-red-700 rounded px-2 py-0.5">Low stock</span>
                      : <span className="bg-green-100 text-green-700 rounded px-2 py-0.5">In stock</span>}
                  </td>
                  <td className="p-3">{p.sellingPrice ? p.sellingPrice.toString() : "-"}</td>
                  <td className="p-3"><ProductActions id={p.id} name={p.name} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}