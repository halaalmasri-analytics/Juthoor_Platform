# Juthoor Platform - Implementation Guide

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (auto-provisioned)

### Installation & Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The application will start at `http://localhost:5173` with hot module reloading enabled.

## Core Implementation Details

### 1. Authentication Flow

#### Signup Process
```typescript
import { useAuth } from './contexts/AuthContext';

const { signUp } = useAuth();

await signUp(
  'artisan@example.com',
  'password123',
  {
    full_name: 'Ahmed Hassan',
    user_type: 'artisan',
    region: 'Nablus',
    craft_specialty: 'Tatreez'
  }
);
```

**What happens:**
1. Supabase Auth creates authentication record
2. User record inserted in `users` table
3. Artisan-specific record created in `artisans` table
4. AuthContext updated with user info
5. User can now access artisan-specific features

#### Login Process
```typescript
const { signIn } = useAuth();

await signIn('artisan@example.com', 'password123');
```

**What happens:**
1. Supabase validates credentials
2. JWT token generated
3. User profile loaded from database
4. AuthContext updated
5. RLS policies activated for user's data

### 2. Product Management

#### Adding a Product (Artisan)
```typescript
import { supabase } from '../lib/supabase';

// Get current artisan ID from auth
const { user } = useAuth();

// Create product
const { data, error } = await supabase
  .from('products')
  .insert([
    {
      artisan_id: user.id,
      category_id: 'category-uuid',
      name_en: 'Traditional Embroidered Thobe',
      name_ar: 'ثوب مطرز تقليدي',
      name_fr: 'Thobe brodé traditionnel',
      description_en: 'Handmade Palestinian embroidered dress...',
      price_usd: 450,
      quantity_available: 1,
      product_status: 'active',
      authenticity_verified: false
    }
  ])
  .select();
```

**Database Flow:**
1. Product inserted into `products` table
2. RLS policy checks artisan_id matches auth.uid()
3. Product visible only to artisan and admin
4. After review, status changes to 'active'
5. Now visible to all buyers

#### Uploading Product Images
```typescript
// Step 1: Create product image record
const { data: imageData } = await supabase
  .from('product_images')
  .insert([
    {
      product_id: productId,
      image_url: 'https://example.com/image.jpg',
      alt_text_en: 'Embroidered Palestinian dress',
      alt_text_ar: 'ثوب فلسطيني مطرز',
      is_primary: true,
      display_order: 1
    }
  ])
  .select();
```

### 3. Product Discovery & Recommendations

#### Browse Products (Buyer)
```typescript
import { supabase } from '../lib/supabase';

// Get active products with artisan details
const { data: products } = await supabase
  .from('products')
  .select('*, artisans(*), categories(*)')
  .eq('product_status', 'active')
  .gte('price_usd', priceMin)
  .lte('price_usd', priceMax)
  .eq('category_id', selectedCategory)
  .order('created_at', { ascending: false })
  .limit(12);
```

#### AI Recommendations
```typescript
import { getProductRecommendations } from '../lib/api';

// Get personalized recommendations
const { products: recommended } =
  await getProductRecommendations(buyerId, limit=6);
```

**How it works:**
1. Edge function queries buyer preferences
2. Filters products by category and price range
3. Sorts by rating and view count
4. Returns 6 best matches

### 4. Shopping Cart

#### Add to Cart
```typescript
import { supabase } from '../lib/supabase';

const { data } = await supabase
  .from('cart_items')
  .insert([
    {
      buyer_id: buyerId,
      product_id: productId,
      quantity: 1
    }
  ])
  .select();
```

#### View Cart
```typescript
const { data: cartItems } = await supabase
  .from('cart_items')
  .select('*, products(*), artisans(*)')
  .eq('buyer_id', buyerId);
```

