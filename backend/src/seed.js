import { pool, initializeDatabase } from './db.js';

const sampleHotels = [
  {
    title: 'The Grand Heritage Palace',
    description: 'A luxurious 5-star palace hotel offering royal hospitality, manicured courtyards, lavish royal suites, infinity pool, and world-class multi-cuisine fine dining.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    altText: 'Exterior of The Grand Heritage Palace featuring traditional grand architecture and pool',
    city: 'Jaipur, Rajasthan',
    rating: 4.8,
    reviewsCount: 342,
    price: 240,
    originalPrice: 310,
    latitude: 26.9124,
    longitude: 75.7873,
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Free Breakfast', 'Airport Shuttle'],
    featured: true,
  },
  {
    title: 'Ocean Breeze Beach Resort',
    description: 'Direct beachfront resort nestled along golden sands with private cabanas, sunset cocktail lounges, coastal seafood restaurants, and thrilling water sport amenities.',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80',
    altText: 'Ocean Breeze Beach Resort with sun loungers overlooking the turquoise ocean',
    city: 'Candolim, Goa',
    rating: 4.6,
    reviewsCount: 219,
    price: 185,
    originalPrice: 220,
    latitude: 15.5186,
    longitude: 73.7634,
    amenities: ['Beachfront', 'Infinity Pool', 'Cocktail Bar', 'Free WiFi', 'Fitness Center'],
    featured: true,
  },
  {
    title: 'Skyline Metropolis Business Hotel',
    description: 'Sophisticated corporate haven located in the central business district featuring high-speed optical fiber, executive boardrooms, rooftop terrace bar, and panoramic skyline vistas.',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
    altText: 'Modern facade of Skyline Metropolis Business Hotel in urban financial district',
    city: 'Bengaluru, Karnataka',
    rating: 4.5,
    reviewsCount: 480,
    price: 145,
    originalPrice: 175,
    latitude: 12.9716,
    longitude: 77.5946,
    amenities: ['Business Center', 'Free WiFi', 'Meeting Rooms', 'Gym', 'Valet Parking'],
    featured: false,
  },
  {
    title: 'Himalayan Serenity Mountain Lodge',
    description: 'Charming alpine retreat with panoramic cedar forest views, heated indoor stone fireplace suites, curated mountain hiking expeditions, and locally-sourced organic cuisine.',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80',
    altText: 'Wooden mountain lodge with breathtaking views of the snow-capped Himalayan peaks',
    city: 'Manali, Himachal Pradesh',
    rating: 4.9,
    reviewsCount: 156,
    price: 210,
    originalPrice: 260,
    latitude: 32.2396,
    longitude: 77.1887,
    amenities: ['Mountain View', 'Fireplace', 'Free Breakfast', 'Free WiFi', 'Trekking Desk'],
    featured: true,
  },
  {
    title: 'Azure Bay Marine Suites',
    description: 'Modern luxury suites overlooking the Arabian Sea promenade. Features floor-to-ceiling glass balconies, 24/7 concierge, private yacht charters, and an award-winning rooftop steakhouse.',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
    altText: 'Luxury suite at Azure Bay Marine Suites overlooking the seaside marina',
    city: 'Marine Drive, Mumbai',
    rating: 4.7,
    reviewsCount: 310,
    price: 320,
    originalPrice: 390,
    latitude: 18.9438,
    longitude: 72.8234,
    amenities: ['Sea View', 'Rooftop Bar', 'Spa & Wellness', 'Valet Parking', 'Concierge Service'],
    featured: true,
  },
  {
    title: 'Emerald Valley Tea Estate Bungalow',
    description: 'Restored colonial tea plantation bungalow surrounded by rolling mist-covered hills. Indulge in private tea tastings, birdwatching strolls, and tranquil veranda afternoons.',
    imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=80',
    altText: 'Colonial style bungalow nestled in lush green tea estates',
    city: 'Munnar, Kerala',
    rating: 4.8,
    reviewsCount: 184,
    price: 160,
    originalPrice: 195,
    latitude: 10.0889,
    longitude: 77.0595,
    amenities: ['Tea Garden View', 'Free Breakfast', 'Nature Trails', 'Free WiFi', 'Library'],
    featured: false,
  },
  {
    title: 'The Urban Loft Boutique Hotel',
    description: 'Chic industrial-aesthetic boutique hotel featuring exposed brickwork, contemporary indie art galleries, specialty artisan coffee roasters, and lively nightlife access.',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    altText: 'Stylish modern boutique hotel room interior with warm lighting and brick accent wall',
    city: 'Hauz Khas, New Delhi',
    rating: 4.4,
    reviewsCount: 265,
    price: 110,
    originalPrice: 140,
    latitude: 28.5494,
    longitude: 77.2001,
    amenities: ['Coffee Bar', 'Free WiFi', 'Art Gallery', 'Pet Friendly', 'Laundry Service'],
    featured: false,
  },
  {
    title: 'Lakeview Royal Pavilion',
    description: 'Majestic lakeside sanctuary with marble pillars, romantic shikara boat rides, candlelit overwater dinners, traditional folk performances, and rejuvenating Ayurvedic spas.',
    imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=80',
    altText: 'Lakeview Royal Pavilion illuminated at twilight reflecting on the tranquil lake',
    city: 'Udaipur, Rajasthan',
    rating: 4.9,
    reviewsCount: 412,
    price: 295,
    originalPrice: 350,
    latitude: 24.5764,
    longitude: 73.6835,
    amenities: ['Lake View', 'Boat Transfers', 'Ayurvedic Spa', 'Swimming Pool', 'Fine Dining'],
    featured: true,
  },
  {
    title: 'Palm Grove Eco Oasis',
    description: 'Sustainable tropical eco-resort built with natural bamboo and stone. Features rainwater-fed bio-pools, solar-powered private villas, organic farm-to-table dining, and daily yoga.',
    imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80',
    altText: 'Peaceful eco villa with open-air lounge surrounded by lush palm trees',
    city: 'Kovalam, Kerala',
    rating: 4.6,
    reviewsCount: 198,
    price: 130,
    originalPrice: 165,
    latitude: 8.4004,
    longitude: 76.9787,
    amenities: ['Eco-Friendly', 'Yoga Deck', 'Organic Dining', 'Free Breakfast', 'Free WiFi'],
    featured: false,
  },
  {
    title: 'Golden Dunes Desert Camp & Spa',
    description: 'Authentic luxury tented camp nestled deep inside the golden Thar dunes. Complete with star-gazing astronomical decks, camel desert safaris, and campfire musical soirees.',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    altText: 'Luxury desert camp pavilion glowing warmly amidst soft sand dunes under dusk sky',
    city: 'Sam Sand Dunes, Jaisalmer',
    rating: 4.7,
    reviewsCount: 225,
    price: 175,
    originalPrice: 215,
    latitude: 26.8333,
    longitude: 70.5167,
    amenities: ['Desert Safari', 'Campfire & Music', 'Star Gazing', 'Free Breakfast', 'Free WiFi'],
    featured: false,
  }
];

