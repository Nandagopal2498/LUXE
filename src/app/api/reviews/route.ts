import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/reviews - Add review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, productId, rating, title, comment } = body

    if (!userId || !productId || !rating) {
      return NextResponse.json(
        { error: 'userId, productId, and rating are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if user already reviewed this product
    const existing = await db.review.findFirst({
      where: { userId, productId },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 409 }
      )
    }

    const review = await db.review.create({
      data: {
        userId,
        productId,
        rating,
        title: title || null,
        comment: comment || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    // Update product rating and review count
    const productReviews = await db.review.findMany({
      where: { productId },
      select: { rating: true },
    })

    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length

    await db.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: productReviews.length,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
