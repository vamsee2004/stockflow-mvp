
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

// GET: Fetch inventory transaction history
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const transactions =
      await prisma.inventoryTransaction.findMany({
        where: {
          organizationId: session.orgId,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 100,
      });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Inventory GET error:", error);

    return NextResponse.json(
      { error: "Could not fetch transactions" },
      { status: 500 }
    );
  }
}

// POST: Add or remove stock
export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let body: {
      productId?: unknown;
      type?: unknown;
      quantity?: unknown;
      note?: unknown;
    };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request" },
        { status: 400 }
      );
    }

    const { productId, type, quantity, note } = body;

    if (
      typeof productId !== "string" ||
      !productId.trim()
    ) {
      return NextResponse.json(
        { error: "Please select a product" },
        { status: 400 }
      );
    }

    if (
      type !== "STOCK_IN" &&
      type !== "STOCK_OUT"
    ) {
      return NextResponse.json(
        { error: "Invalid transaction type" },
        { status: 400 }
      );
    }

    if (
      typeof quantity !== "number" ||
      !Number.isSafeInteger(quantity) ||
      quantity <= 0
    ) {
      return NextResponse.json(
        { error: "Quantity must be a positive integer" },
        { status: 400 }
      );
    }

    if (
      note !== undefined &&
      note !== null &&
      typeof note !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid transaction note" },
        { status: 400 }
      );
    }

    if (typeof note === "string" && note.length > 500) {
      return NextResponse.json(
        { error: "Note cannot exceed 500 characters" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findFirst({
        where: {
          id: productId,
          organizationId: session.orgId,
        },
      });

      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const previousStock = product.quantity;

      const newStock =
        type === "STOCK_IN"
          ? previousStock + quantity
          : previousStock - quantity;

      if (!Number.isSafeInteger(newStock)) {
        throw new Error("INVALID_STOCK");
      }

      if (newStock < 0) {
        throw new Error("INSUFFICIENT_STOCK");
      }

      const updated = await tx.product.updateMany({
        where: {
          id: productId,
          organizationId: session.orgId,
          quantity: previousStock,
        },
        data: {
          quantity: newStock,
          lastUpdatedBy: session.email,
        },
      });

      if (updated.count !== 1) {
        throw new Error("STOCK_CONFLICT");
      }

      return await tx.inventoryTransaction.create({
        data: {
          organizationId: session.orgId,
          productId,
          type,
          quantity,
          previousStock,
          newStock,
          note:
            typeof note === "string"
              ? note.trim() || null
              : null,
          performedBy: session.email,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
            },
          },
        },
      });
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PRODUCT_NOT_FOUND") {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      if (error.message === "INSUFFICIENT_STOCK") {
        return NextResponse.json(
          { error: "Insufficient stock available" },
          { status: 400 }
        );
      }

      if (error.message === "STOCK_CONFLICT") {
        return NextResponse.json(
          { error: "Stock changed. Please try again." },
          { status: 409 }
        );
      }

      if (error.message === "INVALID_STOCK") {
        return NextResponse.json(
          { error: "Invalid stock quantity" },
          { status: 400 }
        );
      }
    }

    console.error("Inventory POST error:", error);

    return NextResponse.json(
      { error: "Could not record inventory transaction" },
      { status: 500 }
    );
  }
}
