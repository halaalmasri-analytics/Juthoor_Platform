# Juthoor — جذور

**"Rooted in Palestine, Reaching the World"**

An AI-powered Palestinian heritage marketplace platform connecting authentic artisans with global buyers.

## Platform Overview

Juthoor is a comprehensive e-commerce and heritage documentation platform designed to:

- Support Palestinian artisans by providing direct access to global markets
- Preserve and celebrate Palestinian cultural heritage and traditions
- Enable fair-trade transactions with transparent pricing and artisan support
- Document and digitize heritage crafts, recipes, and traditions
- Provide AI-powered tools for product discovery and business intelligence

## Technology Stack

- **Frontend**: React.js + TypeScript with Tailwind CSS
- **Backend**: Supabase (PostgreSQL) with Row Level Security
- **Edge Functions**: Deno-based serverless functions for recommendations and analytics
- **API Client**: Supabase JavaScript SDK
- **UI Components**: Lucide React icons
- **Multilingual**: Full support for Arabic (RTL), English, and French

## Core Architecture

### Database Schema

The platform uses a comprehensive multi-table schema:

1. **Users & Profiles**
   - `users`: Core user table with role-based access (artisan, buyer, admin)
   - `artisans`: Extended artisan profiles with craft specialties and ratings
   - `buyers`: Extended buyer profiles with preferences and order history

2. **Products & Commerce**
   - `products`: Main product listings with multilingual content and pricing
   - `product_images`: High-quality product image management
   - `categories`: Product categories (Tatreez, Ceramics, Olive Wood, etc.)
   - `orders`: Purchase records with tracking
   - `order_items`: Individual products in orders with commission calculation
   - `cart_items`: Persistent shopping cart
   - `wishlists`: Buyer saved products
   - `reviews`: Product ratings and feedback

3. **Heritage & Documentation**
   - `artisan_stories`: Heritage documentation (recipes, techniques, history)
   - `heritage_recordings`: Audio/video documentation with transcriptions
   - `authenticity_certificates`: Certificates of origin and authenticity verification

4. **AI & Analytics**
   - `ai_product_descriptions`: AI-generated multilingual product descriptions cache
   - `price_analytics`: Historical pricing data and market intelligence
   - `buyer_preferences`: Tracking for AI recommendations
   - `admin_logs`: Audit trail for all administrative actions

5. **Business**
   - `transactions`: Payment records
   - `artisan_earnings`: Commission calculations and payout tracking

### Security

- **Row Level Security (RLS)**: Enabled on all tables
- **Authentication**: Email/password via Supabase Auth
- **Authorization**: Role-based policies (artisan can only edit own products, buyers can only access own orders)
- **Data Privacy**: GDPR compliant with user data segregation

## Key Features

### For Artisans

- **Simple Product Listing**: Easy-to-use interface for uploading products with AI assistance
- **Dashboard**: View sales, earnings, ratings, and product performance
- **Heritage Documentation**: Upload and preserve craft traditions
- **Fair Pricing**: Transparent commission structure (8-12%)
- **Payment Integration**: Direct payouts in local currency
- **Performance Analytics**: Sales trends and customer insights

### For Buyers

- **Product Discovery**: Browse by category, region, price, and heritage type
- **AI Recommendations**: Personalized product suggestions based on preferences
- **Multilingual Shopping**: Full support for Arabic, English, and French
- **Authentic Certificates**: Verify heritage and authenticity of every product
- **Order Tracking**: Real-time shipping updates
- **Reviews & Ratings**: Transparent buyer feedback system
- **Wishlist**: Save favorite products for later

### For Administrators

- **Platform Management**: Manage users, products, and disputes
- **Quality Control**: Verify artisan authenticity and product quality
- **Analytics Dashboard**: Real-time sales, revenue, and user metrics
- **Fraud Detection**: Automated monitoring for suspicious transactions
- **Content Moderation**: Review and approve listings and reviews

## Product Categories

1. **Tatreez (Embroidery)** - Traditional Palestinian cross-stitch textiles
2. **Ceramics** - Handcrafted pottery and tableware
3. **Olive Wood** - Carved wooden crafts and decorative items
4. **Food & Spices** - Authentic Palestinian food products
5. **Traditional Soap** - Nabulsi and handmade Palestinian soaps
6. **Jewelry** - Handcrafted Palestinian jewelry and accessories

