
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type DashboardProduct = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  lowStockThreshold: number | null;
};

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">
          Please log in to continue.
        </h1>
        <Link href="/login" className="underline">
          Go to Login
        </Link>
      </div>
    );
  }

  // Fetch organization and products
  const [org, products] = await Promise.all([
    prisma.organization.findUnique({
      where: {
        id: session.orgId,
      },
    }),

    prisma.product.findMany({
      where: {
        organizationId: session.orgId,
      },
      orderBy: {
        quantity: "asc",
      },
    }),
  ]);

  // Dashboard calculations
  const defaultThreshold = org?.defaultLowStock ?? 5;

  const totalProducts = products.length;

  const totalUnits = products.reduce(
    (sum: number, product: DashboardProduct) =>
      sum + product.quantity,
    0
  );

  const lowStock = products
    .map((product: DashboardProduct) => ({
      ...product,
      threshold:
        product.lowStockThreshold ?? defaultThreshold,
    }))
    .filter(
      (product) => product.quantity <= product.threshold
    );

  return (
    <div className="space-y-6">

      {/* Dashboard heading */}
      <div>
        <h1 className="text-2xl font-semibold">
          Dashboard
        </h1>

        <p className="text-gray-600 text-sm">
          {org?.name ?? "StockFlow Organization"}
        </p>
      </div>

      {/* Dashboard statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">
            Total products
          </p>

          <p className="text-3xl font-bold">
            {totalProducts}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">
            Total units on hand
          </p>

          <p className="text-3xl font-bold">
            {totalUnits}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">
            Low stock items
          </p>

          <p className="text-3xl font-bold text-red-600">
            {lowStock.length}
          </p>
        </div>

      </div>

      {/* Low stock products table */}
      <div className="bg-white rounded-lg shadow">

        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">
            Low stock items
          </h2>

          <Link
            href="/products"
            className="text-sm underline"
          >
            View all products
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Quantity on hand</th>
                <th className="p-3">
                  Low stock threshold
                </th>
              </tr>
            </thead>

            <tbody>
              {lowStock.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center text-gray-500"
                  >
                    No low stock items.
                  </td>
                </tr>
              )}

              {lowStock.map((product) => (
                <tr
                  key={product.id}
                  className="border-t"
                >
                  <td className="p-3">
                    {product.name}
                  </td>

                  <td className="p-3">
                    {product.sku}
                  </td>

                  <td className="p-3 text-red-600 font-medium">
                    {product.quantity}
                  </td>

                  <td className="p-3">
                    {product.threshold}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* Quick navigation */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/products"
          className="bg-black text-white px-5 py-3 rounded-lg"
        >
          Manage Products
        </Link>

        <Link
          href="/inventory"
          className="border border-black px-5 py-3 rounded-lg"
        >
          Manage Inventory
        </Link>
      </div>

    </div>
  );
}
