/*
  # Juthoor Platform - Complete Marketplace Schema
  
  Building on the existing artisan marketplace, this migration adds:
  - User authentication and role management
  - Complete e-commerce infrastructure
  - AI-powered features for product recommendations and pricing
  - Heritage documentation and authenticity verification
  - Analytics and business intelligence tables
*/

-- Drop existing artisans and products tables to rebuild
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS artisans CASCADE;
DROP TABLE IF EXISTS artisan_stories CASCADE;

-- Core Users Table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('artisan', 'buyer', 'admin')),
  profile_photo_url text,
  phone text,
  preferred_language text DEFAULT 'ar' CHECK (preferred_language IN ('ar', 'en', 'fr')),
  country text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Artisan Extended Profile
CREATE TABLE IF NOT EXISTS artisans (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  region text NOT NULL,
  craft_specialty text NOT NULL,
  bio_ar text,
  bio_en text,
  bio_fr text,
  years_of_experience integer DEFAULT 0,
  total_sales integer DEFAULT 0,
  average_rating numeric DEFAULT 0,
  is_premium boolean DEFAULT false,
  premium_until timestamptz,
  heritage_certified boolean DEFAULT false,
  bank_account text,
  stripe_connect_id text,
  created_at timestamptz DEFAULT now()
);

-- Buyer Extended Profile
CREATE TABLE IF NOT EXISTS buyers (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_address text,
  city text,
  postal_code text,
  country_code text,
  wishlist_count integer DEFAULT 0,
  total_spent numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  name_fr text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon_name text,
  description_en text,
  created_at timestamptz DEFAULT now()
);

-- Products - Main product table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id uuid NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  name_fr text NOT NULL,
  description_ar text,
  description_en text,
  description_fr text,
  price_usd numeric NOT NULL,
  price_sar numeric,
  price_eur numeric,
  quantity_available integer DEFAULT 1,
  materials_ar text,
  materials_en text,
  materials_fr text,
  dimensions text,
  weight_kg numeric,
  heritage_story_ar text,
  heritage_story_en text,
  heritage_story_fr text,
  is_featured boolean DEFAULT false,
  product_status text DEFAULT 'active' CHECK (product_status IN ('active', 'inactive', 'pending_review')),
  average_rating numeric DEFAULT 0,
  total_reviews integer DEFAULT 0,
  view_count integer DEFAULT 0,
  fair_price_suggested numeric,
  authenticity_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product Images
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text_en text,
  alt_text_ar text,
  alt_text_fr text,
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Shopping Cart
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  added_at timestamptz DEFAULT now()
);

-- Wishlist
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  UNIQUE(buyer_id, product_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  total_amount_usd numeric NOT NULL,
  total_amount_seller_currency numeric,
  currency text DEFAULT 'USD',
  order_status text DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  shipping_address text NOT NULL,
  shipping_country text NOT NULL,
  tracking_number text,
  notes text,
  created_at timestamptz DEFAULT now(),
  shipped_at timestamptz,
  delivered_at timestamptz
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  artisan_id uuid NOT NULL REFERENCES artisans(id),
  quantity integer NOT NULL,
  unit_price_usd numeric NOT NULL,
  subtotal_usd numeric NOT NULL,
  commission_percentage numeric DEFAULT 10,
  artisan_earnings_usd numeric,
  created_at timestamptz DEFAULT now()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title_en text,
  title_ar text,
  comment_en text,
  comment_ar text,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, buyer_id, order_id)
);

-- Artisan Stories & Heritage Documentation
CREATE TABLE IF NOT EXISTS artisan_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id uuid NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
  title_en text NOT NULL,
  title_ar text NOT NULL,
  content_en text,
  content_ar text,
  story_type text CHECK (story_type IN ('recipe', 'technique', 'history', 'tradition')),
  media_url text,
  media_type text CHECK (media_type IN ('text', 'audio', 'video', 'image')),
  created_at timestamptz DEFAULT now()
);

-- Authenticity Certificates
CREATE TABLE IF NOT EXISTS authenticity_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  certificate_number text UNIQUE NOT NULL,
  issued_date timestamptz DEFAULT now(),
  verified_by text,
  details_en text,
  details_ar text
);

-- AI Generated Descriptions Cache
CREATE TABLE IF NOT EXISTS ai_product_descriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  description_en text,
  description_ar text,
  description_fr text,
  tags_en text[],
  tags_ar text[],
  seo_keywords text,
  generated_at timestamptz DEFAULT now()
);

