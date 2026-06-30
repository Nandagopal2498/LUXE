import { db as prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    
    if (!idsParam) {
      return NextResponse.json({ products: [] });
    }

    const ids = idsParam.split(',').filter(Boolean);

    if (ids.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
      include: { brand: true, category: true, variants: true },
    });

    // Sort products exactly according to the order of IDs in the request
    const sortedProducts = ids
      .map(id => products.find(p => p.id === id))
      .filter(Boolean);

    return NextResponse.json({ products: sortedProducts });
  } catch (error) {
    console.error("Recently viewed products error:", error);
    return NextResponse.json({ error: "Failed to fetch recently viewed products" }, { status: 500 });
  }
}