## Regions Featured

- **Nablus** - Traditional embroidery and soap
- **Hebron** - Ceramics and glassware
- **Ramallah** - Contemporary crafts
- **Gaza** - Textiles and traditional weaving

## API Endpoints

### Product Recommendations
```
POST /functions/v1/juthoor-api/recommendations
Body: { buyerId, limit }
```

### Artisan Statistics
```
GET /functions/v1/juthoor-api/artisan-stats/{artisanId}
```

### Order Tracking
```
GET /functions/v1/juthoor-api/order-tracking/{orderId}
```

## Multilingual Support

- **Arabic (العربية)** - RTL layout, full UI localization
- **English** - Primary language
- **French (Français)** - European market support

Language switching available in header on all pages.

## Pricing Model

- **Commission**: 8-12% per sale (varies by product category)
- **Artisan Premium**: Optional premium subscription for featured listings
- **Heritage Certification**: Fee for authenticity verification
- **Fair Trade Commitment**: Guaranteed minimum artisan earnings of 60% of sale price

## User Roles & Permissions

### Artisan
- Create and manage products
- Upload heritage documentation
- View sales and earnings
- Access performance analytics
- Cannot modify other artisans' content

### Buyer
- Browse and search products
- Place orders
- Leave reviews and ratings
- Manage wishlist and cart
- Track orders
- Cannot access admin functions

### Admin
- Full platform management
- User verification and approval
- Product quality control
- Revenue analytics
- Fraud detection
- Cannot create orders as buyers

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

The following environment variables are automatically configured:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Public Supabase API key

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Database Migrations

All database schema is managed through Supabase migrations. Current migration:
- `20260328130842_create_juthoor_full_platform.sql` - Complete platform schema

## Component Structure

```
src/
├── components/
│   ├── Header.tsx           - Navigation header
│   ├── Hero.tsx             - Landing hero section
│   ├── Footer.tsx           - Footer with links
│   ├── LanguageSwitcher.tsx - Language selector
│   ├── ProductCard.tsx      - Original product card
│   └── JuthoorProductCard.tsx - Enhanced Juthoor product card
├── contexts/
│   ├── LanguageContext.tsx  - Multilingual support with RTL
│   └── AuthContext.tsx      - Authentication state management
├── lib/
│   ├── supabase.ts          - Supabase client initialization
│   └── api.ts               - API helper functions
├── pages/
│   ├── Products.tsx         - Products listing with filters
│   └── ArtisanDashboard.tsx - Artisan management interface
└── App.tsx                  - Main application component
```

## Design System

### Colors
- **Primary**: Deep Olive Green (#1B5E20)
- **Secondary**: Gold (#F9A825)
- **Accent**: Amber (#F59E0B)
- **Background**: White (#FAFAFA)
- **Text**: Black with gray variations

### Typography
- **Headings**: Bold, modern sans-serif
- **Body**: Clean, readable sans-serif
- **Size Scale**: 12px (xs) → 32px (3xl)

### Spacing
- 8px base unit system
- Consistent padding and margins
- Responsive breakpoints: mobile (320px), tablet (768px), desktop (1024px+)

## Future Enhancements

1. **AI Features**
   - Auto-generate product descriptions in 3 languages
   - Smart pricing recommendations
   - Demand forecasting
   - Customer sentiment analysis

2. **Payment Integration**
   - Stripe payment processing
   - Wise currency conversion
   - Multi-currency support

3. **Mobile App**
   - iOS and Android native applications
   - Offline product browsing
   - Push notifications for orders

4. **Advanced Analytics**
   - Power BI embedded dashboards
   - Real-time KPI monitoring
   - Predictive analytics

5. **Community Features**
   - Artisan forums and collaboration
   - Heritage webinars and tutorials
   - Cultural exchange programs

## Support & Contact

For support or inquiries:
- Email: support@juthoor.ps
- Website: www.juthoor.ps
- Instagram: @JuthoorMarketplace

## License

© 2024 Juthoor — جذور. All rights reserved.

---

**"Rooted in Palestine, Reaching the World"**