-- Price Analytics
CREATE TABLE IF NOT EXISTS price_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  analytics_date date DEFAULT now(),
  price_usd numeric,
  competitor_avg_price numeric,
  demand_score numeric,
  suggested_price numeric,
  market_position text
);

-- Buyer Preferences for Recommendations
CREATE TABLE IF NOT EXISTS buyer_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id),
  region_preference text,
  price_range_min numeric,
  price_range_max numeric,
  interaction_type text,
  last_updated timestamptz DEFAULT now()
);

-- Heritage Recordings
CREATE TABLE IF NOT EXISTS heritage_recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id uuid NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
  title_en text,
  title_ar text,
  description_en text,
  description_ar text,
  recording_url text,
  duration_seconds integer,
  rec_language text CHECK (rec_language IN ('ar', 'en', 'fr')),
  transcription_ar text,
  transcription_en text,
  created_at timestamptz DEFAULT now()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id),
  amount_usd numeric NOT NULL,
  trans_currency text DEFAULT 'USD',
  payment_method text,
  stripe_transaction_id text,
  trans_status text DEFAULT 'pending' CHECK (trans_status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamptz DEFAULT now()
);

-- Artisan Earnings
CREATE TABLE IF NOT EXISTS artisan_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id uuid NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
  order_item_id uuid REFERENCES order_items(id),
  earn_month date,
  total_sales_usd numeric DEFAULT 0,
  commission_usd numeric DEFAULT 0,
  earnings_usd numeric DEFAULT 0,
  earn_status text DEFAULT 'pending' CHECK (earn_status IN ('pending', 'processing', 'paid')),
  payout_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Admin Logs
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES users(id),
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisan_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE authenticity_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_product_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE heritage_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisan_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view public profiles"
  ON users FOR SELECT TO public USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Artisans can view own profile"
  ON artisans FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Artisans can update own profile"
  ON artisans FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Buyers can view own profile"
  ON buyers FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Buyers can update own profile"
  ON buyers FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT TO public USING (true);

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT TO public USING (product_status = 'active');

CREATE POLICY "Artisans can view own products"
  ON products FOR SELECT TO authenticated USING (artisan_id = (SELECT id FROM artisans WHERE id = auth.uid()));

CREATE POLICY "Artisans can insert products"
  ON products FOR INSERT TO authenticated WITH CHECK (artisan_id = (SELECT id FROM artisans WHERE id = auth.uid()));

CREATE POLICY "Artisans can update own products"
  ON products FOR UPDATE TO authenticated USING (artisan_id = (SELECT id FROM artisans WHERE id = auth.uid())) WITH CHECK (artisan_id = (SELECT id FROM artisans WHERE id = auth.uid()));

CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT TO public USING (true);

CREATE POLICY "Buyers can manage own cart"
  ON cart_items FOR ALL TO authenticated USING (buyer_id = (SELECT id FROM buyers WHERE id = auth.uid())) WITH CHECK (buyer_id = (SELECT id FROM buyers WHERE id = auth.uid()));

CREATE POLICY "Buyers can manage own wishlist"
  ON wishlists FOR ALL TO authenticated USING (buyer_id = (SELECT id FROM buyers WHERE id = auth.uid())) WITH CHECK (buyer_id = (SELECT id FROM buyers WHERE id = auth.uid()));

CREATE POLICY "Buyers can view own orders"
  ON orders FOR SELECT TO authenticated USING (buyer_id = (SELECT id FROM buyers WHERE id = auth.uid()));

CREATE POLICY "Buyers can insert orders"
  ON orders FOR INSERT TO authenticated WITH CHECK (buyer_id = (SELECT id FROM buyers WHERE id = auth.uid()));

CREATE POLICY "Buyers can manage own reviews"
  ON reviews FOR ALL TO authenticated USING (buyer_id = (SELECT id FROM buyers WHERE id = auth.uid())) WITH CHECK (buyer_id = (SELECT id FROM buyers WHERE id = auth.uid()));

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT TO public USING (true);

CREATE POLICY "Artisans can manage own stories"
  ON artisan_stories FOR ALL TO authenticated USING (artisan_id = (SELECT id FROM artisans WHERE id = auth.uid())) WITH CHECK (artisan_id = (SELECT id FROM artisans WHERE id = auth.uid()));

CREATE POLICY "Anyone can view artisan stories"
  ON artisan_stories FOR SELECT TO public USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_artisan_id ON products(artisan_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_product_status ON products(product_status);
CREATE INDEX IF NOT EXISTS idx_cart_items_buyer_id ON cart_items(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_artisan_stories_artisan_id ON artisan_stories(artisan_id);
