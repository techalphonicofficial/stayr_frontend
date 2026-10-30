import prisma from '../config/prisma.js';

const CITIES_DATA = [
  // =========================================================================
  // 1. NEW YORK
  // =========================================================================
  {
    city: "New York",
    state: "NY",
    country: "United States",
    properties: [
      {
        title: "The Billionaires' Row Glass Penthouse",
        locality: "Central Park South, Manhattan",
        address: "220 Central Park South, New York, NY 10019",
        category: "Residential",
        propertyType: "Penthouse",
        price: 320000000, // ₹32 Cr equivalent / $38M
        carpetArea: 5800,
        bedrooms: 4,
        bathrooms: 5,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "0-1 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Metropolitan",
        description: "Perched 80 stories above Manhattan, this trophy penthouse provides unbroken 360-degree vistas across Central Park and the Atlantic horizon. Features 14-foot floor-to-ceiling acoustic glass, private elevator vestibule, custom Boffi kitchen, and white-glove concierge services.",
        amenities: ["Central Park View", "Private Elevator", "Valet Parking", "24/7 Concierge", "Indoor Heated Pool", "Wine Cellar", "Fitness Center"],
        images: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Historic Cobblestone Loft in Tribeca",
        locality: "Tribeca, Lower Manhattan",
        address: "68 Franklin Street, New York, NY 10013",
        category: "Residential",
        propertyType: "Apartment",
        price: 185000000,
        carpetArea: 3950,
        bedrooms: 3,
        bathrooms: 4,
        balconies: 1,
        possessionStatus: "Ready to Move",
        propertyAge: "5-10 Years",
        furnishingStatus: "Semi-Furnished",
        lifestyle: "Historic",
        description: "Authentic pre-war architectural loft boasting original cast-iron columns, exposed timber beams, and 12-foot brick ceiling arches. Recently updated with radiant heated Italian basalt floors and smart home lighting.",
        amenities: ["Exposed Brick", "Private Keyed Elevator", "Fireplace", "High Ceilings", "Smart Home System"],
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Upper East Side Beaux-Arts Limestone Townhouse",
        locality: "Upper East Side, Manhattan",
        address: "14 East 76th Street, New York, NY 10021",
        category: "Residential",
        propertyType: "Villa",
        price: 265000000,
        carpetArea: 7200,
        bedrooms: 6,
        bathrooms: 7,
        balconies: 3,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Unfurnished",
        lifestyle: "Historic",
        description: "A landmark 5-story Beaux-Arts limestone mansion steps from Fifth Avenue and The Met. Featuring grand sweeping mahogany staircases, six carved marble fireplaces, landscaped private rear courtyard, and rooftop sundeck.",
        amenities: ["Private Courtyard", "Rooftop Terrace", "Wine Cellar", "Library", "Multiple Fireplaces"],
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Cast-Iron Corner Penthouse in SoHo",
        locality: "SoHo, Manhattan",
        address: "102 Prince Street, New York, NY 10012",
        category: "Residential",
        propertyType: "Penthouse",
        price: 145000000,
        carpetArea: 3200,
        bedrooms: 3,
        bathrooms: 3,
        balconies: 1,
        possessionStatus: "Under Construction",
        propertyAge: "0-1 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Metropolitan",
        description: "Ultra-prime corner penthouse bathed in southern light. Overlooking the cobblestones of Prince and Greene Streets, with a private 1,100 sq ft wrap-around roof terrace featuring an outdoor kitchen and plunge pool.",
        amenities: ["Rooftop Pool", "Outdoor Kitchen", "Historic Facade", "Doorman", "Storage Unit"],
        images: [
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "West Village Waterfront Duplex Overlooking the Hudson",
        locality: "West Village, Manhattan",
        address: "165 Perry Street, New York, NY 10014",
        category: "Residential",
        propertyType: "Apartment",
        price: 175000000,
        carpetArea: 3800,
        bedrooms: 3,
        bathrooms: 4,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Waterfront",
        description: "Designed by Richard Meier, this modern masterpiece frames sunset river views through floor-to-ceiling glass curtains. Includes private 2-car automated garage and private boat slip access.",
        amenities: ["Hudson River View", "Automated Garage", "Fitness Center", "Doorman", "Balcony"],
        images: [
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Brooklyn Heights Promenade Historic Brownstone",
        locality: "Brooklyn Heights, Brooklyn",
        address: "32 Pierrepont Street, Brooklyn, NY 11201",
        category: "Residential",
        propertyType: "Villa",
        price: 120000000,
        carpetArea: 4800,
        bedrooms: 5,
        bathrooms: 5,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Semi-Furnished",
        lifestyle: "Historic",
        description: "Four stories of timeless Victorian architectural pedigree looking out at Lower Manhattan skyline and New York Harbor. Features south-facing English garden, library with oak wainscoting, and cellar.",
        amenities: ["Private Garden", "Manhattan Skyline View", "Original Mouldings", "Wine Cellar"],
        images: [
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Hudson Yards Tower Sky Suite",
        locality: "Hudson Yards, Manhattan",
        address: "35 Hudson Yards, New York, NY 10001",
        category: "Residential",
        propertyType: "Apartment",
        price: 110000000,
        carpetArea: 2900,
        bedrooms: 3,
        bathrooms: 3,
        balconies: 0,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Metropolitan",
        description: "Soaring high above Manhattan's newest architectural marvel with access to Equinox club, private dining rooms, screening room, and direct elevator access to high-end shopping and dining.",
        amenities: ["Equinox Access", "Sky Lounge", "Valet", "Golf Simulator", "Cinema Room"],
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "DUMBO Waterfront Clocktower Penthouse",
        locality: "DUMBO, Brooklyn",
        address: "1 Main Street, Brooklyn, NY 11201",
        category: "Residential",
        propertyType: "Penthouse",
        price: 195000000,
        carpetArea: 4200,
        bedrooms: 4,
        bathrooms: 4,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "5-10 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Waterfront",
        description: "World-famous triplex penthouse built into the historic mechanical clock tower. Four functioning 14-foot glass clocks offer dramatic panoramic views of Brooklyn Bridge and Manhattan.",
        amenities: ["Iconic Clock Windows", "Private Glass Elevator", "Roof Deck", "Harbor Views"],
        images: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Gramercy Park Keyed Townhouse Residence",
        locality: "Gramercy Park, Manhattan",
        address: "18 Gramercy Park South, New York, NY 10003",
        category: "Residential",
        propertyType: "Apartment",
        price: 135000000,
        carpetArea: 3400,
        bedrooms: 3,
        bathrooms: 3,
        balconies: 1,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Semi-Furnished",
        lifestyle: "Historic",
        description: "Rarely available full-floor residence with a coveted key to private Gramercy Park. Meticulously restored with herringbone white oak floors, Lefroy Brooks fixtures, and marble fireplaces.",
        amenities: ["Key to Gramercy Park", "Full-Floor", "Doorman", "Fireplace", "High Ceilings"],
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Flatiron Sky Terrace Penthouse",
        locality: "Flatiron District, Manhattan",
        address: "212 Fifth Avenue, New York, NY 10010",
        category: "Residential",
        propertyType: "Penthouse",
        price: 160000000,
        carpetArea: 3700,
        bedrooms: 3,
        bathrooms: 4,
        balconies: 2,
        possessionStatus: "Under Construction",
        propertyAge: "0-1 Years",
        furnishingStatus: "Unfurnished",
        lifestyle: "Metropolitan",
        description: "Overlooking Madison Square Park and the Empire State Building, this newly delivered neo-gothic penthouse features 11-foot beamed ceilings and 800 sq ft of private terrace space.",
        amenities: ["Empire State View", "Terrace", "Fitness Center", "Valet", "Screening Room"],
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
        ]
      }
    ]
  },

  // =========================================================================
  // 2. MUMBAI
  // =========================================================================
  {
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    properties: [
      {
        title: "Worli Sea Face Ultra-Luxury Sky Villa",
        locality: "Worli Sea Face, South Mumbai",
        address: "Samudra Mahal, Worli Sea Face, Mumbai, Maharashtra 400018",
        category: "Residential",
        propertyType: "Penthouse",
        price: 680000000, // ₹68 Cr
        carpetArea: 6200,
        bedrooms: 5,
        bathrooms: 6,
        balconies: 3,
        possessionStatus: "Ready to Move",
        propertyAge: "0-1 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Waterfront",
        description: "Panoramic Arabian Sea and Bandra-Worli Sea Link panoramas from every room. Featuring Italian marble flooring, 13-foot high ceilings, private lap pool on the terrace, and 4 stilt car parks.",
        amenities: ["Sea View", "Private Pool", "4 Covered Parks", "Clubhouse", "24/7 Security", "Private Lift"],
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Bandra West Sea-Facing Duplex Penthouse",
        locality: "Carter Road, Bandra West",
        address: "Carter Road Promenade, Bandra West, Mumbai, Maharashtra 400050",
        category: "Residential",
        propertyType: "Penthouse",
        price: 420000000, // ₹42 Cr
        carpetArea: 4400,
        bedrooms: 4,
        bathrooms: 5,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Waterfront",
        description: "In the celebrity haven of Bandra West, overlooking Carter Road promenade and the sunset ocean. High-spec imported kitchen, soundproof triple-glazed windows, private terrace deck.",
        amenities: ["Sea View", "Terrace Garden", "Gymnasium", "Servant Room", "3 Car Parks"],
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Malabar Hill Heritage Luxury Residence",
        locality: "Malabar Hill, South Mumbai",
        address: "Walkeshwar Road, Malabar Hill, Mumbai, Maharashtra 400006",
        category: "Residential",
        propertyType: "Apartment",
        price: 550000000,
        carpetArea: 4800,
        bedrooms: 4,
        bathrooms: 5,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "5-10 Years",
        furnishingStatus: "Semi-Furnished",
        lifestyle: "Metropolitan",
        description: "Prestige address on VIP Malabar Hill with unobstructed views of Queen's Necklace (Marine Drive) and the Arabian Sea. Unmatched privacy, high security zone, and lush greenery.",
        amenities: ["Marine Drive View", "Valet", "Swimming Pool", "Lush Landscaping"],
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Juhu Beachfront Private Villa",
        locality: "Juhu Tara Road, Juhu",
        address: "Juhu Beach Front, Mumbai, Maharashtra 400049",
        category: "Residential",
        propertyType: "Villa",
        price: 850000000,
        carpetArea: 7500,
        bedrooms: 6,
        bathrooms: 7,
        balconies: 4,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Beach",
        description: "Direct beach access villa with private landscaped coconut grove, swimming pool, glass-walled entertainment pavilion, and independent security outpost.",
        amenities: ["Direct Beach Access", "Private Lawn", "Infinity Pool", "Helipad Access nearby", "Home Theater"],
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Lower Parel Sky Palace in One Avighna Park",
        locality: "Lower Parel, Central Mumbai",
        address: "Currey Road, Lower Parel, Mumbai, Maharashtra 400012",
        category: "Residential",
        propertyType: "Apartment",
        price: 280000000,
        carpetArea: 3600,
        bedrooms: 4,
        bathrooms: 4,
        balconies: 2,
        possessionStatus: "Under Construction",
        propertyAge: "0-1 Years",
        furnishingStatus: "Unfurnished",
        lifestyle: "Metropolitan",
        description: "Platinum LEED-certified architectural tower with private plunge pool on the sky deck, German Poggenpohl kitchen, and Olympic-size amenities deck.",
        amenities: ["Sky Deck Plunge Pool", "Clubhouse", "Squash Court", "Spa & Wellness"],
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Altamount Road Billionaires' Haven",
        locality: "Altamount Road, Cumballa Hill",
        address: "Altamount Road, Mumbai, Maharashtra 400026",
        category: "Residential",
        propertyType: "Apartment",
        price: 720000000,
        carpetArea: 5500,
        bedrooms: 5,
        bathrooms: 5,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Metropolitan",
        description: "On India's most expensive residential stretch. One apartment per floor with private biometric elevators, bulletproof glass facade, and round-the-clock armed concierge.",
        amenities: ["Biometric Lift", "Temperature Controlled Pool", "Banquet Hall", "Concierge"],
        images: [
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Pali Hill Serene Green Villa Residence",
        locality: "Pali Hill, Bandra West",
        address: "Nargis Dutt Road, Pali Hill, Mumbai, Maharashtra 400050",
        category: "Residential",
        propertyType: "Villa",
        price: 360000000,
        carpetArea: 4100,
        bedrooms: 4,
        bathrooms: 4,
        balconies: 3,
        possessionStatus: "Ready to Move",
        propertyAge: "5-10 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Country Living",
        description: "A rare leafy sanctuary nestled in quiet Pali Hill. Expansive tree-top views, private garden patio, imported Burmese teak woodwork, and tranquil surroundings.",
        amenities: ["Private Garden", "Covered Parking", "Solar Powered", "Peaceful Enclave"],
        images: [
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Nariman Point Marine Drive Penthouse",
        locality: "Marine Drive, Churchgate",
        address: "Marine Drive Promenade, Mumbai, Maharashtra 400020",
        category: "Residential",
        propertyType: "Penthouse",
        price: 490000000,
        carpetArea: 4000,
        bedrooms: 4,
        bathrooms: 4,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Semi-Furnished",
        lifestyle: "Waterfront",
        description: "Historic Art-Deco facade on the famous Marine Drive curved promenade. Unrivaled views across Back Bay and the sunset skyline.",
        amenities: ["Arabian Sea View", "High Ceilings", "Valet Parking", "Art Deco Heritage"],
        images: [
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Prabhadevi Sea Facing Designer Suite",
        locality: "Prabhadevi, South Mumbai",
        address: "Beaumonde Towers, Prabhadevi, Mumbai, Maharashtra 400025",
        category: "Residential",
        propertyType: "Apartment",
        price: 240000000,
        carpetArea: 3100,
        bedrooms: 3,
        bathrooms: 3,
        balconies: 1,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Waterfront",
        description: "Direct views of the Arabian Sea and Siddhivinayak temple precinct. Fully smart automated by Lutron, Poggenpohl kitchen, and private cinema room.",
        amenities: ["Sea View", "Home Cinema", "Infinity Pool", "Tennis Court"],
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "BKC Modern Business Executive Penthouse",
        locality: "Bandra Kurla Complex (BKC), Mumbai",
        address: "BKC Main Avenue, Mumbai, Maharashtra 400051",
        category: "Commercial",
        propertyType: "Office",
        price: 310000000,
        carpetArea: 5000,
        bedrooms: 0,
        bathrooms: 4,
        balconies: 1,
        possessionStatus: "Ready to Move",
        propertyAge: "0-1 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Metropolitan",
        description: "Grade-A LEED Gold commercial executive penthouse floor overlooking Mumbai's prime financial district. Features private boardroom, terrace lounge, and dedicated fiber trunks.",
        amenities: ["Grade-A Commercial", "High-Speed Elevators", "Boardroom", "Cafeteria", "Power Backup"],
        images: [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
        ]
      }
    ]
  },

  // =========================================================================
  // 3. NOIDA / DELHI NCR
  // =========================================================================
  {
    city: "Noida",
    state: "Uttar Pradesh",
    country: "India",
    properties: [
      {
        title: "ATS Knightsbridge Ultra-Luxury Sky Villa",
        locality: "Sector 124, Noida Expressway",
        address: "ATS Knightsbridge, Sector 124, Noida, Uttar Pradesh 201301",
        category: "Residential",
        propertyType: "Penthouse",
        price: 240000000, // ₹24 Cr
        carpetArea: 6000,
        bedrooms: 5,
        bathrooms: 6,
        balconies: 3,
        possessionStatus: "Ready to Move",
        propertyAge: "0-1 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Metropolitan",
        description: "Noida's most iconic luxury landmark right on the border of South Delhi. One residence per floor with private elevators, 14-foot floor-to-ceiling heights, and 35,000 sq ft clubhouse.",
        amenities: ["One Flat Per Floor", "35000 sq ft Clubhouse", "Olympic Pool", "Concierge", "Golf Simulator"],
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Jaypee Greens Golf Course Championship Villa",
        locality: "Sector 128, Jaypee Greens, Noida",
        address: "Pavilion Court, Jaypee Greens, Sector 128, Noida, Uttar Pradesh 201304",
        category: "Residential",
        propertyType: "Villa",
        price: 185000000, // ₹18.5 Cr
        carpetArea: 5200,
        bedrooms: 5,
        bathrooms: 5,
        balconies: 3,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Golf",
        description: "Direct frontage on the 18-hole Graham Cooke championship golf course. Private swimming pool, landscaped lawn, high vaulted ceilings, and European designer modular fittings.",
        amenities: ["Golf Frontage", "Private Pool", "Landscaped Lawn", "Gated Security", "Clubhouse"],
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Kalpataru Vista Golf Facing 4 BHK Sky Mansion",
        locality: "Sector 128, Noida",
        address: "Kalpataru Vista, Sector 128, Noida, Uttar Pradesh 201304",
        category: "Residential",
        propertyType: "Apartment",
        price: 85000000, // ₹8.5 Cr
        carpetArea: 3200,
        bedrooms: 4,
        bathrooms: 4,
        balconies: 2,
        possessionStatus: "Under Construction",
        propertyAge: "0-1 Years",
        furnishingStatus: "Semi-Furnished",
        lifestyle: "Golf",
        description: "Rising 37 stories over 110 acres of golf course greenery. Features double-height living room balconies, VRV air conditioning, and infinity edge sky pool.",
        amenities: ["Golf View", "Infinity Pool", "VRV Air Conditioning", "Kids Play Zone"],
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Godrej Palm Retreat Resort Residence",
        locality: "Sector 150, Noida",
        address: "Godrej Palm Retreat, Sector 150, Noida, Uttar Pradesh 201310",
        category: "Residential",
        propertyType: "Apartment",
        price: 45000000,
        carpetArea: 2400,
        bedrooms: 3,
        bathrooms: 3,
        balconies: 2,
        possessionStatus: "Under Construction",
        propertyAge: "0-1 Years",
        furnishingStatus: "Unfurnished",
        lifestyle: "Eco-Friendly",
        description: "India's first resort-style residences in greenest Sector 150 with central canal water bodies, floating cabanas, and 80% open greenery.",
        amenities: ["Resort Canal", "Cabanas", "Badminton Court", "Organic Farm"],
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Gulshan Dynasty Luxury Abode",
        locality: "Sector 144, Noida Expressway",
        address: "Gulshan Dynasty, Sector 144, Noida, Uttar Pradesh 201306",
        category: "Residential",
        propertyType: "Apartment",
        price: 72000000,
        carpetArea: 3400,
        bedrooms: 4,
        bathrooms: 4,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "0-1 Years",
        furnishingStatus: "Semi-Furnished",
        lifestyle: "Metropolitan",
        description: "Exclusively limited to 198 families. Features hydro-therapy pools, dedicated private doctors on call, pet care center, and 7-tier contactless security.",
        amenities: ["Hydrotherapy Pool", "Pet Clinic", "Doctor On Call", "Concierge"],
        images: [
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Mahagun Mezzaria Art-Deco Penthouse",
        locality: "Sector 78, Noida",
        address: "Mahagun Mezzaria, Sector 78, Noida, Uttar Pradesh 201301",
        category: "Residential",
        propertyType: "Penthouse",
        price: 58000000,
        carpetArea: 3800,
        bedrooms: 4,
        bathrooms: 5,
        balconies: 3,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Historic",
        description: "Inspired by classical 1920s Art-Deco architecture designed by Hafeez Contractor. Double-height ceilings, private terrace jacuzzi, and grand ballroom.",
        amenities: ["Jacuzzi Terrace", "Art Deco Styling", "Squash Court", "Clubhouse"],
        images: [
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Express Astra Eco-Tower 3 BHK",
        locality: "Sector 1 Greater Noida West",
        address: "Express Astra, Greater Noida West, Uttar Pradesh 201306",
        category: "Residential",
        propertyType: "Apartment",
        price: 19500000,
        carpetArea: 1850,
        bedrooms: 3,
        bathrooms: 3,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "0-1 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Eco-Friendly",
        description: "Contemporary 3 BHK in prime growth node with zero-discharge sewage systems, solar street lamps, and EV charging at every bay.",
        amenities: ["EV Charging", "Solar Power", "Rainwater Harvesting", "Jogging Track"],
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "DLF Mall of India Proximity Commercial Floor",
        locality: "Sector 18, Noida",
        address: "Sector 18 Central Plaza, Noida, Uttar Pradesh 201301",
        category: "Commercial",
        propertyType: "Retail",
        price: 65000000,
        carpetArea: 2200,
        bedrooms: 0,
        bathrooms: 2,
        balconies: 0,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Metropolitan",
        description: "High-yield commercial retail showroom space in the bustling heart of Sector 18. Pre-leased to multinational bank generating stable rental yield.",
        amenities: ["High Footfall", "100% Power Backup", "Dedicated Escalator", "Pre-Leased"],
        images: [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Expressway Lakeview Duplex Villa",
        locality: "Sector 137, Noida",
        address: "Purvanchal Royal Park, Sector 137, Noida, Uttar Pradesh 201305",
        category: "Residential",
        propertyType: "Villa",
        price: 38000000,
        carpetArea: 2900,
        bedrooms: 4,
        bathrooms: 4,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Lakefront",
        description: "Walking distance from Metro station with landscaped internal water bodies, royal amphitheater, and private barbecue terrace.",
        amenities: ["Water Body View", "Metro 2 Min", "Private Barbecue", "Tennis Court"],
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Bhutani Cyberthum Futuristic IT Office Tower",
        locality: "Sector 140A, Noida Expressway",
        address: "Bhutani Cyberthum, Sector 140A, Noida, Uttar Pradesh 201305",
        category: "Commercial",
        propertyType: "Office",
        price: 22000000,
        carpetArea: 1600,
        bedrooms: 0,
        bathrooms: 2,
        balconies: 0,
        possessionStatus: "Under Construction",
        propertyAge: "0-1 Years",
        furnishingStatus: "Unfurnished",
        lifestyle: "Metropolitan",
        description: "North India's tallest commercial tower with sky-walk restaurant, musical fountains, and automated robotic parking.",
        amenities: ["Robotic Parking", "Musical Fountain", "Helipad", "Metro Attached"],
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
        ]
      }
    ]
  },

  // =========================================================================
  // 4. LONDON
  // =========================================================================
  {
    city: "London",
    state: "England",
    country: "United Kingdom",
    properties: [
      {
        title: "Grosvenor Square Grade II Listed Mansion",
        locality: "Mayfair, Central London",
        address: "18 Grosvenor Square, London, W1K 6LD",
        category: "Residential",
        propertyType: "Villa",
        price: 450000000,
        carpetArea: 6500,
        bedrooms: 6,
        bathrooms: 7,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Furnished",
        lifestyle: "Historic",
        description: "A palatial Georgian residence fronting historic Grosvenor Square. Includes private passenger elevator, 12-seat screening cinema, subterranean indoor pool, and private garden.",
        amenities: ["Private Elevator", "Subterranean Pool", "Garden", "Cinema", "Mayfair Address"],
        images: [
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Knightsbridge Hyde Park Penthouse",
        locality: "Knightsbridge, London",
        address: "One Hyde Park, 100 Knightsbridge, London, SW1X 7LJ",
        category: "Residential",
        propertyType: "Penthouse",
        price: 380000000,
        carpetArea: 4800,
        bedrooms: 4,
        bathrooms: 5,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "5-10 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Metropolitan",
        description: "Direct frontage on Hyde Park with private tunnel connection to the Mandarin Oriental Hotel. 24-hour room service, SAS-trained security, and bulletproof glazing.",
        amenities: ["Mandarin Oriental Service", "Hyde Park View", "Bulletproof Glass", "Private Spa"],
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Chelsea Cheyne Walk Riverside Townhouse",
        locality: "Chelsea, London",
        address: "42 Cheyne Walk, Chelsea, London, SW3 5HJ",
        category: "Residential",
        propertyType: "Villa",
        price: 290000000,
        carpetArea: 5100,
        bedrooms: 5,
        bathrooms: 5,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Semi-Furnished",
        lifestyle: "Waterfront",
        description: "Overlooking the River Thames and Albert Bridge. Features private landscaped walled courtyard, high corniced ceilings, and wine cellar.",
        amenities: ["Thames River View", "Walled Garden", "Wine Cellar", "Original Fireplaces"],
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Kensington Palace Gardens Diplomatic Manor",
        locality: "Kensington, London",
        address: "Kensington Palace Gardens, London, W8 4QG",
        category: "Residential",
        propertyType: "Villa",
        price: 620000000,
        carpetArea: 8900,
        bedrooms: 7,
        bathrooms: 8,
        balconies: 3,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Furnished",
        lifestyle: "Historic",
        description: "Situated on Billionaires' Row, London's most secure and exclusive private avenue. Ambassadorial scale ballrooms, half-acre private gardens, and heated driveway.",
        amenities: ["Private Avenue Security", "Half-Acre Garden", "Ballroom", "Staff Quarters"],
        images: [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Notting Hill Pastel Victorian Villa",
        locality: "Notting Hill, London",
        address: "Pembridge Square, Notting Hill, London, W2 4ED",
        category: "Residential",
        propertyType: "Villa",
        price: 180000000,
        carpetArea: 3800,
        bedrooms: 4,
        bathrooms: 4,
        balconies: 1,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Furnished",
        lifestyle: "Historic",
        description: "Stucco-fronted Victorian villa with direct access to communal gated gardens. Contemporary minimalist interior renovation with bespoke Bulthaup kitchen.",
        amenities: ["Communal Garden Access", "Bulthaup Kitchen", "Wine Room", "High Ceilings"],
        images: [
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Battersea Power Station Waterfront Sky Villa",
        locality: "Battersea, London",
        address: "Circus Road West, Battersea, London, SW11 8AL",
        category: "Residential",
        propertyType: "Apartment",
        price: 140000000,
        carpetArea: 2900,
        bedrooms: 3,
        bathrooms: 3,
        balconies: 1,
        possessionStatus: "Under Construction",
        propertyAge: "0-1 Years",
        furnishingStatus: "Unfurnished",
        lifestyle: "Waterfront",
        description: "Frank Gehry-designed sky apartment within the restored Battersea landmark. Floor-to-ceiling glass curves with views across the river to Westminster.",
        amenities: ["River Views", "Concierge", "Residents Lounge", "Gym & Spa"],
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Belgravia Mews House with Private Garage",
        locality: "Belgravia, London",
        address: "Eaton Mews South, Belgravia, London, SW1W 9HR",
        category: "Residential",
        propertyType: "Villa",
        price: 210000000,
        carpetArea: 3400,
        bedrooms: 3,
        bathrooms: 4,
        balconies: 1,
        possessionStatus: "Ready to Move",
        propertyAge: "5-10 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Historic",
        description: "Quiet cobblestone mews house in prime Belgravia. Automated integral garage, cinema room, glass wine display wall, and rooftop terrace.",
        amenities: ["Private Garage", "Roof Terrace", "Quiet Mews", "Wine Room"],
        images: [
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Marylebone High Street Modern Duplex",
        locality: "Marylebone, London",
        address: "Chiltern Street, Marylebone, London, W1U 7QE",
        category: "Residential",
        propertyType: "Apartment",
        price: 125000000,
        carpetArea: 2600,
        bedrooms: 3,
        bathrooms: 3,
        balconies: 1,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Metropolitan",
        description: "Steps from the famous Chiltern Firehouse, this modern duplex pairs heritage brick facade with Scandinavian architectural minimalism.",
        amenities: ["Boutique Building", "Underfloor Heating", "Balcony", "Storage"],
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Hampstead Heath Forest Edge Country House",
        locality: "Hampstead, North London",
        address: "The Bishops Avenue, Hampstead, London, N2 0BE",
        category: "Residential",
        propertyType: "Villa",
        price: 340000000,
        carpetArea: 7100,
        bedrooms: 6,
        bathrooms: 7,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Country Living",
        description: "Private countryside estate living within 20 minutes of Central London. Half-acre private woods, indoor pool, spa complex, and 4-car garage.",
        amenities: ["Private Woodland", "Indoor Pool", "Sauna & Steam", "4-Car Garage"],
        images: [
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Canary Wharf Sky Penthouse",
        locality: "Canary Wharf, East London",
        address: "One Park Drive, Canary Wharf, London, E14 9GG",
        category: "Residential",
        propertyType: "Penthouse",
        price: 115000000,
        carpetArea: 2800,
        bedrooms: 3,
        bathrooms: 3,
        balconies: 2,
        possessionStatus: "Under Construction",
        propertyAge: "0-1 Years",
        furnishingStatus: "Unfurnished",
        lifestyle: "Metropolitan",
        description: "Designed by Herzog & de Meuron. Circular geometric layout with panoramic docks and city views, 24/7 concierge, and health club.",
        amenities: ["Herzog & de Meuron Design", "Dock Views", "Health Club", "Concierge"],
        images: [
          "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80"
        ]
      }
    ]
  },

  // =========================================================================
  // 5. DUBAI
  // =========================================================================
  {
    city: "Dubai",
    state: "Dubai",
    country: "United Arab Emirates",
    properties: [
      {
        title: "Palm Jumeirah Signature Frond Beachfront Villa",
        locality: "Frond G, Palm Jumeirah",
        address: "Frond G, Palm Jumeirah, Dubai, UAE",
        category: "Residential",
        propertyType: "Villa",
        price: 480000000,
        carpetArea: 7800,
        bedrooms: 6,
        bathrooms: 7,
        balconies: 3,
        possessionStatus: "Ready to Move",
        propertyAge: "0-1 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Beach",
        description: "Direct private beach on the Palm with crystal clear turquoise water. Custom European architecture, marble infinity pool, rooftop terrace facing Dubai Marina skyline.",
        amenities: ["Private Beach", "Infinity Pool", "Marina Skyline View", "Smart Home", "Staff Quarters"],
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Downtown Dubai Burj Khalifa Sky Mansion",
        locality: "Downtown Dubai",
        address: "Burj Crown, Downtown Dubai, UAE",
        category: "Residential",
        propertyType: "Penthouse",
        price: 340000000,
        carpetArea: 5200,
        bedrooms: 4,
        bathrooms: 5,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Metropolitan",
        description: "Front-row panoramic views of the Burj Khalifa and Dubai Fountain. Full-floor layout with Italian marble, private elevator lobby, and 24/7 five-star hotel services.",
        amenities: ["Burj Khalifa View", "Fountain View", "Hotel Concierge", "Valet Parking"],
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Emirates Hills Golf Course Championship Manor",
        locality: "Sector E, Emirates Hills",
        address: "Montgomerie Golf Course, Emirates Hills, Dubai, UAE",
        category: "Residential",
        propertyType: "Villa",
        price: 520000000,
        carpetArea: 9500,
        bedrooms: 7,
        bathrooms: 8,
        balconies: 4,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Golf",
        description: "In Dubai's Beverly Hills. Direct fairway frontage on Montgomerie Golf Course, 10-car basement garage, private bowling alley, and landscaped resort grounds.",
        amenities: ["Golf Frontage", "10-Car Garage", "Bowling Alley", "Private Cinema", "Resort Pool"],
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "One Palm by Omniyat Beachfront Penthouse",
        locality: "Palm Jumeirah",
        address: "One Palm, Palm Jumeirah, Dubai, UAE",
        category: "Residential",
        propertyType: "Penthouse",
        price: 410000000,
        carpetArea: 6100,
        bedrooms: 4,
        bathrooms: 5,
        balconies: 3,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Waterfront",
        description: "Managed by Dorchester Collection. Private 100-foot beachfront, infinity pool, 12-seat private dining room, and private yacht jetty access.",
        amenities: ["Dorchester Collection Management", "Private Jetty", "Private Beach", "Spa"],
        images: [
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Dubai Hills Estate Fairway View Villa",
        locality: "Dubai Hills Estate",
        address: "Dubai Hills Fairways, Dubai, UAE",
        category: "Residential",
        propertyType: "Villa",
        price: 260000000,
        carpetArea: 5400,
        bedrooms: 5,
        bathrooms: 6,
        balconies: 2,
        possessionStatus: "Under Construction",
        propertyAge: "0-1 Years",
        furnishingStatus: "Unfurnished",
        lifestyle: "Golf",
        description: "Brand-new contemporary villa in the green heart of Dubai. Floor-to-ceiling glass, private landscaped swimming pool, and parkland access.",
        amenities: ["Golf View", "Private Pool", "Dubai Hills Mall Proximity", "Park"],
        images: [
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Jumeirah Bay Island Sea Mansion",
        locality: "Jumeirah Bay Island (Bulgari Island)",
        address: "Jumeirah Bay Island, Dubai, UAE",
        category: "Residential",
        propertyType: "Villa",
        price: 650000000,
        carpetArea: 8200,
        bedrooms: 6,
        bathrooms: 7,
        balconies: 3,
        possessionStatus: "Ready to Move",
        propertyAge: "0-1 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Private Island",
        description: "On the seahorse-shaped island hosting the world-famous Bulgari Resort & Marina. Ultra-private, private yacht marina berth, and sunset Arabian Sea views.",
        amenities: ["Private Island", "Bulgari Marina Berth", "Private Beach", "Helipad Access"],
        images: [
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Al Barari Botanical Oasis Villa",
        locality: "Al Barari, Dubai",
        address: "Desert Leaf, Al Barari, Dubai, UAE",
        category: "Residential",
        propertyType: "Villa",
        price: 220000000,
        carpetArea: 6800,
        bedrooms: 5,
        bathrooms: 6,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Eco-Friendly",
        description: "Surrounded by 60% green botanical gardens, freshwater streams, and Mediterranean plant nurseries. The greenest luxury address in the Emirates.",
        amenities: ["Botanical Garden View", "Freshwater Stream", "Private Pool", "Spa & Wellness"],
        images: [
          "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Bluewaters Island Ain Dubai View Duplex",
        locality: "Bluewaters Island",
        address: "Bluewaters Residences, Dubai, UAE",
        category: "Residential",
        propertyType: "Apartment",
        price: 175000000,
        carpetArea: 3500,
        bedrooms: 3,
        bathrooms: 4,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Waterfront",
        description: "Overlooking the world's largest observation wheel (Ain Dubai) and open sea. Direct bridge access to JBR and private beach club access.",
        amenities: ["Ain Dubai View", "Beach Club Access", "Infinity Pool", "Retail Strip"],
        images: [
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Dubai Marina High-Floor Panoramic Penthouse",
        locality: "Dubai Marina",
        address: "Marina Gate Tower, Dubai Marina, UAE",
        category: "Residential",
        propertyType: "Penthouse",
        price: 190000000,
        carpetArea: 4100,
        bedrooms: 4,
        bathrooms: 5,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Waterfront",
        description: "High above the yachts and shimmering waters of Dubai Marina. Features floor-to-ceiling glass, private jacuzzi deck, and direct marina promenade access.",
        amenities: ["Marina View", "Jacuzzi", "Infinity Pool", "Direct Promenade Access"],
        images: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Mohammed Bin Rashid City Crystal Lagoon Villa",
        locality: "District One, MBR City",
        address: "District One, MBR City, Dubai, UAE",
        category: "Residential",
        propertyType: "Villa",
        price: 295000000,
        carpetArea: 6000,
        bedrooms: 5,
        bathrooms: 6,
        balconies: 3,
        possessionStatus: "Under Construction",
        propertyAge: "0-1 Years",
        furnishingStatus: "Unfurnished",
        lifestyle: "Waterfront",
        description: "Contemporary villa facing the world's largest man-made crystal blue lagoon. Private beach access, 8.4 km cycling track, and 7 minutes from Downtown.",
        amenities: ["Crystal Lagoon Access", "Private Beach", "Cycling Track", "Smart Home"],
        images: [
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80"
        ]
      }
    ]
  },

  // =========================================================================
  // 6. PARIS
  // =========================================================================
  {
    city: "Paris",
    state: "Île-de-France",
    country: "France",
    properties: [
      {
        title: "Avenue Montaigne Golden Triangle Haussmannian Penthouse",
        locality: "8th Arrondissement, Golden Triangle",
        address: "Avenue Montaigne, 75008 Paris, France",
        category: "Residential",
        propertyType: "Penthouse",
        price: 360000000,
        carpetArea: 4200,
        bedrooms: 4,
        bathrooms: 5,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Furnished",
        lifestyle: "Historic",
        description: "In the pinnacle of Parisian haute couture. Views of the Eiffel Tower, 11-foot gilded corniced ceilings, herringbone Versailles parquet, and private elevator.",
        amenities: ["Eiffel Tower View", "Versailles Parquet", "Private Elevator", "Concierge", "Balcony"],
        images: [
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Saint-Germain-des-Prés 17th Century Hôtel Particulier",
        locality: "6th Arrondissement, Saint-Germain",
        address: "Rue de Grenelle, 75006 Paris, France",
        category: "Residential",
        propertyType: "Villa",
        price: 440000000,
        carpetArea: 5800,
        bedrooms: 5,
        bathrooms: 6,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Furnished",
        lifestyle: "Historic",
        description: "A private cobblestone courtyard opens to this historic nobleman's town residence. Features 300-year-old painted beam ceilings, wine cellar, and private cobblestone garden.",
        amenities: ["Private Courtyard Garden", "Historic Beams", "Wine Cellar", "Quiet Enclave"],
        images: [
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Île Saint-Louis Seine Riverfront Residence",
        locality: "4th Arrondissement, Île Saint-Louis",
        address: "Quai d'Anjou, 75004 Paris, France",
        category: "Residential",
        propertyType: "Apartment",
        price: 280000000,
        carpetArea: 3100,
        bedrooms: 3,
        bathrooms: 3,
        balconies: 1,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Semi-Furnished",
        lifestyle: "Waterfront",
        description: "Direct frontage on the River Seine with views of Notre-Dame Cathedral. Meticulously restored with antique limestone fireplaces and wrought iron balconies.",
        amenities: ["Seine Riverfront", "Notre Dame View", "Period Fireplace", "Wine Vault"],
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Place des Vosges Heritage Arcaded Duplex",
        locality: "Le Marais, 4th Arrondissement",
        address: "Place des Vosges, 75004 Paris, France",
        category: "Residential",
        propertyType: "Apartment",
        price: 310000000,
        carpetArea: 3600,
        bedrooms: 3,
        bathrooms: 4,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Furnished",
        lifestyle: "Historic",
        description: "Located on Paris's oldest planned royal square. Red-brick and stone pavilion architecture, 14-foot ceilings, and direct views of the fountains.",
        amenities: ["Place des Vosges View", "Grand Volumes", "Private Wine Cellar", "Concierge"],
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "16th Arrondissement Trocadéro Private Mansion",
        locality: "16th Arrondissement, Passy",
        address: "Avenue Georges Mandel, 75116 Paris, France",
        category: "Residential",
        propertyType: "Villa",
        price: 390000000,
        carpetArea: 6200,
        bedrooms: 6,
        bathrooms: 6,
        balconies: 3,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Semi-Furnished",
        lifestyle: "Metropolitan",
        description: "Freestanding private mansion surrounded by private landscaped gardens. Grand ballroom, indoor swimming pool, private 4-car garage, and rooftop terrace.",
        amenities: ["Private Garden", "Indoor Pool", "4-Car Garage", "Rooftop Terrace"],
        images: [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Champs-Élysées Haussmannian Grand Flat",
        locality: "8th Arrondissement",
        address: "Rue François 1er, 75008 Paris, France",
        category: "Residential",
        propertyType: "Apartment",
        price: 220000000,
        carpetArea: 2900,
        bedrooms: 3,
        bathrooms: 3,
        balconies: 1,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Furnished",
        lifestyle: "Metropolitan",
        description: "Elegant bourgeois apartment with continuous balcony, marble fireplaces in every room, and custom wine tasting room.",
        amenities: ["Haussmannian Balcony", "Wine Tasting Room", "Concierge", "High Ceilings"],
        images: [
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Montmartre Artist Villa with Panoramic City Views",
        locality: "18th Arrondissement, Montmartre",
        address: "Rue Cortot, 75018 Paris, France",
        category: "Residential",
        propertyType: "Villa",
        price: 165000000,
        carpetArea: 3200,
        bedrooms: 4,
        bathrooms: 3,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Furnished",
        lifestyle: "Country Living",
        description: "Secluded private house atop the Montmartre hill. Surrounded by private vineyard vines, skylit artist studio, and sweeping views of Paris monuments.",
        amenities: ["Panoramic Paris View", "Private Vineyard Garden", "Skylit Studio"],
        images: [
          "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Left Bank Boulevard Saint-Germain Duplex",
        locality: "7th Arrondissement, Invalides",
        address: "Boulevard Saint-Germain, 75007 Paris, France",
        category: "Residential",
        propertyType: "Apartment",
        price: 250000000,
        carpetArea: 3400,
        bedrooms: 3,
        bathrooms: 4,
        balconies: 1,
        possessionStatus: "Ready to Move",
        propertyAge: "5-10 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Metropolitan",
        description: "Close to the National Assembly. Features private landscaped terrace, Bulthaup kitchen, sound system by Devialet, and secure parking.",
        amenities: ["Private Terrace", "Bulthaup Kitchen", "Underground Parking", "Concierge"],
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Parc Monceau Private Gate Residence",
        locality: "17th Arrondissement, Plaine Monceau",
        address: "Avenue Van Dyck, 75008 Paris, France",
        category: "Residential",
        propertyType: "Apartment",
        price: 195000000,
        carpetArea: 2800,
        bedrooms: 3,
        bathrooms: 3,
        balconies: 1,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Semi-Furnished",
        lifestyle: "Historic",
        description: "Direct gate into Parc Monceau. Features classical wood boiserie, grand reception room, and quiet residential neighborhood.",
        amenities: ["Direct Park Access", "Boiserie Woodwork", "High Ceilings", "Wine Cellar"],
        images: [
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Neuilly-sur-Seine Bois de Boulogne Mansion",
        locality: "Neuilly-sur-Seine",
        address: "Boulevard Richard Wallace, 92200 Neuilly-sur-Seine",
        category: "Residential",
        propertyType: "Villa",
        price: 320000000,
        carpetArea: 5500,
        bedrooms: 5,
        bathrooms: 6,
        balconies: 2,
        possessionStatus: "Under Construction",
        propertyAge: "0-1 Years",
        furnishingStatus: "Unfurnished",
        lifestyle: "Country Living",
        description: "Facing the Bois de Boulogne forest. Private heated pool, landscaped French formal gardens, and 3-car basement garage.",
        amenities: ["Forest View", "French Formal Garden", "Heated Pool", "3-Car Garage"],
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
        ]
      }
    ]
  },

  // =========================================================================
  // 7. LOS ANGELES
  // =========================================================================
  {
    city: "Los Angeles",
    state: "CA",
    country: "United States",
    properties: [
      {
        title: "Beverly Hills Gated Contemporary Compound",
        locality: "Beverly Hills Flats, CA",
        address: "610 North Beverly Drive, Beverly Hills, CA 90210",
        category: "Residential",
        propertyType: "Villa",
        price: 350000000,
        carpetArea: 8500,
        bedrooms: 6,
        bathrooms: 8,
        balconies: 3,
        possessionStatus: "Ready to Move",
        propertyAge: "0-1 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Metropolitan",
        description: "A triumph of architectural minimalism in the flats of Beverly Hills. Features a 75-foot zero-edge pool, private tennis court, 1,000-bottle wine cellar, and 6-car gallery garage.",
        amenities: ["Tennis Court", "Zero-Edge Pool", "6-Car Garage", "Gated Security", "Wine Cellar"],
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Malibu Carbon Beach Oceanfront Haven",
        locality: "Carbon Beach, Malibu, CA",
        address: "22108 Pacific Coast Highway, Malibu, CA 90265",
        category: "Residential",
        propertyType: "Villa",
        price: 420000000,
        carpetArea: 6200,
        bedrooms: 5,
        bathrooms: 6,
        balconies: 3,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Beach",
        description: "On Billionaires' Beach in Malibu. Direct access to sandy shore, massive oceanfront teak deck, outdoor fireplace, and floor-to-ceiling retractable glass walls.",
        amenities: ["Direct Beach Access", "Oceanfront Deck", "Hot Tub", "Gated Entry"],
        images: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Bel Air Promontory Panorama Estate",
        locality: "Bel Air, Los Angeles, CA",
        address: "10771 Bellagio Road, Bel Air, Los Angeles, CA 90077",
        category: "Residential",
        propertyType: "Villa",
        price: 390000000,
        carpetArea: 9200,
        bedrooms: 7,
        bathrooms: 9,
        balconies: 4,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Metropolitan",
        description: "Occupying its own private ridge in East Gate Bel Air. Jetliner views from Downtown LA to the Pacific Ocean, private bowling alley, infinity pool, and guard house.",
        amenities: ["Jetliner Views", "Infinity Pool", "Guard House", "Bowling Alley", "Spa"],
        images: [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Hollywood Hills Bird Streets Architectural",
        locality: "Bird Streets, West Hollywood, CA",
        address: "1420 Blue Jay Way, Los Angeles, CA 90069",
        category: "Residential",
        propertyType: "Villa",
        price: 240000000,
        carpetArea: 5100,
        bedrooms: 4,
        bathrooms: 5,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Metropolitan",
        description: "Perched high in the famous Bird Streets. Cantilevered infinity pool overlooking the Sunset Strip and city lights, polished concrete and warm teak finishes.",
        amenities: ["City Views", "Cantilevered Pool", "Smart Home", "Motor Court"],
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Pacific Palisades Ocean Bluff Manor",
        locality: "The Huntington, Pacific Palisades, CA",
        address: "14924 Corona Del Mar, Pacific Palisades, CA 90272",
        category: "Residential",
        propertyType: "Villa",
        price: 280000000,
        carpetArea: 6800,
        bedrooms: 5,
        bathrooms: 7,
        balconies: 3,
        possessionStatus: "Ready to Move",
        propertyAge: "0-1 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Waterfront",
        description: "Coastal modern residence on the bluff overlooking Santa Monica Bay and mountain canyons. Features custom wine room, gym, sauna, and pool pavilion.",
        amenities: ["Ocean Bluff View", "Pool Pavilion", "Gym & Sauna", "Outdoor Kitchen"],
        images: [
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Brentwood Park Sprawling Farmhouse Estate",
        locality: "Brentwood Park, Los Angeles, CA",
        address: "245 South Rockingham Avenue, Los Angeles, CA 90049",
        category: "Residential",
        propertyType: "Villa",
        price: 260000000,
        carpetArea: 7600,
        bedrooms: 6,
        bathrooms: 8,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Country Living",
        description: "A modern East Coast traditional in serene Brentwood Park. Features expansive rolling lawn, mature sycamore trees, detached guest house, and screening room.",
        amenities: ["Guest House", "Screening Room", "Large Lawn", "Pool & Spa"],
        images: [
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Venice Beach Architectural Canal House",
        locality: "Venice Canals, Venice, CA",
        address: "216 Grand Canal, Venice, CA 90291",
        category: "Residential",
        propertyType: "Villa",
        price: 130000000,
        carpetArea: 3200,
        bedrooms: 3,
        bathrooms: 4,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "5-10 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Waterfront",
        description: "Front-row waterfront home on Venice's historic canals. Private boat dock for electric duffy boat, rooftop lounge facing the sunset, and interior Japanese courtyard.",
        amenities: ["Private Canal Dock", "Rooftop Lounge", "Japanese Courtyard", "Walk to Beach"],
        images: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Holmby Hills Historic Celebrity Compound",
        locality: "Holmby Hills, Los Angeles, CA",
        address: "320 North Carolwood Drive, Los Angeles, CA 90077",
        category: "Residential",
        propertyType: "Villa",
        price: 490000000,
        carpetArea: 10500,
        bedrooms: 8,
        bathrooms: 11,
        balconies: 4,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Furnished",
        lifestyle: "Historic",
        description: "Grand French neoclassical estate on 2 acres of manicured gardens. Includes championship tennis court, Olympic pool, separate guest villas, and recording studio.",
        amenities: ["2-Acre Grounds", "Tennis Court", "Recording Studio", "Olympic Pool"],
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Sunset Plaza Modern Sky Villa",
        locality: "Sunset Plaza, West Hollywood, CA",
        address: "1820 Sunset Plaza Drive, Los Angeles, CA 90069",
        category: "Residential",
        propertyType: "Villa",
        price: 175000000,
        carpetArea: 4200,
        bedrooms: 4,
        bathrooms: 5,
        balconies: 2,
        possessionStatus: "Under Construction",
        propertyAge: "0-1 Years",
        furnishingStatus: "Unfurnished",
        lifestyle: "Metropolitan",
        description: "Architectural cantilevered glass home rising above the Sunset Strip. Private rooftop observatory deck and automated sliding glass pocket doors.",
        amenities: ["Rooftop Observatory", "Smart Home", "Pool & Spa", "Panoramic Views"],
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Malibu Point Dume Gated Estate",
        locality: "Point Dume, Malibu, CA",
        address: "28800 Cliffside Drive, Malibu, CA 90265",
        category: "Residential",
        propertyType: "Villa",
        price: 380000000,
        carpetArea: 6500,
        bedrooms: 5,
        bathrooms: 6,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Beach",
        description: "Deeded private beach key to Little Dume beach. 1.2 acres of tropical fruit groves, resort swimming pool, and ocean views.",
        amenities: ["Little Dume Beach Key", "1.2 Acres", "Fruit Grove", "Pool"],
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
        ]
      }
    ]
  },

  // =========================================================================
  // 8. THE HAMPTONS
  // =========================================================================
  {
    city: "The Hamptons",
    state: "NY",
    country: "United States",
    properties: [
      {
        title: "Southampton Meadow Lane Oceanfront Compound",
        locality: "Meadow Lane, Southampton, NY",
        address: "1320 Meadow Lane, Southampton, NY 11968",
        category: "Residential",
        propertyType: "Villa",
        price: 540000000,
        carpetArea: 9200,
        bedrooms: 8,
        bathrooms: 9,
        balconies: 4,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Beach",
        description: "On Southampton's coveted Meadow Lane, spanning Atlantic Ocean frontage and Shinnecock Bay water access. Includes sunken all-weather tennis court and private dune walkway.",
        amenities: ["Direct Ocean Frontage", "Bay Access", "Tennis Court", "Private Dunes", "Heated Gunite Pool"],
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "East Hampton Further Lane Shingle Style Manor",
        locality: "Further Lane, East Hampton, NY",
        address: "95 Further Lane, East Hampton, NY 11937",
        category: "Residential",
        propertyType: "Villa",
        price: 380000000,
        carpetArea: 8100,
        bedrooms: 7,
        bathrooms: 8,
        balconies: 3,
        possessionStatus: "Ready to Move",
        propertyAge: "5-10 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Historic",
        description: "Classic cedar shingle estate set on 3 private manicured acres. 60-foot heated gunite swimming pool, pool house, tennis pavilion, and mature specimen trees.",
        amenities: ["3-Acre Grounds", "60ft Pool", "Pool House", "Tennis Court", "Cedar Shingle"],
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Sag Harbor Historic Waterfront Harbor Estate",
        locality: "Sag Harbor, NY",
        address: "48 Glover Street, Sag Harbor, NY 11963",
        category: "Residential",
        propertyType: "Villa",
        price: 240000000,
        carpetArea: 4800,
        bedrooms: 5,
        bathrooms: 5,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Furnished",
        lifestyle: "Waterfront",
        description: "19th century sea captain's manor with deep-water private dock on Sag Harbor cove. Walk to historic village dining and yacht marina.",
        amenities: ["Deep Water Dock", "Harbor Views", "Walk to Village", "Heated Pool"],
        images: [
          "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Bridgehampton South Agricultural Reserve Estate",
        locality: "Bridgehampton, NY",
        address: "Ocean Road, Bridgehampton, NY 11932",
        category: "Residential",
        propertyType: "Villa",
        price: 290000000,
        carpetArea: 7200,
        bedrooms: 6,
        bathrooms: 7,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Farm & Ranch",
        description: "Surrounded by conserved open farmland and equestrian horse pastures south of the highway. Walk to ocean beaches.",
        amenities: ["Farmland Views", "South of Highway", "Pool & Spa", "Equestrian Nearby"],
        images: [
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Montauk Ocean Bluff Modern Sanctuary",
        locality: "Montauk, NY",
        address: "Old Montauk Highway, Montauk, NY 11954",
        category: "Residential",
        propertyType: "Villa",
        price: 220000000,
        carpetArea: 4600,
        bedrooms: 4,
        bathrooms: 5,
        balconies: 3,
        possessionStatus: "Ready to Move",
        propertyAge: "0-1 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Beach",
        description: "Dramatic cliffside residence overlooking Ditch Plains surfing break. Board-formed concrete, warm cedar, and private trail to sandy beach.",
        amenities: ["Ocean Bluff View", "Private Beach Trail", "Infinity Pool", "Surf Storage"],
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Water Mill Lakefront Modern Shingle Estate",
        locality: "Water Mill, NY",
        address: "Mill Pond Road, Water Mill, NY 11976",
        category: "Residential",
        propertyType: "Villa",
        price: 210000000,
        carpetArea: 6400,
        bedrooms: 6,
        bathrooms: 6,
        balconies: 2,
        possessionStatus: "Under Construction",
        propertyAge: "0-1 Years",
        furnishingStatus: "Unfurnished",
        lifestyle: "Lakefront",
        description: "Fronting serene Mill Pond with private kayak dock. Modern interpretation of classic Hamptons shingle style with smart home climate integration.",
        amenities: ["Pond Frontage", "Kayak Dock", "Smart Home", "Gunite Pool"],
        images: [
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Wainscott Farmstead Private Enclave",
        locality: "Wainscott, NY",
        address: "Wainscott Hollow Road, Wainscott, NY 11975",
        category: "Residential",
        propertyType: "Villa",
        price: 195000000,
        carpetArea: 5800,
        bedrooms: 5,
        bathrooms: 6,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Farm & Ranch",
        description: "Gated and private adjacent to centuries-old apple orchards. Custom barn garage with studio above and outdoor stone pizza oven patio.",
        amenities: ["Apple Orchard Setting", "Barn Garage", "Outdoor Kitchen", "Pool"],
        images: [
          "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Amagansett Dunes Walk-to-Beach Villa",
        locality: "Amagansett Dunes, NY",
        address: "Marine Boulevard, Amagansett, NY 11930",
        category: "Residential",
        propertyType: "Villa",
        price: 180000000,
        carpetArea: 3800,
        bedrooms: 4,
        bathrooms: 4,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "5-10 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Beach",
        description: "Steps over the dune to Atlantic Beach. Outdoor surf shower, cedar sun deck, and relaxed coastal lifestyle.",
        amenities: ["Walk to Beach", "Outdoor Shower", "Sun Deck", "Quiet Lane"],
        images: [
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Shelter Island Waterfront Dock Estate",
        locality: "Shelter Island, NY",
        address: "Ram Island Drive, Shelter Island, NY 11964",
        category: "Residential",
        propertyType: "Villa",
        price: 165000000,
        carpetArea: 5200,
        bedrooms: 5,
        bathrooms: 5,
        balconies: 2,
        possessionStatus: "Ready to Move",
        propertyAge: "1-5 Years",
        furnishingStatus: "Furnished",
        lifestyle: "Waterfront",
        description: "Private island seclusion with deep-water boat dock capable of accommodating a 60-foot yacht. Wrap-around waterside porches.",
        amenities: ["Deep Water Boat Dock", "Island Seclusion", "Porch", "Water Views"],
        images: [
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        title: "Quogue Historic Village Waterfront Home",
        locality: "Quogue, NY",
        address: "Quogue Street, Quogue, NY 11959",
        category: "Residential",
        propertyType: "Villa",
        price: 145000000,
        carpetArea: 4400,
        bedrooms: 5,
        bathrooms: 5,
        balconies: 1,
        possessionStatus: "Ready to Move",
        propertyAge: "10+ Years",
        furnishingStatus: "Semi-Furnished",
        lifestyle: "Historic",
        description: "Peaceful western Hamptons village charm. Historic shingle facade with bulkhead water frontage and easy commuting distance from Manhattan.",
        amenities: ["Bulkhead Frontage", "Historic Charm", "Pool", "Manicured Grounds"],
        images: [
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80"
        ]
      }
    ]
  }
];

const SELLER_IDS = [
  'fa4a3a64-5087-40f6-81b1-33db24d997f6', // Rohan Verma
  '10e5680b-96cf-486d-bcc6-760bca9578b9', // Raj Singh
  'b0383604-c50c-4b04-9e2c-bfbb01b686d7', // Host User
  '851f2c8f-b1a8-4cc7-967c-7f7bdf798125', // Sanjay Sighania
];

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

async function seedRealEstateMarketplace() {
  console.log('--- Starting Luxury Real Estate Seeding ---');

  let totalAdded = 0;

  for (const group of CITIES_DATA) {
    console.log(`Processing ${group.city} (${group.properties.length} properties)...`);

    for (let i = 0; i < group.properties.length; i++) {
      const p = group.properties[i];
      const sellerId = SELLER_IDS[i % SELLER_IDS.length];
      const baseSlug = `${slugify(p.title)}-${slugify(group.city)}`;
      const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

      // Check if title already exists to prevent duplicate runs
      const existing = await prisma.saleListing.findFirst({
        where: { title: p.title }
      });

      if (existing) {
        // Update images or ensure published
        await prisma.saleListing.update({
          where: { id: existing.id },
          data: {
            status: 'Published',
            isApproved: true,
            isVerified: true
          }
        });
        continue;
      }

      const created = await prisma.saleListing.create({
        data: {
          sellerId,
          title: p.title,
          slug,
          description: p.description,
          category: p.category || 'Residential',
          propertyType: p.propertyType,
          status: 'Published',
          isApproved: true,
          isVerified: true,
          price: p.price,
          priceNegotiable: true,
          possessionStatus: p.possessionStatus,
          area: p.carpetArea,
          areaUnit: 'sq ft',
          carpetArea: p.carpetArea,
          superBuiltUpArea: Math.round(p.carpetArea * 1.25),
          bedrooms: p.bedrooms,
          bhk: p.bedrooms ? `${p.bedrooms} BHK` : null,
          bathrooms: p.bathrooms,
          balconies: p.balconies,
          furnishingStatus: p.furnishingStatus,
          propertyAge: p.propertyAge,
          address: p.address,
          locality: p.locality,
          city: group.city,
          state: group.state,
          country: group.country,
          postalCode: '10001',
          featuredImage: p.images[0],
          amenities: p.amenities,
          images: {
            create: p.images.map((url, sortOrder) => ({
              url,
              sortOrder,
              isPrimary: sortOrder === 0
            }))
          }
        }
      });

      totalAdded++;
    }
  }

  console.log(`--- Finished Seeding! Added ${totalAdded} New Properties ---`);
}

seedRealEstateMarketplace()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

