import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/recommendations?productId=xxx&category=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId') || ''
    const categorySlug = searchParams.get('category') || ''

    // Get the product for context
    let contextProduct = null
    if (productId) {
      contextProduct = await db.product.findUnique({
        where: { id: productId },
        include: { category: true, brand: true },
      })
    }

    // Get category
    let category = null
    if (categorySlug) {
      category = await db.category.findUnique({
        where: { slug: categorySlug },
      })
    }

    // If we have a product, use its category
    const targetCategoryId = category?.id || contextProduct?.categoryId

    // Get recommended products - same category, different from current product
    const recommended = await db.product.findMany({
      where: {
        ...(targetCategoryId ? { categoryId: targetCategoryId } : {}),
        ...(productId ? { id: { not: productId } } : {}),
        rating: { gte: 4.0 },
      },
      include: {
        category: true,
        brand: true,
      },
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' },
      ],
      take: 8,
    })

    // If we don't have enough recommendations from the same category,
    // fill with featured/top-rated products
    if (recommended.length < 4) {
      const existingIds = recommended.map(p => p.id)
      if (productId) existingIds.push(productId)

      const moreProducts = await db.product.findMany({
        where: {
          id: { notIn: existingIds },
          featured: true,
        },
        include: {
          category: true,
          brand: true,
        },
        orderBy: { rating: 'desc' },
        take: 8 - recommended.length,
      })

      recommended.push(...moreProducts)
    }

    // Generate AI-powered recommendation text using LLM
    let aiRecommendation = null
    try {
      const { execSync } = await import('child_process')
      const productName = contextProduct?.name || 'fashion items'
      const categoryName = category?.name || contextProduct?.category?.name || 'fashion'
      const productNames = recommended.slice(0, 4).map(p => p.name).join(', ')

      const prompt = `You are a fashion stylist. In 1-2 short sentences, explain why these items: ${productNames} pair well with ${productName || categoryName + ' style'}. Be specific and stylish. Keep it under 60 words.`

      const result = execSync(
        `npx z-ai-web-dev-sdk chat --prompt "${prompt.replace(/"/g, '\\"')}"`,
        { encoding: 'utf-8', timeout: 15000 }
      ).trim()

      aiRecommendation = result
    } catch {
      // LLM call failed, continue without AI text
      aiRecommendation = null
    }

    return NextResponse.json({
      recommendations: recommended,
      aiRecommendation,
    })
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
}
