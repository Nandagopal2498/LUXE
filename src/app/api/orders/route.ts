import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/orders?userId=xxx
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

    const orders = await db.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: {
              include: { category: true, brand: true },
            },
            variant: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      items,
      shippingName,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      couponCode,
      paymentMethod,
      paymentId,
    } = body

    if (!userId || !items || !items.length) {
      return NextResponse.json(
        { error: 'userId and items are required' },
        { status: 400 }
      )
    }

    // Calculate total amount
    let totalAmount = 0
    const orderItemsData = []

    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }

      const itemTotal = product.price * item.quantity
      totalAmount += itemTotal

      const images: string[] = JSON.parse(product.images || '[]')

      orderItemsData.push({
        productId: product.id,
        variantId: item.variantId || null,
        quantity: item.quantity,
        price: product.price,
        productName: product.name,
        productImage: images[0] || null,
      })
    }

    // Calculate discount
    let discountAmount = 0
    if (couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: couponCode },
      })

      if (coupon && coupon.isActive) {
        if (coupon.expiresAt && coupon.expiresAt < new Date()) {
          return NextResponse.json(
            { error: 'Coupon has expired' },
            { status: 400 }
          )
        }

        if (coupon.minOrderAmount && totalAmount < coupon.minOrderAmount) {
          return NextResponse.json(
            { error: `Minimum order amount of ₹${coupon.minOrderAmount} required` },
            { status: 400 }
          )
        }

        discountAmount = totalAmount * (coupon.discountPercent / 100)

        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount
        }
      }
    }

    // Tax removed
    const taxAmount = 0
    const finalAmount = totalAmount - discountAmount

    // Create order
    const order = await db.order.create({
      data: {
        userId,
        totalAmount,
        discountAmount,
        taxAmount: Math.round(taxAmount * 100) / 100,
        finalAmount: Math.round(finalAmount * 100) / 100,
        status: 'pending',
        couponCode: couponCode || null,
        paymentMethod: paymentMethod || null,
        paymentId: paymentId || null,
        shippingName: shippingName || null,
        shippingPhone: shippingPhone || null,
        shippingAddress: shippingAddress || null,
        shippingCity: shippingCity || null,
        shippingState: shippingState || null,
        shippingPincode: shippingPincode || null,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    })

    // Clear user's cart after order
    await db.cartItem.deleteMany({
      where: { userId },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
