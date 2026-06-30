import { db as prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get product IDs with the most cart additions in the last 7 days
    const trendingCartItems = await prisma.cartItem.groupBy({
      by: ['productId'],
      where: {
        createdAt: { gte: sevenDaysAgo }
      },
      _sum: { quantity: true },
      orderBy: {
        _sum: { quantity: 'desc' }
      },
      take: 8,
    });

    const productIds = trendingCartItems.map(item => item.productId);

    if (productIds.length === 0) {
      // Fallback: if no recent cart items, just return the most recently updated products or featured
      const fallbackProducts = await prisma.product.findMany({
        take: 8,
        orderBy: { updatedAt: 'desc' },
        include: { brand: true, category: true, variants: true },
      });
      return NextResponse.json({ products: fallbackProducts });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { brand: true, category: true, variants: true },
    });

    // Sort products to match the trendingCartItems order
    const sortedProducts = productIds
      .map(id => products.find(p => p.id === id))
      .filter(Boolean);

    return NextResponse.json({ products: sortedProducts });
  } catch (error) {
    console.error("Trending products error:", error);
    return NextResponse.json({ error: "Failed to fetch trending products" }, { status: 500 });
  }
}