#### Checkout Process
```typescript
// 1. Create order
const { data: order } = await supabase
  .from('orders')
  .insert([
    {
      buyer_id: buyerId,
      order_number: `ORD-${Date.now()}`,
      total_amount_usd: totalPrice,
      order_status: 'pending',
      shipping_address: address,
      shipping_country: country
    }
  ])
  .select();

// 2. Create order items from cart
for (const cartItem of cartItems) {
  await supabase
    .from('order_items')
    .insert([
      {
        order_id: order.id,
        product_id: cartItem.product_id,
        artisan_id: cartItem.products.artisan_id,
        quantity: cartItem.quantity,
        unit_price_usd: cartItem.products.price_usd,
        subtotal_usd: cartItem.quantity * cartItem.products.price_usd,
        commission_percentage: 10 // 10% to platform
      }
    ]);
}

// 3. Clear cart
await supabase
  .from('cart_items')
  .delete()
  .eq('buyer_id', buyerId);

// 4. Create transaction (when payment confirmed)
await supabase
  .from('transactions')
  .insert([
    {
      order_id: order.id,
      amount_usd: totalPrice,
      payment_method: 'stripe',
      status: 'completed'
    }
  ]);
```

### 5. Artisan Dashboard

#### Get Artisan Stats
```typescript
import { getArtisanStats } from '../lib/api';

const stats = await getArtisanStats(artisanId);
// Returns:
// {
//   totalProducts: 12,
//   averageRating: 4.7,
//   totalViews: 1250,
//   totalSales: 2850.50,
//   totalOrders: 5
// }
```

#### Get Artisan Products
```typescript
const { data: products } = await supabase
  .from('products')
  .select('*')
  .eq('artisan_id', artisanId);
```

#### Update Product Status
```typescript
const { data } = await supabase
  .from('products')
  .update({ product_status: 'inactive' })
  .eq('id', productId)
  .eq('artisan_id', artisanId) // RLS protection
  .select();
```

### 6. Order Tracking

#### Track Order (Buyer)
```typescript
import { trackOrder } from '../lib/api';

const orderDetails = await trackOrder(orderId);
// Returns:
// {
//   order_number: 'ORD-1234567890',
//   order_status: 'shipped',
//   tracking_number: 'FEDEX123456',
//   shipped_at: '2024-03-28T10:30:00Z',
//   order_items: [...]
// }
```

### 7. Reviews & Ratings

#### Leave Review
```typescript
const { data } = await supabase
  .from('reviews')
  .insert([
    {
      product_id: productId,
      buyer_id: buyerId,
      order_id: orderId,
      rating: 5,
      title_en: 'Absolutely beautiful!',
      title_ar: 'جميل جداً!',
      comment_en: 'Perfect craftsmanship...',
      comment_ar: 'صنعة مثالية...'
    }
  ])
  .select();
```

#### Get Product Reviews
```typescript
const { data: reviews } = await supabase
  .from('reviews')
  .select('*')
  .eq('product_id', productId)
  .order('created_at', { ascending: false });
```

### 8. Wishlist Management

#### Add to Wishlist
```typescript
const { data } = await supabase
  .from('wishlists')
  .insert([
    {
      buyer_id: buyerId,
      product_id: productId
    }
  ])
  .select();
```

#### Get Wishlist
```typescript
const { data: wishlist } = await supabase
  .from('wishlists')
  .select('*, products(*)')
  .eq('buyer_id', buyerId);
```

#### Remove from Wishlist
```typescript
const { error } = await supabase
  .from('wishlists')
  .delete()
  .eq('buyer_id', buyerId)
  .eq('product_id', productId);
```

### 9. Heritage Documentation

#### Create Artisan Story
```typescript
const { data } = await supabase
  .from('artisan_stories')
  .insert([
    {
      artisan_id: artisanId,
      title_en: 'The Art of Palestinian Embroidery',
      title_ar: 'فن التطريز الفلسطيني',
      content_en: 'Palestinian embroidery has been...',
      content_ar: 'التطريز الفلسطيني يعود إلى...',
      story_type: 'technique',
      media_type: 'text'
    }
  ])
  .select();
```

