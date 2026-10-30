import prisma from '../config/prisma.js';

async function seedSaleProperties() {
  console.log('Seeding Real Estate Sale Listings...');

  // Find or create a seller
  let seller = await prisma.user.findFirst({
    where: { role: 'Host' }
  });

  if (!seller) {
    seller = await prisma.user.findFirst();
  }

  if (!seller) {
    console.error('No users found in database to assign as seller.');
    process.exit(1);
  }

  console.log(`Using seller: ${seller.name} (${seller.email}, id: ${seller.id})`);

  // Check if we already have sale listings
  const existingCount = await prisma.saleListing.count();
  if (existingCount >= 6) {
    console.log(`Already have ${existingCount} sale listings. Skipping seed.`);
    process.exit(0);
  }

  const sampleProperties = [
    {
      title: 'Ultra Luxury 4 BHK Penthouse with Golf Course View',
      slug: 'ultra-luxury-4-bhk-penthouse-golf-course-view-noida-sec128',
      description: 'Experience unparalleled opulence in Sector 128, Noida. This sky-mansion penthouse offers panoramic 270-degree views of the lush 18-hole championship golf course. Features bespoke Italian marble flooring, 12-ft high ceilings, private plunge pool on the terrace, and smart home automation by Lutron.',
      category: 'Residential',
      propertyType: 'Penthouse',
      ownershipType: 'Freehold',
      sellerType: 'Owner',
      price: 58500000, // ₹5.85 Cr
      priceNegotiable: true,
      carpetArea: 3800,
      builtUpArea: 4500,
      superBuiltUpArea: 4950,
      area: 4500,
      areaUnit: 'sq ft',
      bedrooms: 4,
      bhk: '4 BHK',
      bathrooms: 5,
      balconies: 4,
      floor: 28,
      totalFloors: 30,
      facingDirection: 'North-East',
      furnishingStatus: 'Semi-Furnished',
      possessionStatus: 'Ready to Move',
      propertyAge: '0-1 Year',
      parking: '2 Covered Slots',
      amenities: ['Private Pool', 'Gym', 'Clubhouse', 'Golf View', '24/7 Security', 'Power Backup', 'Covered Parking', 'EV Charging', 'Concierge', 'High Speed Elevators'],
      address: 'Tower A, Sky Terraces, Sector 128, Expressway',
      locality: 'Sector 128',
      city: 'Noida',
      state: 'Uttar Pradesh',
      postalCode: '201304',
      latitude: 28.5175,
      longitude: 77.3789,
      reraNumber: 'UPRERAAGT12984',
      status: 'Published',
      isVerified: true,
      isApproved: true,
      sellerId: seller.id,
      featuredImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      title: 'Modern 3 BHK High-Rise Apartment in Sector 150',
      slug: 'modern-3-bhk-high-rise-apartment-sector-150-noida',
      description: 'Nestled in Noida\'s greenest sector, this corner 3 BHK apartment boasts natural ventilation, double-glazed soundproof windows, modular German kitchen, and high-end wooden flooring in the master suite. Within 5 mins from Noida-Greater Noida Expressway.',
      category: 'Residential',
      propertyType: 'Apartment',
      ownershipType: 'Freehold',
      sellerType: 'Owner',
      price: 19500000, // ₹1.95 Cr
      priceNegotiable: true,
      carpetArea: 1650,
      builtUpArea: 2000,
      superBuiltUpArea: 2150,
      area: 2000,
      areaUnit: 'sq ft',
      bedrooms: 3,
      bhk: '3 BHK',
      bathrooms: 3,
      balconies: 3,
      floor: 14,
      totalFloors: 24,
      facingDirection: 'East',
      furnishingStatus: 'Unfurnished',
      possessionStatus: 'Ready to Move',
      propertyAge: '1-3 Years',
      parking: '1 Covered Slot',
      amenities: ['Swimming Pool', 'Tennis Court', 'Clubhouse', 'Gym', 'Kids Play Area', 'Visitor Parking', 'CCTV Surveillance', 'Rainwater Harvesting'],
      address: 'Tower 4, Green Boulevard, Sector 150',
      locality: 'Sector 150',
      city: 'Noida',
      state: 'Uttar Pradesh',
      postalCode: '201310',
      latitude: 28.4359,
      longitude: 77.4819,
      reraNumber: 'UPRERAAGT88210',
      status: 'Published',
      isVerified: true,
      isApproved: true,
      sellerId: seller.id,
      featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      title: 'Independent Luxury Designer Villa with Private Lawn',
      slug: 'independent-luxury-designer-villa-private-lawn-gurgaon-golf-course-ext',
      description: 'Gated estate villa located on Golf Course Extension Road. Designed by award-winning architects featuring double-height ceiling living hall, private landscaped lawn, servant quarter, basement home theatre, and parking for 4 vehicles.',
      category: 'Residential',
      propertyType: 'Independent Villa',
      ownershipType: 'Freehold',
      sellerType: 'Agent',
      price: 87500000, // ₹8.75 Cr
      priceNegotiable: false,
      carpetArea: 4200,
      builtUpArea: 5000,
      plotArea: 350,
      area: 5000,
      areaUnit: 'sq ft',
      bedrooms: 5,
      bhk: '5 BHK',
      bathrooms: 6,
      balconies: 5,
      floor: 1,
      totalFloors: 3,
      facingDirection: 'North',
      furnishingStatus: 'Furnished',
      possessionStatus: 'Ready to Move',
      propertyAge: '0-1 Year',
      parking: '4 Covered Slots',
      amenities: ['Private Garden', 'Home Theatre', 'Solar Panels', 'Servant Quarters', 'Gated Community', 'Swimming Pool', 'Security Guard', 'Italian Marble'],
      address: 'Villa 12, The Palm Villas, Sector 65',
      locality: 'Golf Course Extension Road',
      city: 'Gurgaon',
      state: 'Haryana',
      postalCode: '122018',
      latitude: 28.3981,
      longitude: 77.0673,
      reraNumber: 'HARERAGGM44192',
      status: 'Published',
      isVerified: true,
      isApproved: true,
      sellerId: seller.id,
      featuredImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      title: 'Prime Grade-A Commercial Office Space in Cyber City',
      slug: 'prime-grade-a-commercial-office-space-cyber-city-gurgaon',
      description: 'Fully furnished, high-yield commercial IT/ITes office unit in DLF Cyber City. Currently leased to an MNC tenant delivering 8.4% gross rental yield. 45 workstations, 3 executive cabins, boardroom, server room, and cafeteria.',
      category: 'Commercial',
      propertyType: 'Office Space',
      ownershipType: 'Leasehold',
      sellerType: 'Builder',
      price: 42000000, // ₹4.20 Cr
      priceNegotiable: true,
      carpetArea: 2500,
      builtUpArea: 3000,
      area: 3000,
      areaUnit: 'sq ft',
      floor: 9,
      totalFloors: 16,
      facingDirection: 'North-East',
      furnishingStatus: 'Furnished',
      possessionStatus: 'Ready to Move',
      propertyAge: '3-5 Years',
      parking: '3 Reserved Slots',
      amenities: ['Central Air Conditioning', 'High Speed Internet', 'Cafeteria', 'Conference Room', 'Grade A Building', '24/7 Access', 'Basement Parking', 'Power Backup'],
      address: 'Block B, DLF Cyber City, Sector 24',
      locality: 'Cyber City',
      city: 'Gurgaon',
      state: 'Haryana',
      postalCode: '122002',
      latitude: 28.4950,
      longitude: 77.0895,
      reraNumber: 'HARERAGGM10928',
      status: 'Published',
      isVerified: true,
      isApproved: true,
      sellerId: seller.id,
      featuredImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      title: 'High-Street Retail Shop in Prime Commercial Hub',
      slug: 'high-street-retail-shop-commercial-hub-sector-18-noida',
      description: 'Ground floor lockable retail shop in Sector 18 Noida (the commercial capital of Noida). Massive footfall, excellent visibility, opposite Atta Market & Metro Station. Ideal for luxury brand showroom, café, or electronics flagship.',
      category: 'Commercial',
      propertyType: 'Shop / Showroom',
      ownershipType: 'Freehold',
      sellerType: 'Owner',
      price: 28000000, // ₹2.80 Cr
      priceNegotiable: false,
      carpetArea: 650,
      builtUpArea: 800,
      area: 800,
      areaUnit: 'sq ft',
      floor: 0,
      totalFloors: 4,
      facingDirection: 'East',
      furnishingStatus: 'Unfurnished',
      possessionStatus: 'Ready to Move',
      propertyAge: '5-10 Years',
      parking: 'Common Parking',
      amenities: ['Ground Floor Access', 'High Footfall', 'Wide Frontage', '24/7 Security', 'Common Parking', 'Fire Fighting System'],
      address: 'Shop 14, Commercial Complex, Sector 18',
      locality: 'Sector 18',
      city: 'Noida',
      state: 'Uttar Pradesh',
      postalCode: '201301',
      latitude: 28.5708,
      longitude: 77.3261,
      reraNumber: 'UPRERARET39201',
      status: 'Published',
      isVerified: true,
      isApproved: true,
      sellerId: seller.id,
      featuredImage: 'https://images.unsplash.com/photo-1567449303183-ae0d6ed1498e?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1567449303183-ae0d6ed1498e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      title: 'Sea-Facing 3 BHK Premium Apartment in Bandra West',
      slug: 'sea-facing-3-bhk-premium-apartment-bandra-west-mumbai',
      description: 'Panoramic Arabian Sea views from your living room. Located on Carter Road, Bandra West. Premium fixtures, designer master bathroom with jacuzzi, private elevator access, and reserved stilt parking.',
      category: 'Residential',
      propertyType: 'Apartment',
      ownershipType: 'Co-operative Society',
      sellerType: 'Owner',
      price: 95000000, // ₹9.50 Cr
      priceNegotiable: true,
      carpetArea: 1800,
      builtUpArea: 2000,
      area: 2000,
      areaUnit: 'sq ft',
      bedrooms: 3,
      bhk: '3 BHK',
      bathrooms: 3,
      balconies: 2,
      floor: 11,
      totalFloors: 14,
      facingDirection: 'West',
      furnishingStatus: 'Furnished',
      possessionStatus: 'Ready to Move',
      propertyAge: '1-3 Years',
      parking: '2 Stilt Slots',
      amenities: ['Sea View', 'Private Lift', 'Infinity Pool', 'Gym', 'Automated Parking', '24/7 Concierge', 'Security Guard'],
      address: 'Ocean Crest, Carter Road, Bandra West',
      locality: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      latitude: 19.0607,
      longitude: 72.8258,
      reraNumber: 'P51800029381',
      status: 'Published',
      isVerified: true,
      isApproved: true,
      sellerId: seller.id,
      featuredImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      title: 'Scenic 4 BHK Gated Community Villa in Whitefield',
      slug: 'scenic-4-bhk-gated-community-villa-whitefield-bangalore',
      description: 'Exclusive Spanish-style villa inside a 20-acre gated enclave in Whitefield, Bangalore. Private garden, solar water heating, high ceilings, large open-plan kitchen, and clubhouse access.',
      category: 'Residential',
      propertyType: 'Independent Villa',
      ownershipType: 'Freehold',
      sellerType: 'Owner',
      price: 42500000, // ₹4.25 Cr
      priceNegotiable: true,
      carpetArea: 3200,
      builtUpArea: 3600,
      plotArea: 280,
      area: 3600,
      areaUnit: 'sq ft',
      bedrooms: 4,
      bhk: '4 BHK',
      bathrooms: 4,
      balconies: 3,
      floor: 1,
      totalFloors: 2,
      facingDirection: 'East',
      furnishingStatus: 'Semi-Furnished',
      possessionStatus: 'Ready to Move',
      propertyAge: '0-1 Year',
      parking: '2 Covered Slots',
      amenities: ['Clubhouse', 'Swimming Pool', 'Private Garden', 'Tennis Court', 'Squash Court', '24/7 Security', 'Borewell & Cauvery Water'],
      address: 'Villa 44, Palm Meadows, Whitefield',
      locality: 'Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560066',
      latitude: 12.9698,
      longitude: 77.7500,
      reraNumber: 'PRM/KA/RERA/1251/446/PR/180516/001740',
      status: 'Published',
      isVerified: true,
      isApproved: true,
      sellerId: seller.id,
      featuredImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      title: 'Affordable 2 BHK High-Rise Apartment near Metro Station',
      slug: 'affordable-2-bhk-high-rise-apartment-near-metro-sector-76-noida',
      description: 'Ideal starter home or investment asset in Sector 76, Noida. 500 meters from Sector 76 Metro Station. Well ventilated, low maintenance society, equipped with piped gas and power backup.',
      category: 'Residential',
      propertyType: 'Apartment',
      ownershipType: 'Freehold',
      sellerType: 'Owner',
      price: 7800000, // ₹78 Lakh
      priceNegotiable: true,
      carpetArea: 850,
      builtUpArea: 1080,
      area: 1080,
      areaUnit: 'sq ft',
      bedrooms: 2,
      bhk: '2 BHK',
      bathrooms: 2,
      balconies: 2,
      floor: 7,
      totalFloors: 18,
      facingDirection: 'North-East',
      furnishingStatus: 'Semi-Furnished',
      possessionStatus: 'Ready to Move',
      propertyAge: '3-5 Years',
      parking: '1 Covered Slot',
      amenities: ['Power Backup', 'Lift', 'Kids Play Area', 'Covered Parking', 'Gated Security', 'Piped Gas'],
      address: 'Flat 702, Tower C, Amrapali Silicon City, Sector 76',
      locality: 'Sector 76',
      city: 'Noida',
      state: 'Uttar Pradesh',
      postalCode: '201301',
      latitude: 28.5750,
      longitude: 77.3820,
      reraNumber: 'UPRERAPROJ8371',
      status: 'Published',
      isVerified: true,
      isApproved: true,
      sellerId: seller.id,
      featuredImage: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
      ]
    }
  ];

  for (const item of sampleProperties) {
    const { images, ...data } = item;
    const created = await prisma.saleListing.create({
      data: {
        ...data,
        images: {
          create: images.map((url, idx) => ({
            url,
            isPrimary: idx === 0,
            sortOrder: idx,
            caption: idx === 0 ? 'Front View' : `Interior View ${idx}`
          }))
        }
      }
    });
    console.log(`Created sale listing: "${created.title}" [₹${(created.price / 100000).toFixed(1)} L] in ${created.city}`);
  }

  console.log('Seeding completed successfully!');
  process.exit(0);
}

seedSaleProperties().catch((e) => {
  console.error('Error seeding sale listings:', e);
  process.exit(1);
});
