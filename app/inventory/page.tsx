
"use client";

import { useCallback, useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
};

type Transaction = {
  id: string;
  type: "STOCK_IN" | "STOCK_OUT";
  quantity: number;
  previousStock: number;
  newStock: number;
  note: string | null;
  performedBy: string | null;
  createdAt: string;
  product: {
    id: string;
    name: string;
    sku: string;
  };
};

type InventoryData = {
  products: Product[];
  transactions: Transaction[];
};

// Fetch data from existing APIs
async function fetchInventoryData(): Promise<InventoryData> {
  const [productsResponse, transactionsResponse] =
    await Promise.all([
      fetch("/api/products", { cache: "no-store" }),
      fetch("/api/inventory", { cache: "no-store" }),
    ]);

  if (!productsResponse.ok || !transactionsResponse.ok) {
    throw new Error(
      "Unable to load inventory. Please log in again."
    );
  }

  const products = await productsResponse.json();
  const transactions = await transactionsResponse.json();

  return { products, transactions };
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [productId, setProductId] = useState("");
  const [type, setType] = useState<"STOCK_IN" | "STOCK_OUT">(
    "STOCK_IN"
  );
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedProduct = products.find(
    (product) => product.id === productId
  );

  // Initial data loading
  useEffect(() => {
    let active = true;

    async function initialLoad() {
      try {
        const data = await fetchInventoryData();

        if (active) {
          setProducts(data.products);
          setTransactions(data.transactions);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void initialLoad();

    return () => {
      active = false;
    };
  }, []);

  // Refresh products and transactions
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchInventoryData();

      setProducts(data.products);
      setTransactions(data.transactions);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to refresh inventory"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle Stock In and Stock Out
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const amount = Number(quantity);

    if (!productId) {
      setError("Please select a product.");
      return;
    }

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      setError("Enter a valid positive whole number.");
      return;
    }

    if (
      type === "STOCK_OUT" &&
      selectedProduct &&
      amount > selectedProduct.quantity
    ) {
      setError("Insufficient stock available.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          type,
          quantity: amount,
          note,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Transaction failed."
        );
      }

      setSuccess(
        type === "STOCK_IN"
          ? "Stock added successfully!"
          : "Stock removed successfully!"
      );

      setQuantity("");
      setNote("");

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Transaction failed."
      );
    } finally {
      setSaving(false);
    }
  }

  const totalUnits = products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  return (
    <div className="space-y-6 p-4 sm:p-6">

      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Inventory Transactions
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage stock movements and view transaction history.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-lg bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Total Products
          </p>

          <p className="mt-2 text-3xl font-bold">
            {products.length}
          </p>
        </div>

        <div className="rounded-lg bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Total Units
          </p>

          <p className="mt-2 text-3xl font-bold">
            {totalUnits}
          </p>
        </div>

        <div className="rounded-lg bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Total Transactions
          </p>

          <p className="mt-2 text-3xl font-bold">
            {transactions.length}
          </p>
        </div>

      </div>

      {/* Transaction form */}
      <div className="rounded-lg bg-white p-5 shadow">

        <h2 className="mb-5 text-lg font-semibold">
          Record Inventory Transaction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Transaction type */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Transaction Type
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as "STOCK_IN" | "STOCK_OUT"
                )
              }
              className="w-full rounded-lg border p-3"
            >
              <option value="STOCK_IN">Stock In</option>
              <option value="STOCK_OUT">Stock Out</option>
            </select>
          </div>

          {/* Product selection */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Select Product
            </label>

            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full rounded-lg border p-3"
              required
            >
              <option value="">Choose a product</option>

              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku}) - Stock:{" "}
                  {product.quantity}
                </option>
              ))}
            </select>
          </div>

          {/* Available stock */}
          {selectedProduct && (
            <div className="rounded-lg bg-gray-50 p-3 text-sm">
              Current available stock:{" "}
              <strong>{selectedProduct.quantity}</strong>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Notes (Optional)
            </label>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter transaction details"
              className="w-full rounded-lg border p-3"
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div
              role="status"
              className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={
              saving ||
              loading ||
              products.length === 0
            }
            className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Processing..."
              : type === "STOCK_IN"
                ? "Add Stock"
                : "Remove Stock"}
          </button>

        </form>
      </div>

      {/* Transaction history */}
      <div className="overflow-hidden rounded-lg bg-white shadow">

        <div className="flex items-center justify-between border-b p-5">

          <h2 className="text-lg font-semibold">
            Transaction History
          </h2>

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="rounded border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Refresh
          </button>

        </div>

        {loading ? (
          <p className="p-6 text-center text-gray-500">
            Loading transactions...
          </p>
        ) : transactions.length === 0 ? (
          <p className="p-8 text-center text-gray-500">
            No transactions yet. Record your first stock movement above.
          </p>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Previous Stock</th>
                  <th className="p-3">New Stock</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (

                  <tr
                    key={transaction.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-3">
                      <div className="font-medium">
                        {transaction.product.name}
                      </div>

                      <div className="text-xs text-gray-500">
                        {transaction.product.sku}
                      </div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          transaction.type === "STOCK_IN"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.type === "STOCK_IN"
                          ? "Stock In"
                          : "Stock Out"}
                      </span>
                    </td>

                    <td className="p-3 font-medium">
                      {transaction.quantity}
                    </td>

                    <td className="p-3">
                      {transaction.previousStock}
                    </td>

                    <td className="p-3 font-semibold">
                      {transaction.newStock}
                    </td>

                    <td className="whitespace-nowrap p-3">
                      {new Date(
                        transaction.createdAt
                      ).toLocaleString()}
                    </td>

                    <td className="p-3">
                      {transaction.note || "—"}
                    </td>

                  </tr>

                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}