#### Record Heritage Audio
```typescript
const { data } = await supabase
  .from('heritage_recordings')
  .insert([
    {
      artisan_id: artisanId,
      title_en: 'Traditional Recipe: Maklouba',
      title_ar: 'وصفة تقليدية: المقلوبة',
      recording_url: 'https://storage.url/audio.m4a',
      duration_seconds: 180,
      rec_language: 'ar',
      transcription_ar: '[Arabic transcription...]'
    }
  ])
  .select();
```

### 10. Multilingual Content Management

#### Handle Multilingual Text
```typescript
import { useLanguage } from './contexts/LanguageContext';

function ProductTitle({ product }) {
  const { language } = useLanguage();

  const getName = () => {
    switch(language) {
      case 'ar': return product.name_ar;
      case 'fr': return product.name_fr;
      default: return product.name_en;
    }
  };

  return <h1>{getName()}</h1>;
}
```

#### RTL Support
```typescript
function Component() {
  const { dir } = useLanguage();

  return (
    <div dir={dir}>
      {/* Content automatically right-aligned for Arabic */}
    </div>
  );
}
```

## Advanced Features

### 1. Commission Calculation

When creating order items, commission is calculated:
```
- Unit Price: $100
- Commission %: 10%
- Platform Commission: $10
- Artisan Earnings: $90
```

Used in monthly artisan payouts.

### 2. RLS Policy Examples

#### Product Access
```sql
-- Anyone can view active products
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO public
  USING (product_status = 'active');

-- Artisans can only edit their own products
CREATE POLICY "Artisans can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (artisan_id = (SELECT id FROM artisans WHERE id = auth.uid()))
  WITH CHECK (artisan_id = (SELECT id FROM artisans WHERE id = auth.uid()));
```

### 3. Performance Tips

- Use `.single()` for single-record queries
- Use `maybeSingle()` when record might not exist
- Cache product descriptions in `ai_product_descriptions`
- Use database indexes on frequently filtered columns
- Implement pagination for large result sets

## Deployment

### Vercel (Frontend)
```bash
npm run build
# Push dist/ to Vercel
```

### Supabase (Backend)
- Database automatically hosted
- Edge Functions auto-deployed
- RLS policies active

## Testing

### Manual Testing Checklist

- [ ] Artisan signup and profile creation
- [ ] Product listing and image upload
- [ ] Buyer browsing and filtering
- [ ] Add to cart and wishlist
- [ ] Checkout process
- [ ] Order confirmation
- [ ] Artisan dashboard stats
- [ ] Review submission
- [ ] Language switching (EN/AR/FR)
- [ ] Mobile responsiveness
- [ ] RTL layout for Arabic

## Troubleshooting

### Common Issues

**Products not showing:**
- Check `product_status = 'active'`
- Verify RLS policies
- Check user permissions

**Cart not persisting:**
- Verify buyer_id matches authenticated user
- Check cart_items RLS policy
- Clear browser cache

**Images not loading:**
- Verify image URLs are accessible
- Check CORS settings
- Ensure image_url field is populated

**Authentication failing:**
- Check `.env` variables are set
- Verify Supabase JWT secret
- Check auth.users table for user record

## Performance Optimization

1. **Database Indexes**: Added on artisan_id, category_id, product_status
2. **Query Optimization**: Use `.select()` to specify columns
3. **Caching**: AI descriptions cached in database
4. **CDN**: Images served from Pexels CDN
5. **Code Splitting**: Components lazy-loaded as needed

## Security Best Practices

1. ✅ Never expose API keys in code
2. ✅ Use environment variables for secrets
3. ✅ RLS policies on all tables
4. ✅ JWT-verified edge functions
5. ✅ No hardcoded user IDs
6. ✅ Validate all user input
7. ✅ Use parameterized queries (Supabase does this)

## Next Development Phases

### Phase 2: Payments
- Stripe integration
- Multi-currency support
- Invoice generation

### Phase 3: Admin Dashboard
- Analytics and reporting
- User management
- Fraud detection

### Phase 4: Mobile App
- React Native implementation
- Push notifications
- Offline support

### Phase 5: AI Features
- Auto product descriptions
- Chatbot support
- Demand forecasting
