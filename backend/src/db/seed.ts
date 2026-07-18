import pool from "./pool"

const categories = [
  { name: "Beach", icon: "🏖️" },
  { name: "Adventure", icon: "🏔️" },
  { name: "Culture", icon: "🎭" },
  { name: "Food", icon: "🍜" },
  { name: "Shopping", icon: "🛍️" },
  { name: "History", icon: "🏛️" },
  { name: "Nature", icon: "🌿" },
  { name: "Nightlife", icon: "🌃" },
]

const destinations = [
  {
    name: "Paris",
    country: "France",
    description: "The City of Light beckons with its iconic Eiffel Tower, world-class museums, romantic streets, and unparalleled cuisine. From the Louvre to Montmartre, every corner tells a story.",
    image_url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    best_time_to_visit: "April-June, September-October",
    currency: "EUR",
    language: "French",
    lat: 48.8566,
    lng: 2.3522,
    rating: 4.8,
    categories: ["Culture", "Food", "History"],
    attractions: [
      { name: "Eiffel Tower", description: "Iconic iron lattice tower offering panoramic views of Paris", price: 25, duration: "2 hours", rating: 4.8, category: "Landmark", lat: 48.8584, lng: 2.2945 },
      { name: "Louvre Museum", description: "World's largest art museum housing the Mona Lisa", price: 17, duration: "4 hours", rating: 4.7, category: "Museum", lat: 48.8606, lng: 2.3376 },
      { name: "Notre-Dame Cathedral", description: "Medieval Catholic cathedral with Gothic architecture", price: 0, duration: "1 hour", rating: 4.6, category: "Landmark", lat: 48.8530, lng: 2.3499 },
      { name: "Montmartre", description: "Historic artistic neighborhood with Sacré-Cœur Basilica", price: 0, duration: "3 hours", rating: 4.5, category: "Neighborhood", lat: 48.8867, lng: 2.3431 },
      { name: "Seine River Cruise", description: "Scenic boat ride along the Seine passing major landmarks", price: 15, duration: "1 hour", rating: 4.4, category: "Tour", lat: 48.8589, lng: 2.3468 },
    ],
    hotels: [
      { name: "Hôtel Plaza Athénée", description: "Luxurious hotel near Eiffel Tower with Dior spa", price_per_night: 850, rating: 4.9, lat: 48.8700, lng: 2.3075, amenities: ["Pool", "Spa", "Restaurant", "Bar", "Gym"] },
      { name: "Le Marais Boutique Hotel", description: "Charming boutique hotel in trendy Le Marais district", price_per_night: 220, rating: 4.5, lat: 48.8590, lng: 2.3600, amenities: ["Free WiFi", "Breakfast", "Airport Shuttle"] },
    ],
  },
  {
    name: "Tokyo",
    country: "Japan",
    description: "A dazzling blend of ancient traditions and futuristic innovation. Experience serene temples, bustling Shibuya crossing, incredible ramen, and neon-lit streets.",
    image_url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    best_time_to_visit: "March-May, September-November",
    currency: "JPY",
    language: "Japanese",
    lat: 35.6762,
    lng: 139.6503,
    rating: 4.7,
    categories: ["Culture", "Food", "Shopping"],
    attractions: [
      { name: "Senso-ji Temple", description: "Tokyo's oldest temple in Asakusa with vibrant market street", price: 0, duration: "1.5 hours", rating: 4.6, category: "Temple", lat: 35.7148, lng: 139.7967 },
      { name: "Shibuya Crossing", description: "World-famous scramble crossing surrounded by neon", price: 0, duration: "30 min", rating: 4.4, category: "Landmark", lat: 35.6595, lng: 139.7004 },
      { name: "Tsukiji Outer Market", description: "Famous seafood market with street food stalls", price: 20, duration: "2 hours", rating: 4.5, category: "Market", lat: 35.6654, lng: 139.7707 },
      { name: "Meiji Shrine", description: "Serene Shinto shrine surrounded by forest", price: 0, duration: "1 hour", rating: 4.5, category: "Shrine", lat: 35.6764, lng: 139.6993 },
      { name: "Akihabara Electric Town", description: "Electronics district and anime/manga hub", price: 0, duration: "3 hours", rating: 4.3, category: "Shopping", lat: 35.7023, lng: 139.7713 },
    ],
    hotels: [
      { name: "Park Hyatt Tokyo", description: "Luxury hotel in Shinjuku with stunning city views", price_per_night: 500, rating: 4.8, lat: 35.6854, lng: 139.6917, amenities: ["Pool", "Spa", "Restaurant", "Gym", "Bar"] },
      { name: "APA Hotel Shinjuku", description: "Modern budget hotel near Shinjuku Station", price_per_night: 90, rating: 4.1, lat: 35.6900, lng: 139.7000, amenities: ["Free WiFi", "Restaurant", "Laundry"] },
    ],
  },
  {
    name: "Bali",
    country: "Indonesia",
    description: "Tropical paradise of terraced rice paddies, ancient temples, surf beaches, and vibrant arts scene. Ubud's spiritual heart meets Seminyak's beach clubs.",
    image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    best_time_to_visit: "April-October",
    currency: "IDR",
    language: "Indonesian",
    lat: -8.3405,
    lng: 115.0920,
    rating: 4.6,
    categories: ["Beach", "Nature", "Adventure"],
    attractions: [
      { name: "Ubud Monkey Forest", description: "Sacred monkey sanctuary in lush jungle", price: 5, duration: "1.5 hours", rating: 4.5, category: "Nature", lat: -8.5181, lng: 115.2591 },
      { name: "Tegallalang Rice Terraces", description: "Stunning green rice terraces with swing photo ops", price: 3, duration: "1 hour", rating: 4.6, category: "Nature", lat: -8.4312, lng: 115.2798 },
      { name: "Tanah Lot Temple", description: "Sea temple on rocky outcrop with sunset views", price: 5, duration: "1 hour", rating: 4.5, category: "Temple", lat: -8.6213, lng: 115.0868 },
      { name: "Seminyak Beach", description: "Popular surf beach with sunset bars", price: 0, duration: "3 hours", rating: 4.3, category: "Beach", lat: -8.6914, lng: 115.1552 },
      { name: "Ubud Art Market", description: "Traditional market with handmade crafts and art", price: 0, duration: "2 hours", rating: 4.2, category: "Market", lat: -8.5069, lng: 115.2625 },
    ],
    hotels: [
      { name: "Four Seasons Resort Bali at Sayan", description: "Luxury resort surrounded by riverside jungle", price_per_night: 600, rating: 4.9, lat: -8.5000, lng: 115.2600, amenities: ["Pool", "Spa", "Restaurant", "Yoga", "Free WiFi"] },
      { name: "The煾in Villas Seminyak", description: "Boutique villas with private pools near beach", price_per_night: 180, rating: 4.4, lat: -8.6900, lng: 115.1500, amenities: ["Pool", "Restaurant", "Free WiFi", "Airport Shuttle"] },
    ],
  },
  {
    name: "New York",
    country: "United States",
    description: "The Big Apple offers iconic skyline, world-class museums, diverse cuisine, Broadway shows, and energy 24/7. Central Park to Times Square never sleeps.",
    image_url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    best_time_to_visit: "April-June, September-October",
    currency: "USD",
    language: "English",
    lat: 40.7128,
    lng: -74.0060,
    rating: 4.7,
    categories: ["Shopping", "Culture", "Food"],
    attractions: [
      { name: "Statue of Liberty", description: "Iconic symbol of freedom on Liberty Island", price: 24, duration: "3 hours", rating: 4.7, category: "Landmark", lat: 40.6892, lng: -74.0445 },
      { name: "Central Park", description: "Massive urban park with lakes, trails, and attractions", price: 0, duration: "3 hours", rating: 4.6, category: "Park", lat: 40.7829, lng: -73.9654 },
      { name: "Metropolitan Museum of Art", description: "World-renowned art museum on Museum Mile", price: 25, duration: "4 hours", rating: 4.7, category: "Museum", lat: 40.7794, lng: -73.9632 },
      { name: "Times Square", description: "Bright lights, Broadway, and iconic billboards", price: 0, duration: "1 hour", rating: 4.3, category: "Landmark", lat: 40.7580, lng: -73.9855 },
      { name: "Brooklyn Bridge", description: "Historic suspension bridge with pedestrian walkway", price: 0, duration: "1 hour", rating: 4.6, category: "Landmark", lat: 40.7061, lng: -73.9969 },
    ],
    hotels: [
      { name: "The Plaza Hotel", description: "Legendary luxury hotel overlooking Central Park", price_per_night: 700, rating: 4.8, lat: 40.7644, lng: -73.9740, amenities: ["Pool", "Spa", "Restaurant", "Gym", "Concierge"] },
      { name: "Pod 51 Hotel", description: "Budget-friendly midtown hotel with rooftop", price_per_night: 120, rating: 4.1, lat: 40.7560, lng: -73.9690, amenities: ["Free WiFi", "Rooftop", "Laundry"] },
    ],
  },
  {
    name: "Dubai",
    country: "UAE",
    description: "Ultra-modern city of superlatives with the world's tallest building, luxury shopping, desert safaris, and stunning artificial islands.",
    image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
    best_time_to_visit: "November-March",
    currency: "AED",
    language: "Arabic",
    lat: 25.2048,
    lng: 55.2708,
    rating: 4.5,
    categories: ["Shopping", "Adventure", "Food"],
    attractions: [
      { name: "Burj Khalifa", description: "World's tallest building with observation deck", price: 40, duration: "2 hours", rating: 4.7, category: "Landmark", lat: 25.1972, lng: 55.2744 },
      { name: "Dubai Mall", description: "Massive shopping mall with aquarium and ice rink", price: 0, duration: "4 hours", rating: 4.5, category: "Shopping", lat: 25.1986, lng: 55.2796 },
      { name: "Palm Jumeirah", description: "Artificial island with luxury resorts and beaches", price: 0, duration: "2 hours", rating: 4.4, category: "Landmark", lat: 25.1124, lng: 55.1390 },
      { name: "Desert Safari", description: "Dune bashing, camel rides, and BBQ dinner", price: 60, duration: "5 hours", rating: 4.6, category: "Adventure", lat: 25.1000, lng: 55.4000 },
      { name: "Dubai Marina", description: "Waterfront district with restaurants and yacht cruises", price: 0, duration: "2 hours", rating: 4.4, category: "Neighborhood", lat: 25.0800, lng: 55.1400 },
    ],
    hotels: [
      { name: "Burj Al Arab Jumeirah", description: "Iconic sail-shaped luxury all-suite hotel", price_per_night: 1500, rating: 4.9, lat: 25.1412, lng: 55.1852, amenities: ["Private Beach", "Pool", "Spa", "Restaurant", "Helipad"] },
      { name: "Rove Downtown", description: "Modern affordable hotel near Burj Khalifa", price_per_night: 100, rating: 4.3, lat: 25.1900, lng: 55.2700, amenities: ["Pool", "Gym", "Free WiFi", "Restaurant"] },
    ],
  },
  {
    name: "Barcelona",
    country: "Spain",
    description: "Gaudí's architectural wonderland meets Mediterranean beach life. Tapas bars, Gothic Quarter streets, and FC Barcelona passion.",
    image_url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800",
    best_time_to_visit: "May-June, September-October",
    currency: "EUR",
    language: "Spanish, Catalan",
    lat: 41.3874,
    lng: 2.1686,
    rating: 4.6,
    categories: ["Beach", "Culture", "Food"],
    attractions: [
      { name: "Sagrada Família", description: "Gaudí's unfinished masterpiece basilica", price: 26, duration: "2 hours", rating: 4.7, category: "Landmark", lat: 41.4036, lng: 2.1744 },
      { name: "Park Güell", description: "Colorful Gaudí park with mosaic art and city views", price: 10, duration: "1.5 hours", rating: 4.5, category: "Park", lat: 41.4145, lng: 2.1527 },
      { name: "La Boqueria Market", description: "Iconic food market on Las Ramblas", price: 15, duration: "1.5 hours", rating: 4.5, category: "Market", lat: 41.3815, lng: 2.1717 },
      { name: "Barceloneta Beach", description: "Popular city beach with restaurants and bars", price: 0, duration: "3 hours", rating: 4.3, category: "Beach", lat: 41.3784, lng: 2.1925 },
      { name: "Gothic Quarter", description: "Medieval streets with hidden plazas and history", price: 0, duration: "2 hours", rating: 4.6, category: "Neighborhood", lat: 41.3839, lng: 2.1765 },
    ],
    hotels: [
      { name: "Hotel Arts Barcelona", description: "Luxury beachfront hotel with infinity pool", price_per_night: 450, rating: 4.7, lat: 41.3863, lng: 2.1968, amenities: ["Pool", "Spa", "Restaurant", "Beach Access", "Gym"] },
      { name: "Catalonia Gòtic", description: "Charming hotel in Gothic Quarter with rooftop pool", price_per_night: 130, rating: 4.3, lat: 41.3840, lng: 2.1770, amenities: ["Pool", "Free WiFi", "Breakfast", "Rooftop"] },
    ],
  },
  {
    name: "Bangkok",
    country: "Thailand",
    description: "Electric capital of Thailand with golden temples, floating markets, sizzling street food, and nightlife that never ends.",
    image_url: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800",
    best_time_to_visit: "November-February",
    currency: "THB",
    language: "Thai",
    lat: 13.7563,
    lng: 100.5018,
    rating: 4.5,
    categories: ["Food", "Culture", "Shopping"],
    attractions: [
      { name: "Grand Palace", description: "Former royal residence with Wat Phra Kaew temple", price: 15, duration: "2 hours", rating: 4.6, category: "Landmark", lat: 13.7500, lng: 100.4914 },
      { name: "Wat Arun", description: "Stunning riverside temple with towering spires", price: 3, duration: "1 hour", rating: 4.5, category: "Temple", lat: 13.7437, lng: 100.4888 },
      { name: "Chatuchak Weekend Market", description: "One of the world's largest weekend markets", price: 0, duration: "4 hours", rating: 4.4, category: "Market", lat: 13.7997, lng: 100.5508 },
      { name: "Khao San Road", description: "Famous backpacker street with bars and street food", price: 0, duration: "2 hours", rating: 4.0, category: "Nightlife", lat: 13.7588, lng: 100.4977 },
      { name: "Floating Market", description: "Traditional market on canals with boat vendors", price: 10, duration: "3 hours", rating: 4.3, category: "Market", lat: 13.7500, lng: 100.4800 },
    ],
    hotels: [
      { name: "Mandarin Oriental Bangkok", description: "Iconic luxury hotel on the Chao Phraya River", price_per_night: 350, rating: 4.8, lat: 13.7236, lng: 100.5144, amenities: ["Pool", "Spa", "Restaurant", "River View", "Gym"] },
      { name: "Here Hostel Bangkok", description: "Social hostel with rooftop near Khao San Road", price_per_night: 15, rating: 4.2, lat: 13.7570, lng: 100.4980, amenities: ["Free WiFi", "Rooftop", "Breakfast", "Locker"] },
    ],
  },
  {
    name: "Sydney",
    country: "Australia",
    description: "Harbour city with iconic Opera House, stunning beaches, diverse food scene, and vibrant outdoor lifestyle. Bondi to Blue Mountains adventure awaits.",
    image_url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800",
    best_time_to_visit: "October-April",
    currency: "AUD",
    language: "English",
    lat: -33.8688,
    lng: 151.2093,
    rating: 4.6,
    categories: ["Beach", "Nature", "Adventure"],
    attractions: [
      { name: "Sydney Opera House", description: "World-famous performing arts venue on the harbor", price: 25, duration: "1.5 hours", rating: 4.7, category: "Landmark", lat: -33.8568, lng: 151.2153 },
      { name: "Bondi Beach", description: "Iconic surf beach with coastal walk to Coogee", price: 0, duration: "4 hours", rating: 4.6, category: "Beach", lat: -33.8915, lng: 151.2767 },
      { name: "Sydney Harbour Bridge", description: "Climb the famous bridge for panoramic views", price: 200, duration: "3 hours", rating: 4.8, category: "Adventure", lat: -33.8523, lng: 151.2108 },
      { name: "Royal Botanic Garden", description: "Harbour-side gardens with native plants", price: 0, duration: "1.5 hours", rating: 4.5, category: "Park", lat: -33.8642, lng: 151.2166 },
      { name: "Taronga Zoo", description: "Zoo with native Australian animals and harbor views", price: 35, duration: "4 hours", rating: 4.5, category: "Nature", lat: -33.8434, lng: 151.2414 },
    ],
    hotels: [
      { name: "Shangri-La Sydney", description: "Luxury hotel with Opera House harbor views", price_per_night: 380, rating: 4.7, lat: -33.8610, lng: 151.2100, amenities: ["Pool", "Spa", "Restaurant", "Gym", "Bar"] },
      { name: "YHA Sydney Harbour", description: "Budget hostel with rooftop and harbor view", price_per_night: 40, rating: 4.3, lat: -33.8580, lng: 151.2120, amenities: ["Free WiFi", "Rooftop", "Kitchen", "Laundry"] },
    ],
  },
  {
    name: "Rome",
    country: "Italy",
    description: "The Eternal City where ancient history meets la dolce vita. Colosseum, Vatican, trattorias, and gelato around every corner.",
    image_url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
    best_time_to_visit: "April-June, September-October",
    currency: "EUR",
    language: "Italian",
    lat: 41.9028,
    lng: 12.4964,
    rating: 4.7,
    categories: ["History", "Culture", "Food"],
    attractions: [
      { name: "Colosseum", description: "Ancient Roman amphitheater, iconic symbol of Rome", price: 16, duration: "2 hours", rating: 4.7, category: "Landmark", lat: 41.8902, lng: 12.4922 },
      { name: "Vatican Museums", description: "Vast papal art collection including Sistine Chapel", price: 17, duration: "4 hours", rating: 4.6, category: "Museum", lat: 41.9065, lng: 12.4536 },
      { name: "Trevi Fountain", description: "Baroque fountain where you toss a coin for luck", price: 0, duration: "30 min", rating: 4.6, category: "Landmark", lat: 41.9009, lng: 12.4833 },
      { name: "Roman Forum", description: "Ancient Roman government center ruins", price: 16, duration: "2 hours", rating: 4.5, category: "History", lat: 41.8925, lng: 12.4853 },
      { name: "Trastevere", description: "Charming neighborhood with authentic Roman cuisine", price: 0, duration: "3 hours", rating: 4.6, category: "Neighborhood", lat: 41.8867, lng: 12.4699 },
    ],
    hotels: [
      { name: "Hotel Eden Rome", description: "Luxury hotel near Spanish Steps with rooftop restaurant", price_per_night: 600, rating: 4.8, lat: 41.9050, lng: 12.4850, amenities: ["Pool", "Spa", "Restaurant", "Bar", "Gym"] },
      { name: "The Beehive Hostel", description: "Eco-friendly hostel near Termini station", price_per_night: 30, rating: 4.2, lat: 41.9010, lng: 12.5020, amenities: ["Free WiFi", "Garden", "Kitchen", "Breakfast"] },
    ],
  },
  {
    name: "Cape Town",
    country: "South Africa",
    description: "Stunning coastal city beneath Table Mountain. Rich history, vibrant food scene, penguins at Boulders Beach, and Cape Winelands.",
    image_url: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=800",
    best_time_to_visit: "November-March",
    currency: "ZAR",
    language: "Afrikaans, English, Xhosa",
    lat: -33.9249,
    lng: 18.4241,
    rating: 4.5,
    categories: ["Nature", "Adventure", "Beach"],
    attractions: [
      { name: "Table Mountain", description: "Iconic flat-topped mountain with cable car to summit", price: 20, duration: "3 hours", rating: 4.7, category: "Nature", lat: -33.9628, lng: 18.4098 },
      { name: "Boulders Beach", description: "Penguin colony beach with boardwalks", price: 10, duration: "1.5 hours", rating: 4.5, category: "Beach", lat: -34.1974, lng: 18.4512 },
      { name: "V&A Waterfront", description: "Harborfront with shops, restaurants, and attractions", price: 0, duration: "3 hours", rating: 4.4, category: "Shopping", lat: -33.9036, lng: 18.4220 },
      { name: "Cape of Good Hope", description: "Scenic nature reserve at the tip of the Cape Peninsula", price: 12, duration: "4 hours", rating: 4.6, category: "Nature", lat: -34.3568, lng: 18.4740 },
      { name: "Robben Island", description: "Historical prison where Mandela was held", price: 30, duration: "4 hours", rating: 4.5, category: "History", lat: -33.8076, lng: 18.3711 },
    ],
    hotels: [
      { name: "The Silo Hotel", description: "Industrial-chic luxury hotel at the V&A Waterfront", price_per_night: 800, rating: 4.9, lat: -33.9040, lng: 18.4200, amenities: ["Pool", "Spa", "Restaurant", "Bar", "Gym"] },
      { name: "Once in Cape Town", description: "Modern hostel with rooftop near Long Street", price_per_night: 20, rating: 4.3, lat: -33.9260, lng: 18.4200, amenities: ["Free WiFi", "Rooftop", "Kitchen", "Breakfast"] },
    ],
  },
]

