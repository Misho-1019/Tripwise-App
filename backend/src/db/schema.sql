-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Destinations
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  best_time_to_visit VARCHAR(255),
  currency VARCHAR(10),
  language VARCHAR(100),
  lat DECIMAL(10, 7),
  lng DECIMAL(10, 7),
  rating DECIMAL(2, 1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50)
);

-- Junction: destination <-> category
CREATE TABLE IF NOT EXISTS destination_categories (
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (destination_id, category_id)
);

-- Attractions
CREATE TABLE IF NOT EXISTS attractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  lat DECIMAL(10, 7),
  lng DECIMAL(10, 7),
  price DECIMAL(10, 2) DEFAULT 0,
  duration VARCHAR(50),
  rating DECIMAL(2, 1) DEFAULT 0,
  category VARCHAR(100)
);

-- Hotels
CREATE TABLE IF NOT EXISTS hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  price_per_night DECIMAL(10, 2),
  rating DECIMAL(2, 1) DEFAULT 0,
  lat DECIMAL(10, 7),
  lng DECIMAL(10, 7),
  amenities TEXT[]
);

-- Trips
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES destinations(id),
  name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'planning',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trip Days
CREATE TABLE IF NOT EXISTS trip_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  day_number INTEGER NOT NULL,
  notes TEXT,
  UNIQUE(trip_id, day_number)
);

-- Trip Activities
CREATE TABLE IF NOT EXISTS trip_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_day_id UUID REFERENCES trip_days(id) ON DELETE CASCADE,
  attraction_id UUID REFERENCES attractions(id),
  title VARCHAR(255),
  start_time TIME,
  end_time TIME,
  notes TEXT,
  order_index INTEGER NOT NULL,
  cost DECIMAL(10, 2) DEFAULT 0
);

-- Saved / Wishlist
CREATE TABLE IF NOT EXISTS saved_destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, destination_id)
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_destinations_name ON destinations(name);
CREATE INDEX IF NOT EXISTS idx_destinations_country ON destinations(country);
CREATE INDEX IF NOT EXISTS idx_attractions_destination ON attractions(destination_id);
CREATE INDEX IF NOT EXISTS idx_hotels_destination ON hotels(destination_id);
CREATE INDEX IF NOT EXISTS idx_trips_user ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_days_trip ON trip_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_activities_day ON trip_activities(trip_day_id);
CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_destinations(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_destination ON reviews(destination_id);
