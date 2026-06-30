import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Image URLs from Unsplash — each product gets unique, semantically matching photos
const IMG = {
  // ── Men's Shirts & Tops ──
  oxfordShirt1: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
  oxfordShirt2: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80",
  crewTshirt1: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
  crewTshirt2: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
  graphicTee1: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
  graphicTee2: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
  poloShirt1: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
  poloShirt2: "https://images.unsplash.com/photo-1625910513413-5fc7e5330d2e?w=800&q=80",
  linenShirt1: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80",
  linenShirt2: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
  henleyShirt1: "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=800&q=80",
  henleyShirt2: "https://images.unsplash.com/photo-1583496661160-c588c25a5874?w=800&q=80",
  // ── Men's Jackets & Outerwear ──
  denimJacket1: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
  denimJacket2: "https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800&q=80",
  leatherJacket1: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80",
  leatherJacket2: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
  pufferVest1: "https://images.unsplash.com/photo-1544923246-77307dd270cb?w=800&q=80",
  pufferVest2: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
  // ── Men's Pants ──
  chinos1: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
  chinos2: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
  jeans1: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
  jeans2: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
  // ── Men's Sweaters & Suits ──
  sweaterMen1: "https://images.unsplash.com/photo-1614975059251-992f11792571?w=800&q=80",
  sweaterMen2: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
  suit1: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
  suit2: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
  // ── Women's Dresses ──
  floralDress1: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
  floralDress2: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
  wrapDress1: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?w=800&q=80",
  wrapDress2: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
  // ── Women's Tops & Blouses ──
  knitSweater1: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
  knitSweater2: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a30?w=800&q=80",
  silkBlouse1: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80",
  silkBlouse2: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&q=80",
  turtleneck1: "https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?w=800&q=80",
  turtleneck2: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
  // ── Women's Bottoms ──
  skinnyJeans1: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
  skinnyJeans2: "https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=800&q=80",
  floralSkirt1: "https://images.unsplash.com/photo-1583496661160-c588c25a5874?w=800&q=80",
  floralSkirt2: "https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=800&q=80",
  palazzo1: "https://images.unsplash.com/photo-1509631179647-0c1158f33166?w=800&q=80",
  palazzo2: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&q=80",
  // ── Women's Blazers & Outerwear ──
  blazer1: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
  blazer2: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
  athleisure1: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&q=80",
  athleisure2: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
  // ── Footwear — Running Shoes ──
  redShoe: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  runningShoe1: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
  runningShoe2: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
  // ── Footwear — Sneakers ──
  ultraboost1: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
  ultraboost2: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80",
  whiteSneaker1: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
  whiteSneaker2: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80",
  retroSneaker1: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80",
  retroSneaker2: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
  canvasSneaker1: "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=800&q=80",
  canvasSneaker2: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80",
  // ── Footwear — Heels & Sandals ──
  heels1: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
  heels2: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
  sandals1: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80",
  sandals2: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=800&q=80",
  // ── Footwear — Boots & Loafers ──
  chelseaBoot1: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80",
  chelseaBoot2: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80",
  loafer1: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80",
  loafer2: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80",
  greyTrainer1: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80",
  greyTrainer2: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80",
  // ── Accessories — Watches ──
  chronoWatch1: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  chronoWatch2: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
  minWatch1: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a30?w=800&q=80",
  minWatch2: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80",
  // ── Accessories — Caps & Hats ──
  baseballCap1: "https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=800&q=80",
  baseballCap2: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&q=80",
  beanie1: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80",
  beanie2: "https://images.unsplash.com/photo-1510598969022-c4c6c5d05769?w=800&q=80",
  visor1: "https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=800&q=80",
  visor2: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&q=80",
  // ── Accessories — Sunglasses, Bags, Scarves, Belts ──
  sunglasses1: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
  sunglasses2: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80",
  toteBag1: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
  toteBag2: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  scarf1: "https://images.unsplash.com/photo-1601370690183-1c7796ecec61?w=800&q=80",
  scarf2: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80",
  belt1: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80",
  belt2: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  // ── Sportswear ──
  runSet1: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
  runSet2: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80",
  techHoodie1: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
  techHoodie2: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800&q=80",
  compTights1: "https://images.unsplash.com/photo-1584865288642-42078afe6942?w=800&q=80",
  compTights2: "https://images.unsplash.com/photo-1584305417387-a2f07d2c366e?w=800&q=80",
  tankTop1: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
  tankTop2: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80",
  trainingShorts1: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
  trainingShorts2: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80",
  yogaLeggings1: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&q=80",
  yogaLeggings2: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
  runTop1: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
  runTop2: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
  windbreaker1: "https://images.unsplash.com/photo-1544923246-77307dd270cb?w=800&q=80",
  windbreaker2: "https://images.unsplash.com/photo-1547852355-4da3ec8a4b8e?w=800&q=80",
  gymBag1: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  gymBag2: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
  // ── Kids ──
  kidsSnkr1: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
  kidsSnkr2: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80",
  kidsDenim1: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
  kidsDenim2: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
  kidsHoodie1: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
  kidsHoodie2: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
  kidsTee1: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
  kidsTee2: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
  kidsRun1: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
  kidsRun2: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  kidsRain1: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
  kidsRain2: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
  kidsShorts1: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
  kidsShorts2: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
}