async function seed() {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Insert categories
    const categoryMap = new Map<string, string>()
    for (const cat of categories) {
      const result = await client.query(
        "INSERT INTO categories (name, icon) VALUES ($1, $2) RETURNING id",
        [cat.name, cat.icon]
      )
      categoryMap.set(cat.name, result.rows[0].id)
    }

    // Insert destinations with attractions and hotels
    for (const dest of destinations) {
      const destResult = await client.query(
        `INSERT INTO destinations (name, country, description, image_url, best_time_to_visit, currency, language, lat, lng, rating)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [dest.name, dest.country, dest.description, dest.image_url, dest.best_time_to_visit, dest.currency, dest.language, dest.lat, dest.lng, dest.rating]
      )
      const destId = destResult.rows[0].id

      // Link categories
      for (const catName of dest.categories) {
        const catId = categoryMap.get(catName)
        if (catId) {
          await client.query(
            "INSERT INTO destination_categories (destination_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [destId, catId]
          )
        }
      }

      // Insert attractions
      for (const attr of dest.attractions) {
        await client.query(
          `INSERT INTO attractions (destination_id, name, description, lat, lng, price, duration, rating, category)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [destId, attr.name, attr.description, attr.lat, attr.lng, attr.price, attr.duration, attr.rating, attr.category]
        )
      }

      // Insert hotels
      for (const hotel of dest.hotels) {
        await client.query(
          `INSERT INTO hotels (destination_id, name, description, price_per_night, rating, lat, lng, amenities)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [destId, hotel.name, hotel.description, hotel.price_per_night, hotel.rating, hotel.lat, hotel.lng, hotel.amenities]
        )
      }
    }

    await client.query("COMMIT")
    console.log("Seed completed successfully!")
    console.log(`  - ${categories.length} categories`)
    console.log(`  - ${destinations.length} destinations with categories, attractions, and hotels`)
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Seed failed:", error)
  } finally {
    client.release()
    await pool.end()
  }
}

seed()
