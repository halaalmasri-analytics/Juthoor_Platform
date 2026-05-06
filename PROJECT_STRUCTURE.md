# Juthoor Platform - Project Structure

## Complete File Organization

```
project/
├── src/
│   ├── components/
│   │   ├── Header.tsx                 # Navigation header with logo and menu
│   │   ├── Hero.tsx                   # Landing page hero section
│   │   ├── Footer.tsx                 # Footer with social and links
│   │   ├── LanguageSwitcher.tsx       # Language selector (EN/AR/FR)
│   │   ├── ProductCard.tsx            # Original product card component
│   │   └── JuthoorProductCard.tsx     # Enhanced Juthoor-themed product card
│   │
│   ├── contexts/
│   │   ├── LanguageContext.tsx        # Multilingual support with RTL
│   │   │   └── Provides: language, dir, t() function
│   │   │   └── Supports: English, Arabic (RTL), French
│   │   │
│   │   └── AuthContext.tsx            # Authentication state management
│   │       └── Provides: user, signUp, signIn, signOut, isAuthenticated
│   │       └── Manages: User roles (artisan, buyer, admin)
│   │
│   ├── lib/
│   │   ├── supabase.ts                # Supabase client initialization
│   │   │   └── Types: User, Product, Artisan, Order
│   │   │
│   │   └── api.ts                     # API helper functions
│   │       └── getProductRecommendations()
│   │       └── getArtisanStats()
│   │       └── trackOrder()
│   │
│   ├── pages/
│   │   ├── Products.tsx               # Products listing with filters
│   │   │   └── Features: Category filter, price range, region
│   │   │   └── Mobile-responsive filter panel
│   │   │
│   │   └── ArtisanDashboard.tsx       # Artisan management interface
│   │       └── Stats: products, ratings, sales, orders
│   │       └── Product management table
│   │
│   ├── App.tsx                        # Main application component
│   │   └── Wraps: LanguageProvider, AuthProvider
│   │   └── Main HomePage with featured products
│   │
│   ├── main.tsx                       # React DOM entry point
│   ├── vite-env.d.ts                  # Vite environment types
│   └── index.css                      # Global styles with Tailwind
│
├── supabase/
│   ├── functions/
│   │   └── juthoor-api/               # Edge functions for AI features
│   │       └── index.ts
│   │           └── POST /recommendations (personalized products)
│   │           └── GET /artisan-stats/{id} (artisan metrics)
│   │           └── GET /order-tracking/{id} (order status)
│   │
│   └── migrations/
│       ├── 20260328130842_create_artisan_marketplace_schema.sql
│       └── create_juthoor_full_platform.sql
│           └── Complete database schema with 20+ tables
│           └── RLS policies for all tables
│           └── Indexes for performance
│
├── public/
│   ├── image.png                      # Juthoor logo (tree with AI circuits)
│   └── vite.svg
│
├── dist/                              # Build output (generated)
│   ├── index.html
│   ├── assets/
│   │   ├── index-*.css
│   │   └── index-*.js
│
├── Configuration Files
│   ├── package.json                   # Dependencies and scripts
│   ├── tsconfig.json                  # TypeScript config
│   ├── tsconfig.app.json              # App-specific TS config
│   ├── tsconfig.node.json             # Node TS config
│   ├── vite.config.ts                 # Vite build config
│   ├── tailwind.config.js             # Tailwind CSS config
│   ├── postcss.config.js              # PostCSS config
│   ├── eslint.config.js               # ESLint config
│   └── .env                           # Environment variables (auto-configured)
│
├── Documentation
│   ├── README_JUTHOOR.md              # Platform overview and features
│   ├── PROJECT_STRUCTURE.md           # This file
│   └── README.md                      # Original readme
│
└── Git
    ├── .gitignore                     # Ignored files
    └── .bolt/
        ├── config.json
        └── prompt

```

## Database Schema Overview

### User Management
- `users` - Core user table with authentication
- `artisans` - Extended artisan profiles
- `buyers` - Extended buyer profiles

### E-Commerce Core
- `products` - Product listings with multilingual content
- `product_images` - Product photos and alt text
- `categories` - Product categories and taxonomy
- `orders` - Purchase records
- `order_items` - Line items with commission tracking
- `transactions` - Payment processing records

### Shopping Features
- `cart_items` - Persistent shopping cart
- `wishlists` - Saved products
- `reviews` - Product ratings and feedback

### Heritage & Documentation
- `artisan_stories` - Heritage documentation
- `heritage_recordings` - Audio/video with transcription
- `authenticity_certificates` - Certificate of origin

### Analytics & AI
- `ai_product_descriptions` - Generated descriptions cache
- `price_analytics` - Pricing intelligence
- `buyer_preferences` - Recommendations data
- `admin_logs` - Audit trail

