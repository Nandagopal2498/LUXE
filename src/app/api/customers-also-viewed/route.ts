import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const recentIdsParam = searchParams.get('recentIds');
    const recentIds = recentIdsParam ? recentIdsParam.split(',').filter(Boolean) : [];

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // 1. Fetch the current product to get its category and brand
    const currentProduct = await db.product.findUnique({
      where: { id: productId },
      select: { categoryId: true, brandId: true }
    });

    if (!currentProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // 2. Fetch categories of recently viewed items to understand user intent
    let recentCategories: string[] = [];
    if (recentIds.length > 0) {
      const recentProducts = await db.product.findMany({
        where: { id: { in: recentIds } },
        select: { categoryId: true }
      });
      recentCategories = recentProducts.map(p => p.categoryId);
    }

    // Include the current product's category as the primary interest
    const targetCategories = Array.from(new Set([currentProduct.categoryId, ...recentCategories]));

    // 3. Find recommended products
    // We want products in the target categories, but we must EXCLUDE the current product.
    const recommendations = await db.product.findMany({
      where: {
        id: { not: productId },
        categoryId: { in: targetCategories }
      },
      include: {
        brand: true,
        category: true,
        variants: true,
      },
      take: 12,
    });

    // Sort to prioritize items that match the current category, then items that match recent categories
    const sorted = recommendations.sort((a, b) => {
      const aIsCurrentCat = a.categoryId === currentProduct.categoryId ? 1 : 0;
      const bIsCurrentCat = b.categoryId === currentProduct.categoryId ? 1 : 0;
      
      if (aIsCurrentCat !== bIsCurrentCat) {
        return bIsCurrentCat - aIsCurrentCat;
      }
      
      return Math.random() - 0.5;
    });

    const finalProducts = sorted.slice(0, 8);

    return NextResponse.json({ products: finalProducts });
  } catch (error) {
    console.error('Customers also viewed error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
