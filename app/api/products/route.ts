
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { productSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const q = new URL(req.url).searchParams.get("q")?.trim();

  const products = await prisma.product.findMany({
    where: {
      organizationId: session.orgId,
      ...(q
        ? {
            OR: [
              {
                name: {
                  contains: q,
                  mode: "insensitive",
                },
              },
              {
                sku: {
                  contains: q,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const parsed = productSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.create({
      data: {
        ...parsed.data,
        sku: parsed.data.sku.trim(),
        organizationId: session.orgId,
        lastUpdatedBy: session.email,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "SKU already exists" },
        { status: 409 }
      );
    }

    console.error("Product creation error:", error);

    return NextResponse.json(
      { error: "Could not create product" },
      { status: 500 }
    );
  }
}
