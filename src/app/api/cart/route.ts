import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/cart?userId=xxx
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

    const cartItems = await db.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            brand: true,
          },
        },
        variant: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(cartItems)
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, productId, variantId, quantity = 1 } = body

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'userId and productId are required' },
        { status: 400 }
      )
    }

    // Check if the same product+variant already exists in cart
    const existing = await db.cartItem.findFirst({
      where: {
        userId,
        productId,
        variantId: variantId || null,
      },
    })

    if (existing) {
      // Update quantity
      const updated = await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: {
          product: { include: { category: true, brand: true } },
          variant: true,
        },
      })
      return NextResponse.json(updated)
    }

    const cartItem = await db.cartItem.create({
      data: {
        userId,
        productId,
        variantId: variantId || null,
        quantity,
      },
      include: {
        product: { include: { category: true, brand: true } },
        variant: true,
      },
    })

    return NextResponse.json(cartItem, { status: 201 })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}
