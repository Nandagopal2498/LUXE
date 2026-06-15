import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/wishlist?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const wishlist = await db.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            brand: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(wishlist)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

// POST /api/wishlist - Add to wishlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, productId } = body

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'userId and productId are required' },
        { status: 400 }
      )
    }

    // Check if already in wishlist
    const existing = await db.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Product already in wishlist' },
        { status: 409 }
      )
    }

    const wishlistItem = await db.wishlist.create({
      data: { userId, productId },
      include: {
        product: {
          include: { category: true, brand: true },
        },
      },
    })

    return NextResponse.json(wishlistItem, { status: 201 })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}

// DELETE /api/wishlist - Remove from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const productId = searchParams.get('productId')

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'userId and productId are required' },
        { status: 400 }
      )
    }

    await db.wishlist.delete({
      where: {
        userId_productId: { userId, productId },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}