// Legacy compat aliases
const IMAGES = {
  redShoe: IMG.redShoe,
  colorfulShoe: IMG.ultraboost1,
  greyShoe: IMG.ultraboost2,
  whiteShoe: IMG.whiteSneaker1,
  shirt: IMG.oxfordShirt1,
  tshirt: IMG.suit1,
  whiteTshirt: IMG.crewTshirt1,
  jacket: IMG.crewTshirt2,
  leatherJacket: IMG.denimJacket1,
  dress: IMG.blazer1,
  fashion: IMG.floralDress1,
  watch: IMG.minWatch1,
  watch2: IMG.chronoWatch1,
  sneaker: IMG.runningShoe2,
  runningShoe: IMG.runningShoe1,
  sportswear: IMG.retroSneaker1,
  cap: IMG.visor1,
  denim: IMG.toteBag2,
  hoodie: IMG.pufferVest2,
  heels: IMG.heels1,
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
      images: [IMG.oxfordShirt1, IMG.oxfordShirt2],
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
      images: [IMG.crewTshirt1, IMG.crewTshirt2],
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
      images: [IMG.denimJacket1, IMG.denimJacket2],
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
      images: [IMG.graphicTee1, IMG.graphicTee2],
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
      images: [IMG.leatherJacket1, IMG.leatherJacket2],
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
      images: [IMG.floralDress1, IMG.floralDress2],
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
      images: [IMG.wrapDress1, IMG.wrapDress2],
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
      images: [IMG.knitSweater1, IMG.knitSweater2],
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
      images: [IMG.skinnyJeans1, IMG.skinnyJeans2],
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
      images: [IMG.redShoe, IMG.runningShoe1],
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
      images: [IMG.ultraboost1, IMG.ultraboost2],
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
      images: [IMG.whiteSneaker1, IMG.whiteSneaker2],
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
      images: [IMG.retroSneaker1, IMG.retroSneaker2],
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
      images: [IMG.heels1, IMG.heels2],
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
      images: [IMG.greyTrainer1, IMG.greyTrainer2],
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
      images: [IMG.chronoWatch1, IMG.chronoWatch2],
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
      images: [IMG.minWatch1, IMG.minWatch2],
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
      images: [IMG.baseballCap1, IMG.baseballCap2],
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
      images: [IMG.sunglasses1, IMG.sunglasses2],
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
      images: [IMG.runSet1, IMG.runSet2],
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
      images: [IMG.techHoodie1, IMG.techHoodie2],
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
      images: [IMG.compTights1, IMG.compTights2],
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
      images: [IMG.tankTop1, IMG.tankTop2],
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
      images: [IMG.kidsSnkr1, IMG.kidsSnkr2],
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
      images: [IMG.kidsDenim1, IMG.kidsDenim2],
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
      images: [IMG.kidsHoodie1, IMG.kidsHoodie2],
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
      images: [IMG.kidsTee1, IMG.kidsTee2],
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
      images: [IMG.kidsRun1, IMG.kidsRun2],
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
      images: [IMG.poloShirt1, IMG.poloShirt2],
      featured: false, newArrival: false, rating: 4.3, reviewCount: 175,
      variants: [
        { size: "S", color: "Navy", colorHex: "#1E3A5F", stock: 12, sku: "POL-NVY-S" },
        { size: "M", color: "White", colorHex: "#FFFFFF", stock: 20, sku: "POL-WHT-M" },
        { size: "L", color: "Red", colorHex: "#EF4444", stock: 15, sku: "POL-RED-L" },
        { size: "XL", color: "Navy", colorHex: "#1E3A5F", stock: 8, sku: "POL-NVY-XL" },
      ]
    },
    {
      name: "Women's Crop Top Hoodie",
      description: "Trendy cropped hoodie perfect for workouts or casual weekend outings.",
      price: 2499, comparePrice: 3499, categoryId: womensClothing.id, brandId: puma.id,
      images: [IMG.athleisure1, IMG.athleisure2],
      featured: false, newArrival: true, rating: 4.4, reviewCount: 67,
      variants: [
        { size: "S", color: "Grey", colorHex: "#9E9E9E", stock: 10, sku: "WCH-GRY-S" },
        { size: "M", color: "Pink", colorHex: "#EC4899", stock: 14, sku: "WCH-PNK-M" },
        { size: "L", color: "Black", colorHex: "#000000", stock: 12, sku: "WCH-BLK-L" },
      ]
    },
    {
      name: "Canvas Slip-On Sneakers",
      description: "Casual canvas slip-on sneakers with elastic side panels. Lightweight and flexible for effortless everyday style.",
      price: 2499, comparePrice: 3499, categoryId: footwear.id, brandId: uniqlo.id,
      images: [IMG.canvasSneaker1, IMG.canvasSneaker2],
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
      images: [IMG.silkBlouse1, IMG.silkBlouse2],
      featured: false, newArrival: false, rating: 4.6, reviewCount: 48,
      variants: [
        { size: "S", color: "Ivory", colorHex: "#FFFFF0", stock: 6, sku: "SEB-IVR-S" },
        { size: "M", color: "Black", colorHex: "#000000", stock: 10, sku: "SEB-BLK-M" },
        { size: "L", color: "Burgundy", colorHex: "#800020", stock: 5, sku: "SEB-BRG-L" },
      ]
    },

    // ── Extra 26 products ──

    // Men's Clothing (extra)
    {
      name: "Slim Fit Chinos",
      description: "Versatile slim fit chinos made from stretch cotton twill.",
      price: 2999, comparePrice: 3999, categoryId: mensClothing.id, brandId: uniqlo.id,
      images: [IMG.chinos1, IMG.chinos2],
      featured: false, newArrival: false, rating: 4.6, reviewCount: 125,
      variants: [
        { size: "M", color: "Khaki", colorHex: "#F0E68C", stock: 25, sku: "SFC-KHK-M" },
        { size: "L", color: "Navy", colorHex: "#1E3A5F", stock: 20, sku: "SFC-NVY-L" },
      ]
    },
    {
      name: "Casual Linen Shirt",
      description: "Breathable and lightweight linen shirt perfect for summer days.",
      price: 3499, comparePrice: 4499, categoryId: mensClothing.id, brandId: ralphLauren.id,
      images: [IMG.linenShirt1, IMG.linenShirt2],
      featured: true, newArrival: true, rating: 4.8, reviewCount: 88,
      variants: [
        { size: "L", color: "White", colorHex: "#FFFFFF", stock: 15, sku: "CLS-WHT-L" },
      ]
    },
    {
      name: "V-Neck Cashmere Sweater",
      description: "Luxuriously soft v-neck cashmere sweater for a sophisticated look.",
      price: 7999, comparePrice: 10999, categoryId: mensClothing.id, brandId: zara.id,
      images: [IMG.sweaterMen1, IMG.sweaterMen2],
      featured: false, newArrival: false, rating: 4.9, reviewCount: 54,
      variants: [
        { size: "M", color: "Grey", colorHex: "#808080", stock: 10, sku: "VCS-GRY-M" },
      ]
    },
    {
      name: "Classic Denim Jeans",
      description: "Straight leg classic denim jeans with subtle fading.",
      price: 3999, comparePrice: 5499, categoryId: mensClothing.id, brandId: levis.id,
      images: [IMG.jeans1, IMG.jeans2],
      featured: false, newArrival: false, rating: 4.5, reviewCount: 205,
      variants: [
        { size: "M", color: "Blue", colorHex: "#3B82F6", stock: 35, sku: "CDJ-BLU-M" },
      ]
    },
    {
      name: "Tailored Wool Suit",
      description: "Elegant tailored two-piece wool suit for formal occasions.",
      price: 14999, comparePrice: 19999, categoryId: mensClothing.id, brandId: zara.id,
      images: [IMG.suit1, IMG.suit2],
      featured: true, newArrival: true, rating: 4.7, reviewCount: 30,
      variants: [
        { size: "L", color: "Charcoal", colorHex: "#36454F", stock: 8, sku: "TWS-CHR-L" },
      ]
    },
    {
      name: "Quilted Puffer Vest",
      description: "Lightweight quilted puffer vest to keep your core warm.",
      price: 4599, comparePrice: 6599, categoryId: mensClothing.id, brandId: uniqlo.id,
      images: [IMG.pufferVest1, IMG.pufferVest2],
      featured: false, newArrival: false, rating: 4.4, reviewCount: 68,
      variants: [
        { size: "M", color: "Olive", colorHex: "#556B2F", stock: 22, sku: "QPV-OLV-M" },
      ]
    },
    {
      name: "Basic Henley Shirt",
      description: "Comfortable long-sleeve henley shirt with a three-button placket.",
      price: 1499, comparePrice: 2299, categoryId: mensClothing.id, brandId: hm.id,
      images: [IMG.henleyShirt1, IMG.henleyShirt2],
      featured: false, newArrival: true, rating: 4.3, reviewCount: 110,
      variants: [
        { size: "M", color: "White", colorHex: "#FFFFFF", stock: 30, sku: "BHS-WHT-M" },
        { size: "L", color: "Black", colorHex: "#000000", stock: 25, sku: "BHS-BLK-L" },
      ]
    },

    // Women's Clothing (extra)
    {
      name: "Floral Midi Skirt",
      description: "Elegant A-line midi skirt in lightweight floral chiffon, perfect for spring.",
      price: 2199, comparePrice: 3299, categoryId: womensClothing.id, brandId: zara.id,
      images: [IMG.floralSkirt1, IMG.floralSkirt2],
      featured: false, newArrival: true, rating: 4.5, reviewCount: 76,
      variants: [
        { size: "S", color: "Pink", colorHex: "#EC4899", stock: 14, sku: "FMS-PNK-S" },
        { size: "M", color: "Blue", colorHex: "#3B82F6", stock: 18, sku: "FMS-BLU-M" },
      ]
    },
    {
      name: "Turtleneck Ribbed Top",
      description: "Cosy ribbed turtleneck top that pairs perfectly with jeans or skirts.",
      price: 1799, comparePrice: 2599, categoryId: womensClothing.id, brandId: hm.id,
      images: [IMG.turtleneck1, IMG.turtleneck2],
      featured: false, newArrival: false, rating: 4.4, reviewCount: 99,
      variants: [
        { size: "S", color: "Cream", colorHex: "#FFFDD0", stock: 20, sku: "TRT-CRM-S" },
        { size: "M", color: "Black", colorHex: "#000000", stock: 22, sku: "TRT-BLK-M" },
      ]
    },
    {
      name: "Wide-Leg Palazzo Pants",
      description: "Breezy wide-leg palazzo pants in premium crepe fabric for an effortless look.",
      price: 2599, comparePrice: 3799, categoryId: womensClothing.id, brandId: uniqlo.id,
      images: [IMG.palazzo1, IMG.palazzo2],
      featured: false, newArrival: false, rating: 4.3, reviewCount: 61,
      variants: [
        { size: "S", color: "White", colorHex: "#FFFFFF", stock: 12, sku: "WLP-WHT-S" },
        { size: "M", color: "Beige", colorHex: "#F5F5DC", stock: 16, sku: "WLP-BGE-M" },
      ]
    },
    {
      name: "Cropped Blazer",
      description: "Structured cropped blazer with a modern silhouette, ideal for smart-casual outfits.",
      price: 4999, comparePrice: 6999, categoryId: womensClothing.id, brandId: zara.id,
      images: [IMG.blazer1, IMG.blazer2],
      featured: true, newArrival: true, rating: 4.7, reviewCount: 53,
      variants: [
        { size: "S", color: "Black", colorHex: "#000000", stock: 8, sku: "CBL-BLK-S" },
        { size: "M", color: "Camel", colorHex: "#C19A6B", stock: 10, sku: "CBL-CML-M" },
      ]
    },

    // Footwear (extra)
    {
      name: "Suede Chelsea Boots",
      description: "Classic Chelsea boots in premium suede leather with elastic side panels.",
      price: 7499, comparePrice: 9999, categoryId: footwear.id, brandId: zara.id,
      images: [IMG.chelseaBoot1, IMG.chelseaBoot2],
      featured: true, newArrival: false, rating: 4.6, reviewCount: 142,
      variants: [
        { size: "M", color: "Tan", colorHex: "#D2B48C", stock: 12, sku: "SCB-TAN-M" },
        { size: "L", color: "Black", colorHex: "#000000", stock: 10, sku: "SCB-BLK-L" },
      ]
    },
    {
      name: "Slip-On Loafers",
      description: "Comfortable and stylish leather loafers, a wardrobe essential for any occasion.",
      price: 4999, comparePrice: 6499, categoryId: footwear.id, brandId: ralphLauren.id,
      images: [IMG.loafer1, IMG.loafer2],
      featured: false, newArrival: false, rating: 4.4, reviewCount: 87,
      variants: [
        { size: "M", color: "Brown", colorHex: "#795548", stock: 18, sku: "SLL-BRN-M" },
        { size: "L", color: "Black", colorHex: "#000000", stock: 14, sku: "SLL-BLK-L" },
      ]
    },
    {
      name: "Platform Sandals",
      description: "Trendy platform sandals with cushioned sole and adjustable ankle strap.",
      price: 3499, comparePrice: 4999, categoryId: footwear.id, brandId: puma.id,
      images: [IMG.sandals1, IMG.sandals2],
      featured: false, newArrival: true, rating: 4.2, reviewCount: 64,
      variants: [
        { size: "S", color: "White", colorHex: "#FFFFFF", stock: 16, sku: "PLS-WHT-S" },
        { size: "M", color: "Nude", colorHex: "#D4A574", stock: 12, sku: "PLS-NUD-M" },
      ]
    },

    // Accessories (extra)
    {
      name: "Leather Tote Bag",
      description: "Spacious genuine leather tote bag with multiple compartments, perfect for work or weekend.",
      price: 8999, comparePrice: 12999, categoryId: accessories.id, brandId: gucci.id,
      images: [IMG.toteBag1, IMG.toteBag2],
      featured: true, newArrival: false, rating: 4.8, reviewCount: 72,
      variants: [
        { size: "One Size", color: "Black", colorHex: "#000000", stock: 8, sku: "LTB-BLK-OS" },
        { size: "One Size", color: "Tan", colorHex: "#D2B48C", stock: 6, sku: "LTB-TAN-OS" },
      ]
    },
    {
      name: "Silk Scarf",
      description: "Elegant 100% silk scarf with vibrant print, versatile enough to wear multiple ways.",
      price: 2499, comparePrice: 3499, categoryId: accessories.id, brandId: gucci.id,
      images: ["https://images.unsplash.com/photo-1583496661160-c588c25a5874?w=400&q=80"],
      featured: false, newArrival: true, rating: 4.5, reviewCount: 48,
      variants: [
        { size: "One Size", color: "Multi", colorHex: "#6366F1", stock: 20, sku: "SSC-MLT-OS" },
      ]
    },
    {
      name: "Leather Belt",
      description: "Classic genuine leather belt with polished metal buckle, a must-have accessory.",
      price: 1799, comparePrice: 2499, categoryId: accessories.id, brandId: ralphLauren.id,
      images: [IMG.belt1, IMG.belt2],
      featured: false, newArrival: false, rating: 4.3, reviewCount: 136,
      variants: [
        { size: "M", color: "Brown", colorHex: "#795548", stock: 25, sku: "LBT-BRN-M" },
        { size: "L", color: "Black", colorHex: "#000000", stock: 20, sku: "LBT-BLK-L" },
      ]
    },
    {
      name: "Wool Beanie",
      description: "Warm merino wool beanie with a ribbed cuff for a snug and stylish winter look.",
      price: 999, comparePrice: 1499, categoryId: accessories.id, brandId: uniqlo.id,
      images: ["https://images.unsplash.com/photo-1510598969022-c4c6c5d05769?w=400&q=80"],
      featured: false, newArrival: false, rating: 4.4, reviewCount: 95,
      variants: [
        { size: "One Size", color: "Grey", colorHex: "#9E9E9E", stock: 30, sku: "WBN-GRY-OS" },
        { size: "One Size", color: "Black", colorHex: "#000000", stock: 25, sku: "WBN-BLK-OS" },
      ]
    },

    // Sportswear (extra)
    {
      name: "Men's Training Shorts",
      description: "Lightweight training shorts with quick-dry fabric and built-in briefs for maximum comfort.",
      price: 1999, comparePrice: 2999, categoryId: sportswear.id, brandId: nike.id,
      images: [IMG.trainingShorts1, IMG.trainingShorts2],
      featured: false, newArrival: true, rating: 4.5, reviewCount: 88,
      variants: [
        { size: "M", color: "Black", colorHex: "#000000", stock: 25, sku: "MTS-BLK-M" },
        { size: "L", color: "Grey", colorHex: "#808080", stock: 20, sku: "MTS-GRY-L" },
      ]
    },
    {
      name: "Women's Running Shorts",
      description: "Lightweight, breathable running shorts designed for maximum flexibility and comfort.",
      price: 1999, comparePrice: 2499, categoryId: sportswear.id, brandId: puma.id,
      images: [IMG.yogaLeggings1, IMG.yogaLeggings2],
      featured: true, newArrival: false, rating: 4.9, reviewCount: 156,
      variants: [
        { size: "S", color: "Navy", colorHex: "#1E3A5F", stock: 18, sku: "WRS-NVY-S" },
        { size: "M", color: "Black", colorHex: "#000000", stock: 30, sku: "WRS-BLK-M" },
      ]
    },
    {
      name: "Breathable Running Top",
      description: "Moisture-wicking long sleeve running top for cool weather training.",
      price: 2499, comparePrice: 3499, categoryId: sportswear.id, brandId: adidas.id,
      images: [IMG.runTop1, IMG.runTop2],
      featured: false, newArrival: true, rating: 4.4, reviewCount: 45,
      variants: [
        { size: "M", color: "Blue", colorHex: "#3B82F6", stock: 22, sku: "BRT-BLU-M" },
      ]
    },
    {
      name: "Reflective Windbreaker",
      description: "Lightweight windbreaker with reflective details for night runs.",
      price: 4999, comparePrice: 6999, categoryId: sportswear.id, brandId: nike.id,
      images: ["https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&q=80"],
      featured: false, newArrival: true, rating: 4.6, reviewCount: 92,
      variants: [
        { size: "M", color: "Silver", colorHex: "#C0C0C0", stock: 10, sku: "RWB-SLV-M" },
      ]
    },
    {
      name: "Gym Duffel Bag",
      description: "Spacious gym duffel bag with a dedicated shoe compartment.",
      price: 3499, comparePrice: 4999, categoryId: sportswear.id, brandId: puma.id,
      images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80"],
      featured: true, newArrival: true, rating: 4.7, reviewCount: 110,
      variants: [
        { size: "One Size", color: "Black", colorHex: "#000000", stock: 18, sku: "GDB-BLK-OS" },
      ]
    },

    // Kids (extra)
    {
      name: "Kids' Waterproof Rain Jacket",
      description: "Colourful waterproof rain jacket for kids with taped seams and adjustable hood.",
      price: 1999, comparePrice: 2999, categoryId: kids.id, brandId: adidas.id,
      images: [IMG.kidsRain1, IMG.kidsRain2],
      featured: false, newArrival: true, rating: 4.6, reviewCount: 55,
      variants: [
        { size: "S", color: "Yellow", colorHex: "#FBBF24", stock: 15, sku: "KRJ-YLW-S" },
        { size: "M", color: "Red", colorHex: "#EF4444", stock: 12, sku: "KRJ-RED-M" },
      ]
    },
    {
      name: "Kids' Casual Shorts Set",
      description: "Comfortable cotton shorts set for kids, perfect for summer play.",
      price: 1099, comparePrice: 1599, categoryId: kids.id, brandId: hm.id,
      images: [IMG.kidsShorts1, IMG.kidsShorts2],
      featured: false, newArrival: false, rating: 4.2, reviewCount: 43,
      variants: [
        { size: "S", color: "Multi", colorHex: "#6366F1", stock: 18, sku: "KCS-MLT-S" },
        { size: "M", color: "Multi", colorHex: "#6366F1", stock: 14, sku: "KCS-MLT-M" },
      ]
    },
    {
      name: "Sport Visor",
      description: "Breathable sport visor to keep the sun out of your eyes during intense outdoor activity.",
      price: 899, comparePrice: 1299, categoryId: sportswear.id, brandId: adidas.id,
      images: [IMG.visor1, IMG.visor2],
      featured: false, newArrival: false, rating: 4.2, reviewCount: 34,
      variants: [
        { size: "One Size", color: "White", colorHex: "#FFFFFF", stock: 40, sku: "SVR-WHT-OS" },
        { size: "One Size", color: "Black", colorHex: "#000000", stock: 30, sku: "SVR-BLK-OS" },
      ]
    },
  ]

  // Create products with variants
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createdProducts: any[] = []
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
  // Hash passwords with bcryptjs
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const bcrypt = require('bcryptjs');
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const userPasswordHash = await bcrypt.hash('User@123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@luxe.com",
      name: "Admin User",
      role: "admin",
      password: adminPasswordHash,
      phone: "+919876543210",
      emailVerified: new Date(),
      image: "https://ui-avatars.com/api/?name=Admin+User&background=1a1a1a&color=fff&size=200",
      avatar: "https://ui-avatars.com/api/?name=Admin+User&background=1a1a1a&color=fff&size=200",
    }
  })

  const regularUser = await prisma.user.create({
    data: {
      email: "user@luxe.com",
      name: "Demo User",
      role: "user",
      password: userPasswordHash,
      phone: "+919876543211",
      emailVerified: new Date(),
      image: "https://ui-avatars.com/api/?name=Demo+User&background=4285F4&color=fff&size=200",
      avatar: "https://ui-avatars.com/api/?name=Demo+User&background=4285F4&color=fff&size=200",
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
