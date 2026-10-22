import { PrismaClient, UserRole, UserStatus, ArtisanStatus, ProductStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Kaarigar AI database seeding...');

  // 1. Seed Categories & Craft Clusters
  const categoriesData = [
    {
      name: 'Pottery & Ceramics',
      slug: 'pottery-ceramics',
      description: 'Traditional earthen pottery, Jaipur blue pottery, and terracotta from master potters across India.',
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Metal & Brassware',
      slug: 'metal-brassware',
      description: 'Lost-wax Dhokra bronze casting, Moradabad brass etching, and traditional metal craft.',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Traditional Handlooms & Textiles',
      slug: 'handlooms-textiles',
      description: 'Authentic Banarasi brocades, Chanderi silks, Phulkari embroidery, and Kalamkari hand-painted cotton.',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Folk & Tribal Art',
      slug: 'folk-tribal-art',
      description: 'Madhubani paintings, Warli tribal art, Pattachitra scrolls, and Gond storytelling art.',
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Woodwork & Carvings',
      slug: 'woodwork-carvings',
      description: 'Saharanpur sheesham wood carvings, Channapatna lacquered wooden toys, and walnut wood craft.',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const createdCategories = [];
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories.push(category);
  }
  console.log(`✅ Seeded ${createdCategories.length} craft categories.`);

  // 2. Seed Super Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@kaarigar.ai' },
    update: {},
    create: {
      email: 'admin@kaarigar.ai',
      name: 'Kaarigar Admin',
      phone: '+919999900000',
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      identities: {
        create: {
          provider: 'FIREBASE_GOOGLE',
          providerUid: 'firebase_admin_super_001',
          rawProfile: { email: 'admin@kaarigar.ai', name: 'Kaarigar Admin' },
        },
      },
    },
  });
  console.log(`✅ Seeded Super Admin user: ${adminUser.email}`);

  // 3. Seed Verified Master Artisan
  const potteryCat = createdCategories.find((c) => c.slug === 'pottery-ceramics');
  const artisanUser = await prisma.user.upsert({
    where: { email: 'ramesh.potter@kaarigar.ai' },
    update: {},
    create: {
      email: 'ramesh.potter@kaarigar.ai',
      name: 'Ramesh Kumar Prajapati',
      phone: '+919876543210',
      role: UserRole.ARTISAN,
      status: UserStatus.ACTIVE,
      identities: {
        create: {
          provider: 'FIREBASE_GOOGLE',
          providerUid: 'firebase_artisan_ramesh_002',
          rawProfile: { email: 'ramesh.potter@kaarigar.ai', name: 'Ramesh Kumar Prajapati' },
        },
      },
      artisanProfile: {
        create: {
          businessName: 'Prajapati Blue Clay Studio',
          craftTitle: 'Master Ceramic & Blue Pottery Artisan',
          story: 'Carrying forward 4 generations of traditional quartz & copper oxide glazing in Kot Jewar, Rajasthan.',
          clusterRegion: 'Kot Jewar, Jaipur, Rajasthan',
          giTagNumber: 'GI-0082',
          status: ArtisanStatus.VERIFIED,
          verificationNotes: 'GI registry and National Handicraft Award verified.',
          idDocumentType: 'ARTISAN_CARD',
          idDocumentNumber: 'HA-RAJ-2018-9941',
          payoutBankDetails: {
            bankName: 'State Bank of India',
            accountNumber: '987654321000',
            ifscCode: 'SBIN0001234',
            accountHolderName: 'Ramesh Kumar Prajapati',
          },
        },
      },
    },
    include: { artisanProfile: true },
  });
  console.log(`✅ Seeded Verified Artisan: ${artisanUser.name}`);

  // 4. Seed Verified Products with Variants & Concurrency-Safe Inventory
  if (artisanUser.artisanProfile && potteryCat) {
    const product = await prisma.product.upsert({
      where: { slug: 'jaipur-blue-pottery-floral-vase-10in' },
      update: {},
      create: {
        artisanId: artisanUser.artisanProfile.id,
        categoryId: potteryCat.id,
        title: 'Handcrafted Jaipur Blue Pottery Floral Motif Vase (10")',
        slug: 'jaipur-blue-pottery-floral-vase-10in',
        description: 'Authentic quartz-based traditional vase fired using Egyptian paste technique. Hand-painted with natural cobalt oxide and copper sulphate dyes.',
        craftTechnique: 'Blue Pottery Slip Casting and Hand Glazing',
        story: 'Handcrafted by Master Artisan Ramesh in Kot Jewar village. Unlike clay pottery, Jaipur blue pottery uses quartz powder, gum, and natural minerals without clay.',
        clusterRegion: 'Jaipur, Rajasthan',
        giTagNumber: 'GI-0082',
        basePriceMinor: 185000, // ₹1,850.00
        currency: 'INR',
        status: ProductStatus.PUBLISHED,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
              altText: 'Jaipur Blue Pottery Floral Vase front view',
              isPrimary: true,
              sortOrder: 0,
            },
            {
              url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
              altText: 'Close up of hand-painted cobalt glaze',
              isPrimary: false,
              sortOrder: 1,
            },
          ],
        },
        variants: {
          create: [
            {
              sku: 'JBP-VASE-10-COBALT',
              title: '10 Inch - Traditional Cobalt Blue',
              priceMinor: 185000,
              attributes: { height: '10 inches', color: 'Cobalt Blue', weight: '850 grams' },
              inventory: {
                create: {
                  quantity: 8,
                  reservedQuantity: 0,
                  version: 1,
                },
              },
            },
            {
              sku: 'JBP-VASE-10-TURQUOISE',
              title: '10 Inch - Persian Turquoise',
              priceMinor: 195000,
              attributes: { height: '10 inches', color: 'Persian Turquoise', weight: '850 grams' },
              inventory: {
                create: {
                  quantity: 5,
                  reservedQuantity: 0,
                  version: 1,
                },
              },
            },
          ],
        },
      },
    });
    console.log(`✅ Seeded Product with Variants & Inventory: ${product.title}`);
  }

  // 5. Seed Sample Customer User with Address
  const customerUser = await prisma.user.upsert({
    where: { email: 'priya.customer@kaarigar.ai' },
    update: {},
    create: {
      email: 'priya.customer@kaarigar.ai',
      name: 'Priya Sharma',
      phone: '+919811122233',
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      identities: {
        create: {
          provider: 'FIREBASE_GOOGLE',
          providerUid: 'firebase_customer_priya_003',
          rawProfile: { email: 'priya.customer@kaarigar.ai', name: 'Priya Sharma' },
        },
      },
      addresses: {
        create: {
          fullName: 'Priya Sharma',
          phone: '+919811122233',
          streetAddress: 'Flat 402, Lotus Greens, Indirapuram',
          city: 'Ghaziabad',
          state: 'Uttar Pradesh',
          postalCode: '201014',
          country: 'IN',
          isDefault: true,
        },
      },
      cart: {
        create: {},
      },
      wishlist: {
        create: {},
      },
    },
  });
  console.log(`✅ Seeded Sample Customer: ${customerUser.name}`);

  console.log('✨ Kaarigar AI seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
