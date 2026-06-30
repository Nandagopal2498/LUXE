const fs = require('fs');
const path = require('path');

const seedPath = "c:\\Users\\nanda\\Desktop\\Cloth\\prisma\\seed.ts";
console.log('Reading seed file from:', seedPath);

let content = fs.readFileSync(seedPath, 'utf8');

const imageMap = {
  // Men's Clothing
  "Classic Oxford Shirt": ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80", "https://images.unsplash.com/photo-1621072156002-e2fcc104e76d?w=800&q=80"],
  "Slim Fit Crew Neck T-Shirt": ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"],
  "Premium Denim Jacket": ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80", "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=800&q=80"],
  "Graphic Print T-Shirt": ["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80", "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"],
  "Leather Biker Jacket": ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", "https://images.unsplash.com/photo-1521223890158-f9f7c3d5bab3?w=800&q=80"],
  "Slim Fit Stretch Chino Pants": ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80", "https://images.unsplash.com/photo-1624378439343-42e20551a029?w=800&q=80"],
  "Polo Classic T-Shirt": ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80", "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"],
  "Levi's 511 Slim Fit Jeans": ["/images/levis-511-jeans.png"],
  "H&M Premium Regular Fit Linen Shirt": ["/images/hm-linen-shirt.png"],

  // Women's Clothing
  "Floral Summer Dress": ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80", "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80"],
  "Casual Wrap Dress": ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80", "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800&q=80"],
  "Oversized Knit Sweater": ["https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=800&q=80", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"],
  "High-Waisted Skinny Jeans": ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80", "https://images.unsplash.com/photo-1582142306909-195724d33ab0?w=800&q=80"],
  "Casual Denim Skirt": ["https://images.unsplash.com/photo-1582142306909-195724d33ab0?w=800&q=80", "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80"],
  "Classic Trench Coat": ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80", "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"],
  "Ribbed Knit Top": ["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80", "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80"],
  "Women's Athleisure Set": ["https://images.unsplash.com/photo-1768853990312-0e20e64cf87f?w=800&q=80"],
  "Silk Evening Blouse": ["/images/silk-evening-blouse.png"],
  "Zara Linen-Blend Smart Blazer": ["/images/zara-smart-blazer.png"],

  // Footwear
  "Air Max Running Shoes": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"],
  "Ultraboost 22": ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"],
  "Classic White Sneakers": ["https://images.unsplash.com/photo-1600185365405-b04bcfde9475?w=800&q=80"],
  "Retro Basketball Sneakers": ["https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80"],
  "Elegant Stiletto Heels": ["/images/high-heels.png"],
  "Grey Training Shoes": ["https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80"],
  "Canvas Slip-On Sneakers": ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80"],
  "Air Jordan 1 Retro High": ["/images/air-jordan-1-high.png"],
  "Puma Suede Classic Sneakers": ["/images/puma-suede.png"],
  "Nike Air Force 1 '07": ["/images/nike-af1.png"],

  // Accessories
  "Luxury Chronograph Watch": ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80"],
  "Minimalist Leather Watch": ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
  "Classic Baseball Cap": ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80"],
  "Designer Sunglasses": ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80"],
  "Gucci Double G Leather Belt": ["/images/gucci-leather-belt.png"],

  // Sportswear
  "Performance Running Set": ["https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80"],
  "Tech Fleece Hoodie": ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"],
  "Compression Training Tights": ["https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80"],
  "Training Tank Top": ["https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80"],
  "Dry-Fit Training Tee": ["https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80"],
  "Ultra-Stretch Yoga Leggings": ["/images/yoga-leggings.png"],
  "Windbreaker Track Jacket": ["https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&q=80"],
  "Athletic Crew Socks (3-Pack)": ["https://images.unsplash.com/photo-1582966772680-860e372bb558?w=800&q=80"],
  "Performance Sports Bra": ["https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80"],
  "Tech Knit Joggers": ["https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800&q=80"],
  "Running Headband & Wristband Set": ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"],
  "All-Weather Running Gloves": ["https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80"],
  "Hybrid Gym Shorts": ["/images/gym-shorts.png"],
  "Sportswear Sleeveless Hoodie": ["https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80"],
  "Adidas Essentials Fleece Hoodie": ["/images/adidas-fleece-hoodie.png"],

  // Kids
  "Kids' Colorful Sneakers": ["https://images.unsplash.com/photo-1704900264961-0bef31eada4d?w=800&q=80"],
  "Kids' Denim Overalls": ["https://images.unsplash.com/photo-1765980641678-f28f49092350?w=800&q=80"],
  "Kids' Sporty Hoodie": ["https://images.unsplash.com/photo-1586038693164-cb7ee3fb8e2c?w=800&q=80"],
  "Kids' Printed T-Shirt Set": ["https://images.unsplash.com/photo-1620905385976-9f191e837efd?w=800&q=80"],
  "Kids' Running Shoes": ["https://images.unsplash.com/photo-1571395770221-867c6e2251bc?w=800&q=80"],
  "Kids' Cotton Pajama Set": ["https://images.unsplash.com/photo-1771419912747-df33d91c329d?w=800&q=80"],
  "Kids' Waterproof Raincoat": ["https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80"],
  "Kids' Canvas Backpack": ["https://images.unsplash.com/photo-1768214492195-c1c7f4a8f283?w=800&q=80"],
  "Kids' Summer Cotton Shorts": ["https://images.unsplash.com/photo-1604482858862-1db908a653e4?w=800&q=80"],
  "Kids' Knit Beanie": ["https://images.unsplash.com/photo-1715285091754-c7241fe113fc?w=800&q=80"],
  "Kids' Graphic Sweatshirt": ["https://images.unsplash.com/photo-1529756148791-fbca69bfe693?w=800&q=80"],
};

let modifiedCount = 0;

for (const [productName, images] of Object.entries(imageMap)) {
  const nameIndex = content.indexOf(`name: "${productName}"`);
  if (nameIndex !== -1) {
    const imagesStartIndex = content.indexOf('images: [', nameIndex);
    if (imagesStartIndex !== -1 && imagesStartIndex < nameIndex + 300) {
      const imagesEndIndex = content.indexOf(']', imagesStartIndex);
      if (imagesEndIndex !== -1) {
        const oldImagesLine = content.substring(imagesStartIndex, imagesEndIndex + 1);
        const newImagesLine = `images: [${images.map(img => img.startsWith('/') ? `"${img}"` : `"${img}"`).join(', ')}]`;
        
        content = content.replace(oldImagesLine, newImagesLine);
        console.log(`Replaced images for: ${productName}`);
        modifiedCount++;
      }
    }
  } else {
    console.warn(`Could not find product: ${productName}`);
  }
}

fs.writeFileSync(seedPath, content, 'utf8');
console.log(`Successfully updated ${modifiedCount} products in seed.ts!`);
