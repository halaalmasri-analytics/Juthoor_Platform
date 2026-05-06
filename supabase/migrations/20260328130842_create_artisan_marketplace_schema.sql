/*
  # Palestinian Artisan Marketplace Schema

  1. New Tables
    - `artisans`
      - `id` (uuid, primary key)
      - `name` (text) - Artisan's name
      - `photo_url` (text) - URL to artisan's photo
      - `bio_en` (text) - Biography in English
      - `bio_ar` (text) - Biography in Arabic
      - `bio_fr` (text) - Biography in French
      - `location` (text) - City/region in Palestine
      - `created_at` (timestamptz)
    
    - `products`
      - `id` (uuid, primary key)
      - `artisan_id` (uuid, foreign key to artisans)
      - `name_en` (text) - Product name in English
      - `name_ar` (text) - Product name in Arabic
      - `name_fr` (text) - Product name in French
      - `description_en` (text) - Description in English
      - `description_ar` (text) - Description in Arabic
      - `description_fr` (text) - Description in French
      - `price_usd` (numeric) - Price in USD
      - `image_url` (text) - Main product image
      - `category` (text) - Product category (pottery, embroidery, woodwork, etc.)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (since this is a marketplace)
*/

CREATE TABLE IF NOT EXISTS artisans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  photo_url text,
  bio_en text DEFAULT '',
  bio_ar text DEFAULT '',
  bio_fr text DEFAULT '',
  location text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id uuid REFERENCES artisans(id) ON DELETE CASCADE,
  name_en text NOT NULL,
  name_ar text NOT NULL,
  name_fr text NOT NULL,
  description_en text DEFAULT '',
  description_ar text DEFAULT '',
  description_fr text DEFAULT '',
  price_usd numeric NOT NULL DEFAULT 0,
  image_url text,
  category text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view artisans"
  ON artisans FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);