### Business Intelligence
- `artisan_earnings` - Commission tracking and payouts

## Component Relationships

```
App (main wrapper)
├── LanguageProvider (language context)
├── AuthProvider (auth context)
└── HomePage
    ├── Header
    │   ├── Logo & Navigation
    │   ├── LanguageSwitcher
    │   └── Cart Icon
    ├── Hero
    │   ├── Featured content
    │   └── Call-to-action buttons
    ├── Featured Products Section
    │   └── JuthoorProductCard[] (mapped from products)
    ├── Why Juthoor Section
    │   ├── 3-column feature grid
    │   └── Icons from lucide-react
    └── Footer
        ├── Links
        ├── Social
        └── Copyright

```

## Data Flow

### Product Discovery
1. User visits homepage/products page
2. Products loaded from Supabase (with artisan data)
3. Filters applied in real-time
4. API recommendations called for personalization
5. Products rendered with JuthoorProductCard component

### User Authentication
1. User signs up with email/password
2. Supabase Auth creates auth record
3. User record inserted in `users` table
4. Role-specific record created (`artisans` or `buyers`)
5. RLS policies restrict user access to own data

### Order Processing
1. Buyer adds products to cart
2. Checkout initiates order creation
3. Payment processed via edge function
4. Commission calculated (artisan_earnings)
5. Order tracked via edge function
6. Artisan notified of sale

## Key Features by Component

### Header
- Logo with Juthoor branding
- Navigation: Home, Products, Artisans
- Language switcher (EN/AR/FR with RTL)
- Shopping cart badge
- Mobile responsive menu

### Hero Section
- Eye-catching banner with tagline
- Artisan and country statistics
- Call-to-action buttons
- Responsive grid layout

### Product Cards
- Product image with hover effects
- Price badge with currency symbol
- Star rating display
- Artisan name and region
- Category and heritage tags
- Add to cart and wishlist buttons
- Authenticity verification badge

### Products Page
- Sidebar filter panel (mobile collapsible)
- Price range slider
- Region filter dropdown
- Product grid with responsive layout
- Mobile-optimized filter button

### Artisan Dashboard
- 4-stat overview (products, rating, sales, orders)
- Product management table
- Add new product button
- Product status display
- Quick edit actions

## Styling System

### Tailwind Configuration
- Color scheme: Green (#1B5E20) and Gold (#F9A825)
- Responsive breakpoints
- Custom animations (fadeIn)
- Dark mode not enabled (light theme)

### CSS Classes Used
- `bg-green-900` - Primary background
- `text-green-900` - Primary text
- `border-green-100` - Light borders
- `bg-amber-600` - Accent gold
- `rounded-lg` - Standard border radius
- `shadow-lg` - Card shadows
- `transition` - Smooth animations

## Performance Optimizations

1. **Image Optimization**: External images from Pexels
2. **Lazy Loading**: Products loaded on demand
3. **Code Splitting**: Separate route components
4. **Database Indexes**: On frequently queried columns
5. **RLS Policies**: Minimize data transfer
6. **Edge Functions**: Serverless recommendations
7. **CSS**: Tailwind JIT compilation

## Security Measures

1. **Row Level Security**: All tables protected
2. **JWT Authentication**: Via Supabase Auth
3. **Role-Based Access**: artisan, buyer, admin
4. **Audit Logging**: All admin actions logged
5. **No Secrets in Code**: Environment-based config
6. **CORS Headers**: Properly configured on edge functions

## Internationalization (i18n)

### Supported Languages
- **English** (en) - LTR
- **Arabic** (ar) - RTL
- **French** (fr) - LTR

### Implementation
- LanguageContext with 40+ translation keys
- `dir` property for RTL support
- `language` state management
- `t()` function for dynamic translation

### RTL Support
- Header navbar
- Product cards text alignment
- All section layouts
- Input fields and forms

## Deployment

### Development
```bash
npm run dev
# Starts Vite dev server on localhost:5173
```

### Build
```bash
npm run build
# Creates optimized production build in dist/
```

### Edge Functions
- Deployed via Supabase CLI
- Runs on Deno runtime
- CORS-enabled for frontend access
- JWT-verified requests

## Environment Variables

Auto-configured by Supabase:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- No IE11 support

## Next Steps for Extension

1. Implement Stripe payment integration
2. Add product image upload to Supabase Storage
3. Create artisan onboarding flow
4. Build admin analytics dashboard
5. Implement email notifications
6. Add multilingual SEO
7. Create mobile app (React Native)
8. Implement AI chatbot for customer support
9. Add video gallery for artisans
10. Create marketplace brand collaborations page
