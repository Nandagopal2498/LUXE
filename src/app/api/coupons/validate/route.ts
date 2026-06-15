import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/coupons/validate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, cartTotal } = body

    if (!code || cartTotal === undefined) {
      return NextResponse.json(
        { error: 'code and cartTotal are required' },
        { status: 400 }
      )
    }

    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid coupon code', valid: false },
        { status: 404 }
      )
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { error: 'This coupon is no longer active', valid: false },
        { status: 400 }
      )
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'This coupon has expired', valid: false },
        { status: 400 }
      )
    }

    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      return NextResponse.json(
        { error: `Minimum order amount of ₹${coupon.minOrderAmount} required. Your cart total is ₹${cartTotal}`, valid: false },
        { status: 400 }
      )
    }

    let discountAmount = cartTotal * (coupon.discountPercent / 100)

    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      discountAmount: Math.round(discountAmount * 100) / 100,
      maxDiscount: coupon.maxDiscount,
      minOrderAmount: coupon.minOrderAmount,
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    )
  }
}
