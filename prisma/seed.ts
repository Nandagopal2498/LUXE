import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Image URLs from Unsplash
const IMAGES = {
  redShoe: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  colorfulShoe: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
  greyShoe: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80",
  whiteShoe: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
  shirt: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
  tshirt: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
  whiteTshirt: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
  jacket: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
  leatherJacket: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
  dress: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
  fashion: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
  watch: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a30?w=800&q=80",
  watch2: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  sneaker: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
  runningShoe: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
  sportswear: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80",
  cap: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800&q=80",
  denim: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  hoodie: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
  heels: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function main() {
  console.log('🌱 Seeding database...')

  // Clean up existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.review.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()

  // ── Categories ──
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Men's Clothing", slug: "mens-clothing", image: IMAGES.shirt } }),
    prisma.category.create({ data: { name: "Women's Clothing", slug: "womens-clothing", image: IMAGES.dress } }),
    prisma.category.create({ data: { name: "Footwear", slug: "footwear", image: IMAGES.redShoe } }),
    prisma.category.create({ data: { name: "Accessories", slug: "accessories", image: IMAGES.watch } }),
    prisma.category.create({ data: { name: "Sportswear", slug: "sportswear", image: IMAGES.sportswear } }),
    prisma.category.create({ data: { name: "Kids", slug: "kids", image: IMAGES.colorfulShoe } }),
  ])

  const [mensClothing, womensClothing, footwear, accessories, sportswear, kids] = categories

  // ── Brands ──
  const brands = await Promise.all([
    prisma.brand.create({ data: { name: "Nike", slug: "nike", logo: IMAGES.sneaker } }),
    prisma.brand.create({ data: { name: "Adidas", slug: "adidas", logo: IMAGES.runningShoe } }),
    prisma.brand.create({ data: { name: "H&M", slug: "hm", logo: IMAGES.tshirt } }),
    prisma.brand.create({ data: { name: "Zara", slug: "zara", logo: IMAGES.fashion } }),
    prisma.brand.create({ data: { name: "Puma", slug: "puma", logo: IMAGES.redShoe } }),
    prisma.brand.create({ data: { name: "Levi's", slug: "levis", logo: IMAGES.denim } }),
    prisma.brand.create({ data: { name: "Under Armour", slug: "under-armour", logo: IMAGES.sportswear } }),
    prisma.brand.create({ data: { name: "Uniqlo", slug: "uniqlo", logo: IMAGES.whiteTshirt } }),
    prisma.brand.create({ data: { name: "Gucci", slug: "gucci", logo: IMAGES.watch2 } }),
    prisma.brand.create({ data: { name: "Ralph Lauren", slug: "ralph-lauren", logo: IMAGES.shirt } }),
  ])

  const [nike, adidas, hm, zara, puma, levis, underArmour, uniqlo, gucci, ralphLauren] = brands

  // ── Products ──
  const productDefs = [
    // Men's Clothing
    {
      name: "Classic Oxford Shirt",
      description: "A timeless Oxford shirt crafted from premium cotton. Perfect for both formal and casual occasions with a comfortable regular fit.",
      price: 2499, comparePrice: 3999, categoryId: mensClothing.id, brandId: ralphLauren.id,
      images: [IMAGES.shirt, IMAGES.fashion, IMAGES.whiteTshirt],
      featured: true, newArrival: false, rating: 4.5, reviewCount: 120,
      variants: [
        { size: "S", color: "White", colorHex: "#FFFFFF", stock: 15, sku: "OXF-WHT-S" },
        { size: "M", color: "White", colorHex: "#FFFFFF", stock: 25, sku: "OXF-WHT-M" },
        { size: "L", color: "Blue", colorHex: "#1E40AF", stock: 20, sku: "OXF-BLU-L" },
        { size: "XL", color: "Blue", colorHex: "#1E40AF", stock: 10, sku: "OXF-BLU-XL" },
      ]
    },
    {
      name: "Slim Fit Crew Neck T-Shirt",
      description: "Ultra-soft cotton t-shirt with a modern slim fit. Features reinforced seams and pre-shrunk fabric for lasting comfort.",
      price: 799, comparePrice: 1299, categoryId: mensClothing.id, brandId: hm.id,
      images: [IMAGES.whiteTshirt, IMAGES.tshirt, IMAGES.shirt],
      featured: false, newArrival: true, rating: 4.2, reviewCount: 85,
      variants: [
        { size: "S", color: "White", colorHex: "#FFFFFF", stock: 30, sku: "Crew-WHT-S" },
        { size: "M", color: "White", colorHex: "#FFFFFF", stock: 40, sku: "Crew-WHT-M" },
        { size: "L", color: "Black", colorHex: "#000000", stock: 35, sku: "Crew-BLK-L" },
        { size: "XL", color: "Black", colorHex: "#000000", stock: 20, sku: "Crew-BLK-XL" },
      ]
    },
    {
      name: "Premium Denim Jacket",
      description: "Classic denim jacket made from 100% premium cotton denim. Vintage wash with button closure and chest pockets.",
      price: 4999, comparePrice: 6999, categoryId: mensClothing.id, brandId: levis.id,
      images: [IMAGES.jacket, IMAGES.denim, IMAGES.leatherJacket],
      featured: true, newArrival: false, rating: 4.7, reviewCount: 200,
      variants: [
        { size: "S", color: "Indigo", colorHex: "#3F51B5", stock: 8, sku: "DNJ-IND-S" },
        { size: "M", color: "Indigo", colorHex: "#3F51B5", stock: 12, sku: "DNJ-IND-M" },
        { size: "L", color: "Light Blue", colorHex: "#64B5F6", stock: 10, sku: "DNJ-LBL-L" },
      ]
    },
    {
      name: "Graphic Print T-Shirt",
      description: "Express your style with this bold graphic print t-shirt. Made from breathable cotton blend for all-day comfort.",
      price: 999, comparePrice: 1499, categoryId: mensClothing.id, brandId: uniqlo.id,
      images: [IMAGES.tshirt, IMAGES.whiteTshirt, IMAGES.shirt],
      featured: false, newArrival: false, rating: 4.0, reviewCount: 45,
      variants: [
        { size: "M", color: "Black", colorHex: "#000000", stock: 25, sku: "GFX-BLK-M" },
        { size: "L", color: "Black", colorHex: "#000000", stock: 20, sku: "GFX-BLK-L" },
        { size: "XL", color: "Grey", colorHex: "#9E9E9E", stock: 15, sku: "GFX-GRY-XL" },
      ]
    },
    {
      name: "Leather Biker Jacket",
      description: "Premium genuine leather biker jacket with asymmetric zip. A statement piece that elevates any outfit with rugged sophistication.",
      price: 12999, comparePrice: 18999, categoryId: mensClothing.id, brandId: zara.id,
      images: [IMAGES.leatherJacket, IMAGES.jacket, IMAGES.fashion],
      featured: true, newArrival: true, rating: 4.8, reviewCount: 150,
      variants: [
        { size: "S", color: "Black", colorHex: "#000000", stock: 5, sku: "BJK-BLK-S" },
        { size: "M", color: "Black", colorHex: "#000000", stock: 8, sku: "BJK-BLK-M" },
        { size: "L", color: "Brown", colorHex: "#795548", stock: 6, sku: "BJK-BRN-L" },
        { size: "XL", color: "Brown", colorHex: "#795548", stock: 4, sku: "BJK-BRN-XL" },
      ]
    },

    // Women's Clothing
    {
      name: "Floral Summer Dress",
      description: "Beautiful floral print midi dress perfect for summer outings. Features a flattering A-line silhouette with adjustable waist tie.",
      price: 2999, comparePrice: 4499, categoryId: womensClothing.id, brandId: zara.id,
      images: [IMAGES.dress, IMAGES.fashion, IMAGES.heels],
      featured: true, newArrival: false, rating: 4.6, reviewCount: 180,
      variants: [
        { size: "S", color: "Pink", colorHex: "#EC4899", stock: 12, sku: "FLD-PNK-S" },
        { size: "M", color: "Pink", colorHex: "#EC4899", stock: 18, sku: "FLD-PNK-M" },
        { size: "L", color: "Blue", colorHex: "#3B82F6", stock: 10, sku: "FLD-BLU-L" },
        { size: "XL", color: "Blue", colorHex: "#3B82F6", stock: 6, sku: "FLD-BLU-XL" },
      ]
    },
    {
      name: "Casual Wrap Dress",
      description: "Elegant wrap dress in soft jersey fabric. Versatile enough for both office wear and evening outings.",
      price: 1999, comparePrice: 2999, categoryId: womensClothing.id, brandId: hm.id,
      images: [IMAGES.dress, IMAGES.fashion, IMAGES.leatherJacket],
      featured: false, newArrival: true, rating: 4.3, reviewCount: 95,
      variants: [
        { size: "S", color: "Red", colorHex: "#EF4444", stock: 15, sku: "WRP-RED-S" },
        { size: "M", color: "Red", colorHex: "#EF4444", stock: 20, sku: "WRP-RED-M" },
        { size: "L", color: "Black", colorHex: "#000000", stock: 12, sku: "WRP-BLK-L" },
      ]
    },
    {
      name: "Oversized Knit Sweater",
      description: "Cozy oversized knit sweater in premium wool blend. Perfect layering piece for cooler weather with ribbed cuffs and hem.",
      price: 3499, comparePrice: 4999, categoryId: womensClothing.id, brandId: uniqlo.id,
      images: [IMAGES.hoodie, IMAGES.fashion, IMAGES.jacket],
      featured: false, newArrival: false, rating: 4.4, reviewCount: 72,
      variants: [
        { size: "S", color: "Cream", colorHex: "#FFFDD0", stock: 10, sku: "KNT-CRM-S" },
        { size: "M", color: "Cream", colorHex: "#FFFDD0", stock: 15, sku: "KNT-CRM-M" },
        { size: "L", color: "Grey", colorHex: "#9E9E9E", stock: 12, sku: "KNT-GRY-L" },
        { size: "XL", color: "Grey", colorHex: "#9E9E9E", stock: 8, sku: "KNT-GRY-XL" },
      ]
    },
    {
      name: "High-Waisted Skinny Jeans",
      description: "Figure-flattering high-waisted skinny jeans with stretch denim. Classic five-pocket design with premium finish.",
      price: 2799, comparePrice: 3999, categoryId: womensClothing.id, brandId: levis.id,
      images: [IMAGES.denim, IMAGES.fashion, IMAGES.dress],
      featured: false, newArrival: false, rating: 4.5, reviewCount: 210,
      variants: [
        { size: "S", color: "Dark Blue", colorHex: "#1E3A5F", stock: 18, sku: "HWJ-DBL-S" },
        { size: "M", color: "Dark Blue", colorHex: "#1E3A5F", stock: 25, sku: "HWJ-DBL-M" },
        { size: "L", color: "Light Blue", colorHex: "#64B5F6", stock: 15, sku: "HWJ-LBL-L" },
        { size: "XL", color: "Black", colorHex: "#000000", stock: 10, sku: "HWJ-BLK-XL" },
      ]
    },

    // Footwear
    {
      name: "Air Max Running Shoes",
      description: "Lightweight running shoes with responsive cushioning and breathable mesh upper. Built for comfort on long runs.",
      price: 9999, comparePrice: 12999, categoryId: footwear.id, brandId: nike.id,
      images: [IMAGES.redShoe, IMAGES.runningShoe, IMAGES.sneaker],
      featured: true, newArrival: false, rating: 4.7, reviewCount: 320,
      variants: [
        { size: "S", color: "Red", colorHex: "#EF4444", stock: 12, sku: "AMX-RED-7" },
        { size: "M", color: "Red", colorHex: "#EF4444", stock: 18, sku: "AMX-RED-9" },
        { size: "L", color: "Black", colorHex: "#000000", stock: 15, sku: "AMX-BLK-10" },
        { size: "XL", color: "White", colorHex: "#FFFFFF", stock: 10, sku: "AMX-WHT-11" },
      ]
    },
    {
      name: "Ultraboost 22",
      description: "Premium running shoe with Boost midsole technology for energy return. Primeknit upper adapts to your foot for a custom fit.",
      price: 14999, comparePrice: 18999, categoryId: footwear.id, brandId: adidas.id,
      images: [IMAGES.colorfulShoe, IMAGES.runningShoe, IMAGES.whiteShoe],
      featured: true, newArrival: true, rating: 4.8, reviewCount: 280,
      variants: [
        { size: "S", color: "Multi", colorHex: "#6366F1", stock: 8, sku: "UBT-MLT-8" },
        { size: "M", color: "Black", colorHex: "#000000", stock: 14, sku: "UBT-BLK-9" },
        { size: "L", color: "White", colorHex: "#FFFFFF", stock: 10, sku: "UBT-WHT-10" },
        { size: "XL", color: "Grey", colorHex: "#9E9E9E", stock: 6, sku: "UBT-GRY-11" },
      ]
    },
    {
      name: "Classic White Sneakers",
      description: "Timeless white sneakers with clean lines and premium leather upper. Versatile enough for casual and semi-formal looks.",
      price: 4999, comparePrice: 6999, categoryId: footwear.id, brandId: puma.id,
      images: [IMAGES.whiteShoe, IMAGES.sneaker, IMAGES.greyShoe],
      featured: false, newArrival: false, rating: 4.3, reviewCount: 165,
      variants: [
        { size: "S", color: "White", colorHex: "#FFFFFF", stock: 20, sku: "CSN-WHT-7" },
        { size: "M", color: "White", colorHex: "#FFFFFF", stock: 30, sku: "CSN-WHT-9" },
        { size: "L", color: "White", colorHex: "#FFFFFF", stock: 25, sku: "CSN-WHT-10" },
      ]
    },
    {
      name: "Retro Basketball Sneakers",
      description: "Iconic retro basketball sneakers with high-top design. Premium leather construction with padded collar for ankle support.",
      price: 8999, comparePrice: 11999, categoryId: footwear.id, brandId: nike.id,
      images: [IMAGES.sneaker, IMAGES.redShoe, IMAGES.colorfulShoe],
      featured: false, newArrival: true, rating: 4.6, reviewCount: 190,
      variants: [
        { size: "M", color: "Red", colorHex: "#EF4444", stock: 10, sku: "RTR-RED-9" },
        { size: "L", color: "Black", colorHex: "#000000", stock: 12, sku: "RTR-BLK-10" },
        { size: "XL", color: "White", colorHex: "#FFFFFF", stock: 8, sku: "RTR-WHT-11" },
      ]
    },
    {
      name: "Elegant Stiletto Heels",
      description: "Sophisticated stiletto heels crafted from premium materials. Perfect for formal events and special occasions.",
      price: 7999, comparePrice: 10999, categoryId: footwear.id, brandId: gucci.id,
      images: [IMAGES.heels, IMAGES.fashion, IMAGES.dress],
      featured: false, newArrival: false, rating: 4.1, reviewCount: 55,
      variants: [
        { size: "S", color: "Black", colorHex: "#000000", stock: 8, sku: "STL-BLK-6" },
        { size: "M", color: "Black", colorHex: "#000000", stock: 10, sku: "STL-BLK-7" },
        { size: "L", color: "Nude", colorHex: "#D4A574", stock: 7, sku: "STL-NUD-8" },
      ]
    },
    {
      name: "Grey Training Shoes",
      description: "Versatile training shoes with superior grip and stability. Ideal for gym workouts and cross-training sessions.",
      price: 5999, comparePrice: 7999, categoryId: footwear.id, brandId: puma.id,
      images: [IMAGES.greyShoe, IMAGES.runningShoe, IMAGES.sneaker],
      featured: false, newArrival: false, rating: 4.4, reviewCount: 88,
      variants: [
        { size: "M", color: "Grey", colorHex: "#9E9E9E", stock: 15, sku: "TRN-GRY-9" },
        { size: "L", color: "Grey", colorHex: "#9E9E9E", stock: 12, sku: "TRN-GRY-10" },
        { size: "XL", color: "Black", colorHex: "#000000", stock: 10, sku: "TRN-BLK-11" },
      ]
    },

    // Accessories
    {
      name: "Luxury Chronograph Watch",
      description: "Exquisite chronograph watch with stainless steel case and sapphire crystal. Water resistant to 100m with Swiss movement.",
      price: 24999, comparePrice: 34999, categoryId: accessories.id, brandId: gucci.id,
      images: [IMAGES.watch, IMAGES.watch2, IMAGES.fashion],
      featured: true, newArrival: false, rating: 4.9, reviewCount: 45,
      variants: [
        { size: "M", color: "Silver", colorHex: "#C0C0C0", stock: 5, sku: "CHR-SLV-M" },
        { size: "L", color: "Gold", colorHex: "#FFD700", stock: 3, sku: "CHR-GLD-L" },
        { size: "M", color: "Rose Gold", colorHex: "#B76E79", stock: 4, sku: "CHR-RGD-M" },
      ]
    },
    {
      name: "Minimalist Leather Watch",
      description: "Sleek minimalist watch with genuine leather strap and Japanese quartz movement. Clean dial design for everyday elegance.",
      price: 3999, comparePrice: 5999, categoryId: accessories.id, brandId: ralphLauren.id,
      images: [IMAGES.watch2, IMAGES.watch, IMAGES.shirt],
      featured: false, newArrival: true, rating: 4.5, reviewCount: 130,
      variants: [
        { size: "S", color: "Brown", colorHex: "#795548", stock: 15, sku: "MIN-BRN-S" },
        { size: "M", color: "Black", colorHex: "#000000", stock: 20, sku: "MIN-BLK-M" },
        { size: "L", color: "Black", colorHex: "#000000", stock: 12, sku: "MIN-BLK-L" },
      ]
    },
    {
      name: "Classic Baseball Cap",
      description: "Structured baseball cap with adjustable strap. Made from premium cotton twill with embroidered logo.",
      price: 1299, comparePrice: 1799, categoryId: accessories.id, brandId: nike.id,
      images: [IMAGES.cap, IMAGES.sportswear, IMAGES.sneaker],
      featured: false, newArrival: false, rating: 4.0, reviewCount: 200,
      variants: [
        { size: "S", color: "Black", colorHex: "#000000", stock: 25, sku: "BBC-BLK-S" },
        { size: "M", color: "White", colorHex: "#FFFFFF", stock: 30, sku: "BBC-WHT-M" },
        { size: "L", color: "Red", colorHex: "#EF4444", stock: 20, sku: "BBC-RED-L" },
      ]
    },
    {
      name: "Designer Sunglasses",
      description: "Premium polarized sunglasses with UV400 protection. Lightweight acetate frame with Italian craftsmanship.",
      price: 6999, comparePrice: 9999, categoryId: accessories.id, brandId: gucci.id,
      images: [IMAGES.fashion, IMAGES.watch, IMAGES.heels],
      featured: false, newArrival: false, rating: 4.3, reviewCount: 68,
      variants: [
        { size: "M", color: "Black", colorHex: "#000000", stock: 10, sku: "SUN-BLK-M" },
        { size: "M", color: "Tortoise", colorHex: "#8B4513", stock: 8, sku: "SUN-TRT-M" },
        { size: "L", color: "Gold", colorHex: "#FFD700", stock: 5, sku: "SUN-GLD-L" },
      ]
    },

    // Sportswear
    {
      name: "Performance Running Set",
      description: "High-performance running set with moisture-wicking fabric. Includes top and shorts with reflective details for visibility.",
      price: 3999, comparePrice: 5499, categoryId: sportswear.id, brandId: underArmour.id,
      images: [IMAGES.sportswear, IMAGES.runningShoe, IMAGES.cap],
      featured: true, newArrival: false, rating: 4.6, reviewCount: 145,
      variants: [
        { size: "S", color: "Black", colorHex: "#000000", stock: 12, sku: "PRS-BLK-S" },
        { size: "M", color: "Black", colorHex: "#000000", stock: 18, sku: "PRS-BLK-M" },
        { size: "L", color: "Blue", colorHex: "#3B82F6", stock: 14, sku: "PRS-BLU-L" },
        { size: "XL", color: "Blue", colorHex: "#3B82F6", stock: 8, sku: "PRS-BLU-XL" },
      ]
    },
    {
      name: "Tech Fleece Hoodie",
      description: "Innovative tech fleece hoodie with engineered knit for lightweight warmth. Modern silhouette with zippered pockets.",
      price: 5999, comparePrice: 7999, categoryId: sportswear.id, brandId: nike.id,
      images: [IMAGES.hoodie, IMAGES.sportswear, IMAGES.jacket],
      featured: false, newArrival: true, rating: 4.5, reviewCount: 98,
      variants: [
        { size: "S", color: "Grey", colorHex: "#9E9E9E", stock: 10, sku: "TFH-GRY-S" },
        { size: "M", color: "Grey", colorHex: "#9E9E9E", stock: 15, sku: "TFH-GRY-M" },
        { size: "L", color: "Black", colorHex: "#000000", stock: 12, sku: "TFH-BLK-L" },
        { size: "XL", color: "Black", colorHex: "#000000", stock: 8, sku: "TFH-BLK-XL" },
      ]
    },
    {
      name: "Compression Training Tights",
      description: "High-compression training tights with 4-way stretch fabric. Features flatlock seams and moisture management technology.",
      price: 2499, comparePrice: 3499, categoryId: sportswear.id, brandId: adidas.id,
      images: [IMAGES.sportswear, IMAGES.runningShoe, IMAGES.hoodie],
      featured: false, newArrival: false, rating: 4.4, reviewCount: 76,
      variants: [
        { size: "S", color: "Black", colorHex: "#000000", stock: 20, sku: "CTT-BLK-S" },
        { size: "M", color: "Black", colorHex: "#000000", stock: 25, sku: "CTT-BLK-M" },
        { size: "L", color: "Navy", colorHex: "#1E3A5F", stock: 15, sku: "CTT-NVY-L" },
      ]
    },
    {
      name: "Training Tank Top",
      description: "Lightweight training tank with mesh panels for breathability. Quick-dry fabric keeps you cool during intense workouts.",
      price: 1499, comparePrice: 1999, categoryId: sportswear.id, brandId: underArmour.id,
      images: [IMAGES.tshirt, IMAGES.sportswear, IMAGES.cap],
      featured: false, newArrival: false, rating: 4.2, reviewCount: 55,
      variants: [
        { size: "S", color: "White", colorHex: "#FFFFFF", stock: 18, sku: "TTK-WHT-S" },
        { size: "M", color: "Black", colorHex: "#000000", stock: 22, sku: "TTK-BLK-M" },
        { size: "L", color: "Red", colorHex: "#EF4444", stock: 14, sku: "TTK-RED-L" },
      ]
    },

    // Kids
    {
      name: "Kids' Colorful Sneakers",
      description: "Fun and colorful sneakers for kids with easy velcro straps. Durable rubber sole with cushioned insole for all-day play.",
      price: 1999, comparePrice: 2999, categoryId: kids.id, brandId: nike.id,
      images: [IMAGES.colorfulShoe, IMAGES.sneaker, IMAGES.cap],
      featured: false, newArrival: false, rating: 4.5, reviewCount: 95,
      variants: [
        { size: "S", color: "Multi", colorHex: "#6366F1", stock: 15, sku: "KSN-MLT-S" },
        { size: "M", color: "Pink", colorHex: "#EC4899", stock: 12, sku: "KSN-PNK-M" },
        { size: "L", color: "Blue", colorHex: "#3B82F6", stock: 10, sku: "KSN-BLU-L" },
      ]
    },
    {
      name: "Kids' Denim Overalls",
      description: "Adorable denim overalls with adjustable straps and snap buttons. Reinforced knees for extra durability during playtime.",
      price: 1799, comparePrice: 2499, categoryId: kids.id, brandId: levis.id,
      images: [IMAGES.denim, IMAGES.colorfulShoe, IMAGES.tshirt],
      featured: false, newArrival: false, rating: 4.3, reviewCount: 42,
      variants: [
        { size: "S", color: "Blue", colorHex: "#3B82F6", stock: 10, sku: "KDO-BLU-S" },
        { size: "M", color: "Blue", colorHex: "#3B82F6", stock: 14, sku: "KDO-BLU-M" },
        { size: "L", color: "Light Blue", colorHex: "#64B5F6", stock: 8, sku: "KDO-LBL-L" },
      ]
    },
    {
      name: "Kids' Sporty Hoodie",
      description: "Soft and cozy hoodie for active kids. Features kangaroo pocket and ribbed cuffs with fun color-blocking design.",
      price: 1499, comparePrice: 1999, categoryId: kids.id, brandId: adidas.id,
      images: [IMAGES.hoodie, IMAGES.sportswear, IMAGES.cap],
      featured: false, newArrival: false, rating: 4.4, reviewCount: 63,
      variants: [
        { size: "S", color: "Red", colorHex: "#EF4444", stock: 12, sku: "KHO-RED-S" },
        { size: "M", color: "Blue", colorHex: "#3B82F6", stock: 16, sku: "KHO-BLU-M" },
        { size: "L", color: "Green", colorHex: "#22C55E", stock: 10, sku: "KHO-GRN-L" },
      ]
    },
    {
      name: "Kids' Printed T-Shirt Set",
      description: "Pack of 3 fun printed t-shirts for kids. Made from soft organic cotton with vibrant colors that stay bright after washing.",
      price: 1299, comparePrice: 1899, categoryId: kids.id, brandId: hm.id,
      images: [IMAGES.tshirt, IMAGES.whiteTshirt, IMAGES.colorfulShoe],
      featured: false, newArrival: true, rating: 4.1, reviewCount: 38,
      variants: [
        { size: "S", color: "Assorted", colorHex: "#6366F1", stock: 20, sku: "KTS-AST-S" },
        { size: "M", color: "Assorted", colorHex: "#6366F1", stock: 18, sku: "KTS-AST-M" },
        { size: "L", color: "Assorted", colorHex: "#6366F1", stock: 14, sku: "KTS-AST-L" },
      ]
    },
    {
      name: "Kids' Running Shoes",
      description: "Lightweight and supportive running shoes for kids. Breathable mesh upper with cushioned sole for growing feet.",
      price: 2499, comparePrice: 3499, categoryId: kids.id, brandId: puma.id,
      images: [IMAGES.runningShoe, IMAGES.sneaker, IMAGES.sportswear],
      featured: false, newArrival: false, rating: 4.6, reviewCount: 110,
      variants: [
        { size: "S", color: "Blue", colorHex: "#3B82F6", stock: 14, sku: "KRS-BLU-S" },
        { size: "M", color: "Red", colorHex: "#EF4444", stock: 11, sku: "KRS-RED-M" },
        { size: "L", color: "Black", colorHex: "#000000", stock: 9, sku: "KRS-BLK-L" },
      ]
    },

    // Additional products to reach 30+
    {
      name: "Polo Classic T-Shirt",
      description: "Classic polo shirt with embroidered logo and ribbed collar. Premium piqué cotton for a polished casual look.",
      price: 1999, comparePrice: 2999, categoryId: mensClothing.id, brandId: ralphLauren.id,
      images: [IMAGES.shirt, IMAGES.tshirt, IMAGES.fashion],
      featured: false, newArrival: false, rating: 4.3, reviewCount: 175,
      variants: [
        { size: "S", color: "Navy", colorHex: "#1E3A5F", stock: 12, sku: "POL-NVY-S" },
        { size: "M", color: "White", colorHex: "#FFFFFF", stock: 20, sku: "POL-WHT-M" },
        { size: "L", color: "Red", colorHex: "#EF4444", stock: 15, sku: "POL-RED-L" },
        { size: "XL", color: "Navy", colorHex: "#1E3A5F", stock: 8, sku: "POL-NVY-XL" },
      ]
    },
    {
      name: "Women's Athleisure Set",
      description: "Trendy athleisure set with cropped hoodie and matching leggings. Perfect for workouts or casual weekend outings.",
      price: 3499, comparePrice: 4999, categoryId: womensClothing.id, brandId: puma.id,
      images: [IMAGES.hoodie, IMAGES.sportswear, IMAGES.dress],
      featured: false, newArrival: true, rating: 4.4, reviewCount: 67,
      variants: [
        { size: "S", color: "Grey", colorHex: "#9E9E9E", stock: 10, sku: "WAS-GRY-S" },
        { size: "M", color: "Pink", colorHex: "#EC4899", stock: 14, sku: "WAS-PNK-M" },
        { size: "L", color: "Black", colorHex: "#000000", stock: 12, sku: "WAS-BLK-L" },
      ]
    },
    {
      name: "Canvas Slip-On Sneakers",
      description: "Casual canvas slip-on sneakers with elastic side panels. Lightweight and flexible for effortless everyday style.",
      price: 2499, comparePrice: 3499, categoryId: footwear.id, brandId: uniqlo.id,
      images: [IMAGES.whiteShoe, IMAGES.greyShoe, IMAGES.sneaker],
      featured: false, newArrival: false, rating: 4.1, reviewCount: 92,
      variants: [
        { size: "S", color: "White", colorHex: "#FFFFFF", stock: 18, sku: "CSV-WHT-S" },
        { size: "M", color: "Navy", colorHex: "#1E3A5F", stock: 22, sku: "CSV-NVY-M" },
        { size: "L", color: "Black", colorHex: "#000000", stock: 15, sku: "CSV-BLK-L" },
      ]
    },
    {
      name: "Silk Evening Blouse",
      description: "Luxurious silk blouse with elegant draping and pearl buttons. Transitions seamlessly from office to evening wear.",
      price: 5999, comparePrice: 8499, categoryId: womensClothing.id, brandId: zara.id,
      images: [IMAGES.fashion, IMAGES.dress, IMAGES.heels],
      featured: false, newArrival: false, rating: 4.6, reviewCount: 48,
      variants: [
        { size: "S", color: "Ivory", colorHex: "#FFFFF0", stock: 6, sku: "SEB-IVR-S" },
        { size: "M", color: "Black", colorHex: "#000000", stock: 10, sku: "SEB-BLK-M" },
        { size: "L", color: "Burgundy", colorHex: "#800020", stock: 5, sku: "SEB-BRG-L" },
      ]
    },
  ]

  // Create products with variants
  const createdProducts = []
  for (const pDef of productDefs) {
    const { variants, ...productData } = pDef
    const product = await prisma.product.create({
      data: {
        ...productData,
        images: JSON.stringify(productData.images),
        slug: slugify(productData.name),
        variants: {
          create: variants
        }
      }
    })
    createdProducts.push(product)
  }

  console.log(`✅ Created ${createdProducts.length} products`)

  // ── Users ──
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@luxe.com",
      name: "Admin User",
      role: "admin",
      password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsv97NuEy", // Admin@123
      phone: "+919876543210",
    }
  })

  const regularUser = await prisma.user.create({
    data: {
      email: "user@luxe.com",
      name: "Demo User",
      role: "user",
      password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsv97NuEy", // User@123
      phone: "+919876543211",
    }
  })

  // ── Addresses ──
  await prisma.address.create({
    data: {
      userId: regularUser.id,
      name: "Demo User",
      phone: "+919876543211",
      address1: "42, Park Street",
      address2: "Apt 3B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      isDefault: true,
    }
  })

  await prisma.address.create({
    data: {
      userId: adminUser.id,
      name: "Admin User",
      phone: "+919876543210",
      address1: "15, MG Road",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      isDefault: true,
    }
  })

  // ── Coupons ──
  await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      discountPercent: 10,
      minOrderAmount: 999,
      maxDiscount: null,
      isActive: true,
      expiresAt: new Date("2026-12-31"),
    }
  })

  await prisma.coupon.create({
    data: {
      code: "FASHION20",
      discountPercent: 20,
      minOrderAmount: 2999,
      maxDiscount: 1000,
      isActive: true,
      expiresAt: new Date("2026-12-31"),
    }
  })

  await prisma.coupon.create({
    data: {
      code: "SUMMER15",
      discountPercent: 15,
      minOrderAmount: 1999,
      maxDiscount: null,
      isActive: true,
      expiresAt: new Date("2026-12-31"),
    }
  })

  // ── Demo Orders ──
  // Order 1: Delivered
  const order1 = await prisma.order.create({
    data: {
      userId: regularUser.id,
      totalAmount: 12498,
      discountAmount: 1250,
      taxAmount: 2249.64,
      finalAmount: 13497.64,
      status: "delivered",
      couponCode: "FASHION20",
      paymentId: "pay_demo_001",
      paymentMethod: "card",
      shippingName: "Demo User",
      shippingPhone: "+919876543211",
      shippingAddress: "42, Park Street, Apt 3B",
      shippingCity: "Mumbai",
      shippingState: "Maharashtra",
      shippingPincode: "400001",
      orderItems: {
        create: [
          {
            productId: createdProducts[9].id, // Air Max
            quantity: 1,
            price: 9999,
            productName: "Air Max Running Shoes",
            productImage: IMAGES.redShoe,
          },
          {
            productId: createdProducts[1].id, // T-Shirt
            quantity: 1,
            price: 799,
            productName: "Slim Fit Crew Neck T-Shirt",
            productImage: IMAGES.whiteTshirt,
          },
          {
            productId: createdProducts[5].id, // Dress
            quantity: 1,
            price: 2999,
            productName: "Floral Summer Dress",
            productImage: IMAGES.dress,
          },
        ]
      }
    }
  })

  // Order 2: Shipped
  const order2 = await prisma.order.create({
    data: {
      userId: regularUser.id,
      totalAmount: 16998,
      discountAmount: 0,
      taxAmount: 3059.64,
      finalAmount: 20057.64,
      status: "shipped",
      paymentId: "pay_demo_002",
      paymentMethod: "upi",
      shippingName: "Demo User",
      shippingPhone: "+919876543211",
      shippingAddress: "42, Park Street, Apt 3B",
      shippingCity: "Mumbai",
      shippingState: "Maharashtra",
      shippingPincode: "400001",
      orderItems: {
        create: [
          {
            productId: createdProducts[10].id, // Ultraboost
            quantity: 1,
            price: 14999,
            productName: "Ultraboost 22",
            productImage: IMAGES.colorfulShoe,
          },
          {
            productId: createdProducts[15].id, // Watch
            quantity: 1,
            price: 3999,
            productName: "Minimalist Leather Watch",
            productImage: IMAGES.watch2,
          },
        ]
      }
    }
  })

  // Order 3: Processing
  await prisma.order.create({
    data: {
      userId: regularUser.id,
      totalAmount: 5498,
      discountAmount: 825,
      taxAmount: 841.14,
      finalAmount: 5514.14,
      status: "processing",
      couponCode: "SUMMER15",
      paymentId: "pay_demo_003",
      paymentMethod: "card",
      shippingName: "Demo User",
      shippingPhone: "+919876543211",
      shippingAddress: "42, Park Street, Apt 3B",
      shippingCity: "Mumbai",
      shippingState: "Maharashtra",
      shippingPincode: "400001",
      orderItems: {
        create: [
          {
            productId: createdProducts[3].id, // Denim Jacket
            quantity: 1,
            price: 4999,
            productName: "Premium Denim Jacket",
            productImage: IMAGES.jacket,
          },
          {
            productId: createdProducts[16].id, // Cap
            quantity: 1,
            price: 1299,
            productName: "Classic Baseball Cap",
            productImage: IMAGES.cap,
          },
        ]
      }
    }
  })

  // Order 4: Pending
  await prisma.order.create({
    data: {
      userId: adminUser.id,
      totalAmount: 37997,
      discountAmount: 1000,
      taxAmount: 6659.46,
      finalAmount: 43656.46,
      status: "pending",
      couponCode: "FASHION20",
      paymentMethod: "card",
      shippingName: "Admin User",
      shippingPhone: "+919876543210",
      shippingAddress: "15, MG Road",
      shippingCity: "Delhi",
      shippingState: "Delhi",
      shippingPincode: "110001",
      orderItems: {
        create: [
          {
            productId: createdProducts[14].id, // Luxury Watch
            quantity: 1,
            price: 24999,
            productName: "Luxury Chronograph Watch",
            productImage: IMAGES.watch,
          },
          {
            productId: createdProducts[2].id, // Denim Jacket
            quantity: 1,
            price: 4999,
            productName: "Premium Denim Jacket",
            productImage: IMAGES.jacket,
          },
          {
            productId: createdProducts[7].id, // Skinny Jeans
            quantity: 1,
            price: 2799,
            productName: "High-Waisted Skinny Jeans",
            productImage: IMAGES.denim,
          },
          {
            productId: createdProducts[16].id, // Cap
            quantity: 1,
            price: 1299,
            productName: "Classic Baseball Cap",
            productImage: IMAGES.cap,
          },
        ]
      }
    }
  })

  // ── Reviews ──
  const reviewDefs = [
    { userId: regularUser.id, productId: createdProducts[9].id, rating: 5, title: "Best running shoes!", comment: "Incredibly comfortable and supportive. Best running shoes I've ever owned." },
    { userId: regularUser.id, productId: createdProducts[0].id, rating: 4, title: "Great shirt", comment: "Nice quality fabric and fit. Runs slightly large so size down if between sizes." },
    { userId: regularUser.id, productId: createdProducts[10].id, rating: 5, title: "Worth every penny", comment: "The boost technology is amazing. My feet feel great even after a 10K run." },
    { userId: adminUser.id, productId: createdProducts[5].id, rating: 4, title: "Beautiful dress", comment: "Stunning floral pattern. The fabric is light and perfect for summer." },
    { userId: adminUser.id, productId: createdProducts[14].id, rating: 5, title: "Luxury at its finest", comment: "Exquisite craftsmanship. The attention to detail is remarkable." },
    { userId: regularUser.id, productId: createdProducts[2].id, rating: 4, title: "Classic denim", comment: "Great quality denim jacket. The vintage wash looks authentic." },
    { userId: regularUser.id, productId: createdProducts[18].id, rating: 5, title: "Perfect running set", comment: "Moisture-wicking works great. Fits perfectly and looks stylish too." },
    { userId: adminUser.id, productId: createdProducts[4].id, rating: 5, title: "Statement piece", comment: "The leather quality is outstanding. Gets compliments everywhere I go." },
  ]

  for (const r of reviewDefs) {
    await prisma.review.create({ data: r })
  }

  console.log('✅ Seed data created successfully!')
  console.log(`  - ${categories.length} categories`)
  console.log(`  - ${brands.length} brands`)
  console.log(`  - ${createdProducts.length} products with variants`)
  console.log(`  - 3 coupons`)
  console.log(`  - 2 users (admin + regular)`)
  console.log(`  - 4 demo orders`)
  console.log(`  - ${reviewDefs.length} reviews`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
