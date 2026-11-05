import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function Dashboard() {
  const session = (await getSession())!;

  const [org, products] = await Promise.all([
    prisma.organization.findUnique({ where: { id: session.orgId } }),
    prisma.product.findMany({
      where: { organizationId: session.orgId },
      orderBy: { quantity: "asc" },
    }),
  ]);

  const defaultThreshold = org?.defaultLowStock ?? 5;
  const totalProducts = products.length;
  const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);

  const lowStock = products
    .map((p) => ({ ...p, threshold: p.lowStockThreshold ?? defaultThreshold }))
    .filter((p) => p.quantity <= p.threshold);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-600 text-sm">{org?.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Total products</p>
          <p className="text-3xl font-bold">{totalProducts}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Total units on hand</p>
          <p className="text-3xl font-bold">{totalUnits}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Low stock items</p>
          <p className="text-3xl font-bold text-red-600">{lowStock.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Low stock items</h2>
          <Link href="/products" className="text-sm underline">View all products</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Quantity on hand</th>
                <th className="p-3">Low stock threshold</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    No low stock items.
                  </td>
                </tr>
              )}
              {lowStock.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.sku}</td>
                  <td className="p-3 text-red-600 font-medium">{p.quantity}</td>
                  <td className="p-3">{p.threshold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}