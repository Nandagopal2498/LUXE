import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const categoryId = searchParams.get('categoryId')

    if (!productId || !categoryId) {
      return NextResponse.json({ error: 'Missing productId or categoryId' }, { status: 400 })
    }

    // Get the current category to determine complements
    const currentCategory = await db.category.findUnique({
      where: { id: categoryId }
    })

    if (!currentCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Define clothing slugs vs accessories/footwear
    const clothingSlugs = ['mens-clothing', 'womens-clothing', 'kids', 'sportswear']
    const accessorySlugs = ['footwear', 'accessories']

    let targetSlugs: string[] = []

    if (clothingSlugs.includes(currentCategory.slug)) {
      targetSlugs = accessorySlugs
    } else {
      targetSlugs = ['mens-clothing', 'womens-clothing']
    }

    // Fetch complementary categories
    const complementaryCategories = await db.category.findMany({
      where: { slug: { in: targetSlugs } }
    })

    const categoryIds = complementaryCategories.map(c => c.id)

    // Fetch top-rated complementary products
    const recommended = await db.product.findMany({
      where: {
        categoryId: { in: categoryIds },
        id: { not: productId }
      },
      include: {
        category: true,
        brand: true,
      },
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' }
      ],
      take: 4,
    })

    // If we couldn't find enough, just fetch any highly rated products not in the same category
    if (recommended.length < 4) {
      const existingIds = recommended.map(p => p.id)
      existingIds.push(productId)
      
      const fallback = await db.product.findMany({
        where: {
          id: { notIn: existingIds },
          categoryId: { not: categoryId },
          rating: { gte: 4.0 }
        },
        include: {
          category: true,
          brand: true,
        },
        orderBy: { rating: 'desc' },
        take: 4 - recommended.length
      })
      recommended.push(...fallback)
    }

    return NextResponse.json({ products: recommended })

  } catch (error) {
    console.error('Error fetching complete the look:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
}
