import { notFound } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const session = (await getSession())!;
  const { id } = await params;
  const p = await prisma.product.findFirst({ where: { id, organizationId: session.orgId } });
  if (!p) notFound();

  return (
    <ProductForm
      initial={{
        id: p.id, name: p.name, sku: p.sku, description: p.description, quantity: p.quantity,
        costPrice: p.costPrice?.toString() ?? null,
        sellingPrice: p.sellingPrice?.toString() ?? null,
        lowStockThreshold: p.lowStockThreshold,
      }}
    />
  );
}