export async function seedDatabase(force = false) {
  await initializeDatabase();

  const countResult = await pool.query('SELECT COUNT(*)::int AS count FROM hotels');
  const count = countResult.rows[0].count;

  // If force or table has broken rows or is empty
  if (force || count === 0) {
    console.log(`Seeding database with ${sampleHotels.length} dummy hotel records...`);
    if (force) {
      await pool.query('TRUNCATE TABLE hotels RESTART IDENTITY');
    }

    for (const h of sampleHotels) {
      await pool.query(
        `INSERT INTO hotels (
          title, description, city, image_url, alt_text,
          latitude, longitude, price, rating, reviews_count,
          original_price, amenities, featured
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [
          h.title,
          h.description,
          h.city,
          h.imageUrl,
          h.altText,
          h.latitude,
          h.longitude,
          h.price,
          h.rating,
          h.reviewsCount,
          h.originalPrice,
          JSON.stringify(h.amenities),
          h.featured,
        ]
      );
    }
    console.log('✅ PostgreSQL database seeded successfully with dummy hotels!');
  } else {
    // If table already has rows with broken blob: URLs, repair them
    const brokenResult = await pool.query("SELECT COUNT(*)::int AS count FROM hotels WHERE image_url LIKE 'blob:%'");
    const brokenCount = brokenResult.rows[0].count;
    if (brokenCount > 0) {
      console.log(`Found ${brokenCount} hotels with broken blob: URLs. Repairing with valid images...`);
      for (let i = 0; i < sampleHotels.length; i++) {
        const fallback = sampleHotels[i % sampleHotels.length];
        await pool.query(
          `UPDATE hotels SET image_url = $1, alt_text = $2 WHERE id IN (
            SELECT id FROM hotels WHERE image_url LIKE 'blob:%' LIMIT 1
          )`,
          [fallback.imageUrl, fallback.altText]
        );
      }
      console.log('✅ Repaired broken hotel image URLs in PostgreSQL!');
    } else {
      console.log(`Database already contains ${count} hotels.`);
    }
  }
}

// When run directly from CLI: node src/seed.js [--force]
if (process.argv[1]?.endsWith('seed.js')) {
  const force = process.argv.includes('--force');
  seedDatabase(force)
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('❌ Failed to seed database:', err);
      await pool.end();
      process.exit(1);
    });
}
