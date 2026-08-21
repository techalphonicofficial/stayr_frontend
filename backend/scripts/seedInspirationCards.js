import prisma from '../config/prisma.js';

async function main() {
  console.log('Seeding Inspiration Cards...');

  // Clear existing to avoid duplicates
  await prisma.inspirationCard.deleteMany({});

  const cards = [
    {
      tag: "Last-minute weekend",
      title: "Book a last-minute vacation rental for a hill station getaway.",
      image: "https://loremflickr.com/800/600/himalayas",
      link: "/s/himachal/homes",
      btnText: "Book now",
      sortOrder: 1,
    },
    {
      tag: "Save on beach stays",
      title: "Last-minute private pool villas for group getaways in Goa.",
      image: "https://loremflickr.com/800/600/goa,beach",
      link: "/s/goa/homes",
      btnText: "Book now",
      sortOrder: 2,
    },
    {
      tag: "Royal Escapes",
      title: "Hot travel destinations to inspire your next royal Rajasthan trip.",
      image: "https://loremflickr.com/800/600/rajasthan,palace",
      link: "/s/rajasthan/homes",
      btnText: "Find out more",
      sortOrder: 3,
    },
    {
      tag: "Nature Retreat",
      title: "Disconnect in lush green treehouses nestled deep in the forest.",
      image: "https://loremflickr.com/800/600/treehouse,forest",
      link: "/s/kerala/homes",
      btnText: "Explore stays",
      sortOrder: 4,
    },
    {
      tag: "Urban Luxe",
      title: "High-rise luxury apartments with skyline views for your city break.",
      image: "https://loremflickr.com/800/600/skyline,apartment",
      link: "/s/mumbai/homes",
      btnText: "View apartments",
      sortOrder: 5,
    },
    {
      tag: "Desert Safari",
      title: "Experience the magic of desert camping under the starry sky.",
      image: "https://loremflickr.com/800/600/desert,camp",
      link: "/s/jaisalmer/homes",
      btnText: "Plan safari",
      sortOrder: 6,
    },
    {
      tag: "Winter Wonderland",
      title: "Cozy up by the fireplace in snow-covered cabins.",
      image: "https://loremflickr.com/800/600/snow,cabin",
      link: "/s/kashmir/homes",
      btnText: "Book a cabin",
      sortOrder: 7,
    },
    {
      tag: "Riverside Peace",
      title: "Wake up to the gentle sounds of river streams in Rishikesh.",
      image: "https://loremflickr.com/800/600/river,resort",
      link: "/s/rishikesh/homes",
      btnText: "Find peace",
      sortOrder: 8,
    },
    {
      tag: "Romantic Getaway",
      title: "Secluded boutique stays perfect for couples and honeymooners.",
      image: "https://loremflickr.com/800/600/romantic,bedroom",
      link: "/s/udaipur/homes",
      btnText: "See romantic stays",
      sortOrder: 9,
    },
    {
      tag: "Adventure Basecamp",
      title: "Basecamps and homestays near the best trekking routes.",
      image: "https://loremflickr.com/800/600/trekking,mountain",
      link: "/s/manali/homes",
      btnText: "Start adventure",
      sortOrder: 10,
    },
    {
      tag: "Tea Estate Charm",
      title: "Colonial bungalows surrounded by sprawling tea gardens.",
      image: "https://loremflickr.com/800/600/teagarden,bungalow",
      link: "/s/darjeeling/homes",
      btnText: "Sip & stay",
      sortOrder: 11,
    },
    {
      tag: "Family Fun",
      title: "Spacious family villas with games, pools, and private chefs.",
      image: "https://loremflickr.com/800/600/family,villa",
      link: "/s/lonavala/homes",
      btnText: "Book for family",
      sortOrder: 12,
    },
    {
      tag: "Island Life",
      title: "Crystal clear waters and private beach huts in the Andamans.",
      image: "https://loremflickr.com/800/600/island,beach",
      link: "/s/andaman/homes",
      btnText: "Escape to islands",
      sortOrder: 13,
    },
    {
      tag: "Heritage Homestay",
      title: "Live with locals and experience authentic culture in traditional homes.",
      image: "https://loremflickr.com/800/600/heritage,house",
      link: "/s/mysore/homes",
      btnText: "Experience culture",
      sortOrder: 14,
    },
    {
      tag: "Wellness Retreat",
      title: "Rejuvenate with yoga, meditation, and organic food stays.",
      image: "https://loremflickr.com/800/600/yoga,retreat",
      link: "/s/rishikesh/homes",
      btnText: "Find wellness",
      sortOrder: 15,
    },
    {
      tag: "Glamping Experience",
      title: "Glamorous camping with luxury amenities in the wilderness.",
      image: "https://loremflickr.com/800/600/glamping,tent",
      link: "/s/coorg/homes",
      btnText: "Go glamping",
      sortOrder: 16,
    }
  ];

  for (const card of cards) {
    await prisma.inspirationCard.create({
      data: card
    });
  }

  console.log(`Successfully seeded ${cards.length} Inspiration Cards!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
