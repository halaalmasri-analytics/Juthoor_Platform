// ─── Types ────────────────────────────────────────────────────────────────────

export type Artisan = {
  id: string;
  name: string;
  photo_url: string | null;
  bio_en: string;
  bio_ar: string;
  bio_fr: string;
  location: string;
  region: string;
  craft_specialty: string;
  average_rating: number;
  created_at: string;
  verification_status?: 'verified' | 'pending';
};

export type ProductVariant = {
  id: string;
  name: string;
  name_ar?: string;
  price_usd: number;
  image_url: string;
};

export type Product = {
  id: string;
  artisan_id: string;
  name_en: string;
  name_ar: string;
  name_fr: string;
  description_en: string;
  description_ar: string;
  description_fr: string;
  price_usd: number;
  image_url: string | null;
  category: string;
  product_status: 'active' | 'inactive';
  average_rating: number;
  total_reviews: number;
  authenticity_verified: boolean;
  heritage_story_en?: string;
  heritage_story_ar?: string;
  heritage_story_fr?: string;
  style_en?: string;
  style_ar?: string;
  style_fr?: string;
  features_en?: string[];
  features_ar?: string[];
  created_at: string;
  artisans?: Artisan;
  variants?: ProductVariant[];
};

export type User = {
  id: string;
  email: string;
  user_type: 'artisan' | 'buyer' | 'admin';
  full_name: string;
  profile_photo_url?: string;
};

// ─── Mock Artisans ────────────────────────────────────────────────────────────

export const ARTISANS: Artisan[] = [
  {
    id: 'artisan-1',
    name: 'Ibrahim Al-Natsheh',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    bio_en: 'Ibrahim is a master artisan with Hebronite craft, inheriting the secret of Glassblowing from his ancestors to produce the unique, durable Hebron Blue.',
    bio_ar: 'إبراهيم حرفي ماهر في الزجاج الخليلي، ورث سر نفخ الزجاج من أجداده لإنتاج أزرق الخليل الفريد والمتين.',
    bio_fr: 'Ibrahim est un maître artisan...',
    location: 'Hebron, Palestine',
    region: 'Hebron',
    craft_specialty: 'Hebron Glasswork',
    average_rating: 4.9,
    created_at: '2023-01-01T00:00:00Z',
    verification_status: 'verified',
  },
  {
    id: 'artisan-2',
    name: 'Sami Al-Kurd',
    photo_url: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=200&q=80',
    bio_en: 'Sami is a Nablus-based artisan who combines wood, metal, and textile to create functional home décor that tells the story of Palestinian resilience and daily life.',
    bio_ar: 'سامي حرفي من نابلس يجمع بين الخشب والمعدن والنسيج ليصنع ديكورات...',
    bio_fr: 'Sami est un artisan basé à Naplouse...',
    location: 'Nablus, Palestine',
    region: 'Nablus',
    craft_specialty: 'Wood & Metal Craft',
    average_rating: 4.8,
    created_at: '2023-02-01T00:00:00Z',
    verification_status: 'pending',
  },
  {
    id: 'artisan-3',
    name: 'Layla Al-Kilani',
    photo_url: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&q=80',
    bio_en: 'Layla specializes in merging traditional embroidery with everyday functional items to reflect Palestinian identity with an elegant touch.',
    bio_ar: 'ليلى تتخصص في دمج التطريز التقليدي...',
    bio_fr: 'Layla se spécialise dans la broderie...',
    location: 'Ramallah, Palestine',
    region: 'Ramallah',
    craft_specialty: 'Embroidery (Tatreez)',
    average_rating: 4.9,
    created_at: '2023-03-01T00:00:00Z',
    verification_status: 'verified',
  },
  {
    id: 'artisan-4',
    name: 'Maryam Al-Ali',
    photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    bio_en: 'Maryam is a designer from Gaza, renowned for her unique ability to transform historical dresses into wearable art for daily life, while preserving the precision and symbolic meanings of the embroidery patterns passed down through generations.',
    bio_ar: 'مريم مصممة من غزة...',
    bio_fr: 'Maryam est une designer de Gaza...',
    location: 'Gaza, Palestine',
    region: 'Gaza',
    craft_specialty: 'Traditional Dresses',
    average_rating: 4.9,
    created_at: '2023-04-01T00:00:00Z',
    verification_status: 'pending',
  },
  {
    id: 'artisan-5',
    name: 'Zein Al-Tabari',
    photo_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
    bio_en: 'Zein is a Jerusalem-based artisan who specializes in "Wearable Heritage," miniaturizing ancient textile patterns into contemporary jewelry to keep Palestinian identity close to the heart.',
    bio_ar: 'زين حرفية مقدسية...',
    bio_fr: 'Zein est une artisane de Jérusalem...',
    location: 'Jerusalem, Palestine',
    region: 'Jerusalem',
    craft_specialty: 'Jewelry Design',
    average_rating: 4.8,
    created_at: '2023-05-01T00:00:00Z',
    verification_status: 'verified',
  },
  {
    id: 'artisan-6',
    name: 'Amal Mansour',
    photo_url: '/amal_mansour.png',
    bio_en: 'Amal is a visionary artist who specializes in revitalizing ancestral motifs for the modern, everyday woman. Her workshop in Bethlehem is a sanctuary where heritage meets contemporary accessory design.',
    bio_ar: 'أمل فنانة ذات رؤية تخيلية مميزة تتخصص في إحياء الزخارف الموروثة للمرأة العصرية. ورشتها في بيت لحم هي ملاذ يلتقي فيه التراث مع تصميم الإكسسوارات المعاصرة.',
    bio_fr: 'Amal est une artiste visionnaire...',
    location: 'Bethlehem, Palestine',
    region: 'Bethlehem',
    craft_specialty: 'Accessory Design',
    average_rating: 4.9,
    created_at: '2023-06-01T00:00:00Z',
  },
  {
    id: 'artisan-7',
    name: 'Lina Khoury',
    photo_url: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&q=80',
    bio_en: 'Lina Khoury is a ceramic artist based in Ramallah, specializing in blending traditional Palestinian motifs with modern functional design. Her work focuses on storytelling through everyday objects, especially inspired by olive trees and cultural identity.',
    bio_ar: 'لينا خوري فنانة خزف...',
    bio_fr: 'Lina Khoury est une artiste céramiste...',
    location: 'Ramallah, Palestine',
    region: 'Ramallah',
    craft_specialty: 'Ceramics',
    average_rating: 4.8,
    created_at: '2023-07-01T00:00:00Z',
  },
  {
    id: 'artisan-8',
    name: 'Omar Haddad',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    bio_en: 'Omar Haddad is a visual storyteller and ceramic designer from Nablus. His work captures Palestinian geography, culture, and daily life through detailed illustrations on handcrafted ceramics.',
    bio_ar: 'عمر حداد مصمم فخار من نابلس...',
    bio_fr: 'Omar Haddad est un designer...',
    location: 'Nablus, Palestine',
    region: 'Nablus',
    craft_specialty: 'Hand-painted Ceramics',
    average_rating: 4.7,
    created_at: '2023-08-01T00:00:00Z',
  },
  {
    id: 'artisan-9',
    name: 'Sara Masri',
    photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    bio_en: 'Sara Masri is a contemporary designer from Bethlehem who creates minimalist products inspired by Palestinian identity. Her designs combine modern typography with traditional symbols like the keffiyeh.',
    bio_ar: 'سارة مصري مصممة عصرية...',
    bio_fr: 'Sara Masri est une designer...',
    location: 'Bethlehem, Palestine',
    region: 'Bethlehem',
    craft_specialty: 'Contemporary Design',
    average_rating: 4.9,
    created_at: '2023-09-01T00:00:00Z',
  },
  {
    id: 'artisan-10',
    name: 'Samia Al-Kilani',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    bio_en: 'Samia leads the Ramallah Women\'s Cooperative, a collective dedicated to preserving the intricate "Al-Subul" embroidery techniques that have defined the region\'s textile heritage for generations.',
    bio_ar: 'سامية الكيلاني تقود تعاونية نساء رام الله، وهي مجموعة مكرسة للحفاظ على تقنيات تطريز "السبل" المعقدة.',
    bio_fr: 'Samia dirige la Coopérative des Femmes de Ramallah...',
    location: 'Ramallah, Palestine',
    region: 'Ramallah',
    craft_specialty: 'Traditional Tatreez',
    average_rating: 4.9,
    created_at: '2023-10-01T00:00:00Z',
  },
  {
    id: 'artisan-11',
    name: 'Khalil Jweiles',
    photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
    bio_en: 'A master of Al-Khalil woodworks, Khalil specializes in carving ancient walnut wood, integrating delicate hand-stitched inlay that mirrors the blue skies of Hebron.',
    bio_ar: 'خليل جويلس، معلم في أشغال الخشب في الخليل، يتخصص في نحت خشب الجوز القديم.',
    bio_fr: 'Khalil Jweiles, maître du travail du bois d\'Hébron...',
    location: 'Hebron, Palestine',
    region: 'Hebron',
    craft_specialty: 'Woodwork & Inlay',
    average_rating: 4.8,
    created_at: '2023-11-01T00:00:00Z',
  },
  {
    id: 'artisan-12',
    name: 'Mariam Abu Dagga',
    photo_url: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=200&q=80',
    bio_en: 'Operating from the heart of Gaza, Mariam\'s workshop produces "Resilience Art," where every red stitch symbolizes a heartbeat of survival and a legacy of Palestinian strength.',
    bio_ar: 'مريم أبو دقة تعمل من قلب غزة، حيث تنتج ورشتها "فن الصمود".',
    bio_fr: 'Mariam Abu Dagga travaille au cœur de Gaza...',
    location: 'Gaza City, Palestine',
    region: 'Gaza',
    craft_specialty: 'Heavy Cross-stitch',
    average_rating: 5.0,
    created_at: '2023-12-01T00:00:00Z',
  },
  {
    id: 'artisan-13',
    name: 'Amina Mansour',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    bio_en: 'Amina\'s Workshop in Bethlehem is famous for its durable heritage weaves, blending the colors of the Palestinian flag into everyday functional art.',
    bio_ar: 'ورشة أمينة في بيت لحم مشهورة بمنسوجاتها التراثية المتينة.',
    bio_fr: 'L\'atelier d\'Amina à Bethléem est célèbre pour ses tissages...',
    location: 'Bethlehem, Palestine',
    region: 'Bethlehem',
    craft_specialty: 'Heritage Weaving',
    average_rating: 4.9,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'artisan-14',
    name: 'Fatima & Omar',
    photo_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&q=80',
    bio_en: 'This duo from the Nablus Metal and Fabric Guild masterfully combines rigid metalwork with soft micro-Tatreez, creating contemporary jewelry that honors the geometric heritage of the Old City of Nablus.',
    bio_ar: 'هذا الثنائي من نقابة المعادن والأقمشة في نابلس يجمع بمهارة بين المشغولات المعدنية والتطريز الدقيق، ويصنع مجوهرات معاصرة تكرم التراث الهندسي لمدينة نابلس القديمة.',
    bio_fr: 'Ce duo de la Guilde du Métal et du Tissu de Naplouse...',
    location: 'Nablus, Palestine',
    region: 'Nablus',
    craft_specialty: 'Metal & Micro-Tatreez',
    average_rating: 4.7,
    created_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'artisan-15',
    name: 'Layla Kanaan',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    bio_en: 'Layla Kanaan is a contemporary designer who merges Palestinian heritage with modern fashion, specializing in 3D embroidery and storytelling through textiles.',
    bio_ar: 'ليلى كنعان مصممة معاصرة تدمج التراث الفلسطيني مع الموضة الحديثة، وتتخصص في التطريز ثلاثي الأبعاد ورواية القصص من خلال المنسوجات.',
    bio_fr: 'Layla Kanaan est une designer contemporaine qui fusionne l\'héritage palestinien avec la mode moderne.',
    location: 'Ramallah, Palestine',
    region: 'Ramallah',
    craft_specialty: 'Modern Heritage Clothing',
    average_rating: 4.9,
    created_at: '2024-05-01T00:00:00Z',
    verification_status: 'verified',
  }
];

// ─── Mock Products ────────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  {
    id: 'product-1',
    artisan_id: 'artisan-1',
    name_en: 'Hebron Glass Set (Blue & White)',
    name_ar: 'طقم زجاج الخليل',
    name_fr: 'Ensemble en Verre d\'Hébron',
    description_en: 'Authentic Hebron Glass Set...',
    description_ar: 'طقم زجاج الخليل الأصيل...',
    description_fr: 'Ensemble en Verre d\'Hébron...',
    price_usd: 30,
    image_url: '/large_display_plate.jpeg', // Main fallback
    category: 'Hebron Glasswork',
    product_status: 'active',
    average_rating: 4.9,
    total_reviews: 128,
    authenticity_verified: true,
    created_at: '2024-01-01T00:00:00Z',
    artisans: ARTISANS[0],
    variants: [
      { id: 'v1', name: 'Large Display Plate', price_usd: 30, image_url: '/large_display_plate.jpeg' },
      { id: 'v2', name: 'Medium Plate', price_usd: 22, image_url: '/medium_plate.jpeg' },
      { id: 'v3', name: 'Glass Cup', price_usd: 10, image_url: '/glass_cup.jpeg' }
    ]
  },
  {
    id: 'product-2',
    artisan_id: 'artisan-2',
    name_en: 'Palestinian Heritage Wall Hooks',
    name_ar: 'خطافات جدارية تراثية',
    name_fr: 'Crochets Muraux du Patrimoine',
    description_en: 'Heritage hooks crafted in Nablus...',
    description_ar: 'خطافات تراثية...',
    description_fr: 'Crochets...',
    price_usd: 25,
    image_url: '/key_hook.jpeg', // Main fallback
    category: 'Home Decor',
    product_status: 'active',
    average_rating: 4.8,
    total_reviews: 87,
    authenticity_verified: true,
    created_at: '2024-01-02T00:00:00Z',
    artisans: ARTISANS[1],
    variants: [
      { id: 'v4', name: 'Key Hook (Wooden)', price_usd: 25, image_url: '/key_hook.jpeg' },
      { id: 'v5', name: 'Wall Hook (Large)', price_usd: 40, image_url: '/wall_hook.jpeg' }
    ]
  },
  {
    id: 'product-3',
    artisan_id: 'artisan-3',
    name_en: 'Embroidered Mirrors',
    name_ar: 'مرايا مطرزة',
    name_fr: 'Miroirs Brodés',
    description_en: 'Hand-stitched embroidered mirrors...',
    description_ar: 'مرايا مطرزة يدوياً...',
    description_fr: 'Miroirs...',
    price_usd: 18,
    image_url: '/wall_mirror.jpeg', // Main fallback
    category: 'Accessories',
    product_status: 'active',
    average_rating: 4.9,
    total_reviews: 64,
    authenticity_verified: true,
    created_at: '2024-01-03T00:00:00Z',
    artisans: ARTISANS[2],
    variants: [
      { id: 'v6', name: 'Wall Mirror (Green/Beige)', price_usd: 65, image_url: '/wall_mirror.jpeg' },
      { id: 'v7', name: 'Wedding Souvenirs', price_usd: 12, image_url: '/wedding_souvneirs.jpeg' }
    ]
  },
  {
    id: 'product-4',
    artisan_id: 'artisan-4',
    name_en: 'Palestinian Heritage Dresses',
    name_ar: 'فساتين تراثية فلسطينية',
    name_fr: 'Robes Palestiniennes Traditionnelles',
    description_en: 'Traditional heritage thobes...',
    description_ar: 'أثواب تراثية...',
    description_fr: 'Robes...',
    price_usd: 180,
    image_url: '/pink_dress.jpeg', // Main fallback
    category: 'Clothing',
    product_status: 'active',
    average_rating: 4.9,
    total_reviews: 43,
    authenticity_verified: true,
    created_at: '2024-01-04T00:00:00Z',
    artisans: ARTISANS[3],
    variants: [
      { id: 'v8', name: 'Pink and Green Dress', price_usd: 180, image_url: '/pink_dress.jpeg' },
      { id: 'v9', name: 'Traditional Red Dress', price_usd: 220, image_url: '/red_dress.jpeg' }
    ]
  },
  {
    id: 'product-5',
    artisan_id: 'artisan-5',
    name_en: 'Tatreez Jewelry',
    name_ar: 'مجوهرات التطريز',
    name_fr: 'Bijoux Brodés',
    description_en: 'Minimalist embroidered jewelry...',
    description_ar: 'مجوهرات تطريز...',
    description_fr: 'Bijoux...',
    price_usd: 35,
    image_url: '/tatreeze_earrning.jpeg', // Main fallback
    category: 'Jewelry',
    product_status: 'active',
    average_rating: 4.8,
    total_reviews: 89,
    authenticity_verified: true,
    created_at: '2024-01-05T00:00:00Z',
    artisans: ARTISANS[4],
    variants: [
      { id: 'v10', name: 'Tatreez Earrings', price_usd: 35, image_url: '/tatreeze_earrning.jpeg' },
      { id: 'v11', name: 'Palestine Map Necklace', price_usd: 45, image_url: '/map_necklace.jpeg' },
      { id: 'v12', name: 'Necklace Pal', price_usd: 50, image_url: '/necklace_pal.jpg' }
    ]
  },
  {
    id: 'product-6',
    artisan_id: 'artisan-6',
    name_en: 'Tatreez Bags',
    name_ar: 'حقائب التطريز',
    name_fr: 'Sacs Brodés',
    description_en: 'Contemporary tatreez bags...',
    description_ar: 'حقائب تطريز عصرية...',
    description_fr: 'Sacs...',
    price_usd: 85,
    image_url: '/zaitona_bag.jpeg', // Main fallback
    category: 'Accessories',
    product_status: 'active',
    average_rating: 4.9,
    total_reviews: 52,
    authenticity_verified: true,
    created_at: '2024-01-06T00:00:00Z',
    artisans: ARTISANS[5],
    variants: [
      { id: 'v13', name: 'Zaitouna Bag', price_usd: 85, image_url: '/zaitona_bag.jpeg' },
      { id: 'v14', name: 'Ard Al-Khayr Bag', price_usd: 120, image_url: '/scarf.jpeg' } // The user mapped Ard Al-Khayr Bag to scarf.jpeg seemingly
    ]
  },

  {
    id: 'product-8',
    artisan_id: 'artisan-8',
    name_en: 'Palestine Map Ceramic Plate',
    name_ar: 'طبق سيراميك خريطة فلسطين',
    name_fr: 'Assiette Carte de la Palestine',
    description_en: 'A unique ceramic plate shaped like the map of Palestine, decorated with vibrant illustrations of cities, fruits, landmarks, and cultural symbols. Arabic calligraphy runs through the center, celebrating identity and heritage. Ideal as a decorative piece or meaningful gift.',
    description_ar: 'طبق خريطة...',
    description_fr: 'Assiette...',
    price_usd: 26.0,
    image_url: '/map_plate.png',
    category: 'Ceramics',
    product_status: 'active',
    average_rating: 4.7,
    total_reviews: 89,
    authenticity_verified: true,
    created_at: '2024-01-08T00:00:00Z',
    artisans: ARTISANS[7]
  },
  {
    id: 'product-9',
    artisan_id: 'artisan-9',
    name_en: '“Love is Palestine” Keffiyeh Mug',
    name_ar: 'كوب “الحب فلسطين” الكوفية',
    name_fr: 'Tasse “Love is Palestine”',
    description_en: 'A minimalist ceramic mug featuring a bold keffiyeh pattern wrapped around the top and elegant Arabic calligraphy reading “الحب فلسطين” (Love is Palestine). A perfect blend of modern simplicity and cultural pride.',
    description_ar: 'كوب كوفية...',
    description_fr: 'Tasse...',
    price_usd: 15.0,
    image_url: '/pal_cup.png',
    category: 'Ceramics',
    product_status: 'active',
    average_rating: 4.9,
    total_reviews: 156,
    authenticity_verified: true,
    created_at: '2024-01-09T00:00:00Z',
    artisans: ARTISANS[8]
  },
  {
    id: 'product-10',
    artisan_id: 'artisan-10',
    name_en: 'The Pomegranate Bag (حقيبة الرمان)',
    name_ar: 'حقيبة الرمان',
    name_fr: 'Le Sac à Grenade',
    description_en: 'A masterpiece of Palestinian craftsmanship, hand-embroidered by Samia Al-Kilani. Featuring the ancient "Al-Subul" (pomegranate) and cypress tree motifs, this bag is a living symbol of fertility and Palestinian resilience. Each intricate stitch tells a story of connection to the land, set against premium flax canvas and finished with handles carved from heritage olive wood. Certified Grade A+ fine canvas.',
    description_ar: 'شاهكار من الحرفية الفلسطينية، مطرز يدوياً من قبل سامية الكيلاني. يتميز بزخارف "السبل" (الرمان) وسرو القديمة، وهي رموز للخصوبة والصمود الفلسطيني.',
    description_fr: 'Un chef-d\'œuvre de l\'artisanat palestinien...',
    price_usd: 115,
    image_url: '/ardalkhair_bag.jpeg',
    category: 'Accessories',
    product_status: 'active',
    average_rating: 4.9,
    total_reviews: 189,
    authenticity_verified: true,
    created_at: '2024-03-01T00:00:00Z',
    artisans: ARTISANS[9],
    heritage_story_en: 'The pomegranate has been a symbol of fertility and prosperity in Palestine for millennia, while the cypress tree represents the deep roots and unwavering steadiness of the people.'
  },
  {
    id: 'product-11',
    artisan_id: 'artisan-11',
    name_en: 'Carved Walnut Heritage Mirror (Blue Tatreez Inlay)',
    name_ar: 'مراية "يافا" المطرزة',
    name_fr: 'Miroir du Patrimoine en Noyer',
    description_en: 'Hand-carved from century-old walnut wood by Khalil Jweiles, this dual-sided compact mirror features an authentic, hand-stitched blue-on-white embroidery inlay. The central cypress tree design is inspired by historic Hebron motifs, blending the strength of wood with the delicacy of Palestinian thread. A perfect carry-piece of heritage.',
    description_ar: 'منحوت يدوياً من خشب الجوز القديم من قبل خليل جويلس، يتميز هذا المرآة المدمجة بتطريز يدوي أزرق على أبيض.',
    description_fr: 'Sculpté à la main dans du bois de noyer séculaire...',
    price_usd: 78,
    image_url: '/blue_poket_mirror.jpeg',
    category: 'Accessories',
    product_status: 'active',
    average_rating: 4.8,
    total_reviews: 142,
    authenticity_verified: true,
    created_at: '2024-03-02T00:00:00Z',
    artisans: ARTISANS[10],
    heritage_story_en: 'In Hebron, woodcarving is a family legacy. This mirror integrates the "Yaffa" inspiration, reminding the owner of the blue horizons and the steadfastness of the olive and cypress groves.'
  },

  {
    id: 'product-13',
    artisan_id: 'artisan-13',
    name_en: 'Heritage Woven Wristlet Keychains (Set of 3)',
    name_ar: 'ميداليات منسوجة تراثية',
    name_fr: 'Porte-clés Tissés du Patrimoine',
    description_en: 'A collection of three durable, high-quality woven wristlets from Amina’s Workshop in Bethlehem. This set includes a "Flag of Palestine" weave, a minimalist monochrome geometric pattern, and a traditional red-and-black Tatreez weave. Equipped with high-grade stainless steel hardware for a lifetime of use.',
    description_ar: 'مجموعة من ثلاث ميداليات عالية الجودة من ورشة أمينة في بيت لحم، تجمع بين ألوان العلم والتراث.',
    description_fr: 'Une collection de trois dragonnes tissées de haute qualité...',
    price_usd: 28,
    image_url: '/brace_pal.png',
    category: 'Accessories',
    product_status: 'active',
    average_rating: 4.9,
    total_reviews: 304,
    authenticity_verified: true,
    created_at: '2024-03-04T00:00:00Z',
    artisans: ARTISANS[12],
    heritage_story_en: 'Bethlehem has always been a crossroads of cultures and crafts. These woven bands use the same techniques as traditional sashes, bringing history into a modern functional accessory.'
  },
  {
    id: 'product-14',
    artisan_id: 'artisan-14',
    name_en: 'The Nabulsia Accessory Set',
    name_ar: 'طقم الإكسسوار النابلسي',
    name_fr: 'La Parure Accessoire de Naplouse',
    description_en: 'A breathtaking jewelry set born from the heart of Nablus. Crafted by the Nablus Metal and Fabric Guild, these pieces feature incredibly precise Micro-Tatreez on off-white fabric. The complex geometric patterns are a direct tribute to the historic arches and ancient architecture of the Old City of Nablus. It showcases the legendary precision of Nabulsi women, whose embroidery is so fine it feels like thread-painting. Includes delicate fringe earrings and a matching rigid metal cuff bracelet.',
    description_ar: 'طقم إكسسوار مذهل يجمع بين المعدن والتطريز الدقيق من نابلس، مستوحى من العمارة التاريخية والبلدة القديمة في نابلس. يبرز الدقة الأسطورية للمرأة النابلسية في التطريز الدقيق.',
    description_fr: 'Une parure de bijoux époustouflante née au cœur de Naplouse...',
    price_usd: 55,
    image_url: '/earrings_pal.webp',
    category: 'Jewelry',
    product_status: 'active',
    average_rating: 4.7,
    total_reviews: 112,
    authenticity_verified: true,
    created_at: '2024-03-05T00:00:00Z',
    artisans: ARTISANS[13],
    heritage_story_en: 'The Old City of Nablus is a treasure trove of geometric inspiration. This set celebrates the "Micro-Tatreez" mastery that has been passed down through generations of Nabulsi women, symbolizing the city\'s enduring cultural elegance.'
  },
  {
    id: 'product-15',
    artisan_id: 'artisan-15',
    name_en: 'The Map Hoodie',
    name_ar: 'هودي الخريطة',
    name_fr: 'Le Hoodie Carte',
    description_en: 'Premium black cotton hoodie featuring a 3D hand-embroidered map of Palestine, aligned vertically with modern heritage threadwork.',
    description_ar: 'سترة قطنية سوداء فاخرة تتميز بخريطة فلسطين مطرزة يدوياً ثلاثية الأبعاد، مصطفة عمودياً مع خيوط التراث الحديثة.',
    description_fr: 'Hoodie en coton noir de qualité supérieure avec une carte de la Palestine brodée à la main en 3D.',
    price_usd: 110,
    image_url: '/hoddie_map.jpeg',
    category: 'Clothing',
    style_en: 'Modern Heritage',
    style_ar: 'تراث حديث',
    style_fr: 'Héritage Moderne',
    features_en: ['Premium black cotton', '3D hand-embroidered map', 'Modern heritage threadwork'],
    features_ar: ['قطن أسود فاخر', 'خريطة مطرزة يدوياً ثلاثية الأبعاد', 'خيوط تراثية حديثة'],
    product_status: 'active',
    average_rating: 4.9,
    total_reviews: 0,
    authenticity_verified: true,
    created_at: '2024-05-06T00:00:00Z',
    artisans: {
      id: 'artisan-15',
      name: 'Layla Kanaan',
      photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
      bio_en: 'Layla Kanaan is a contemporary designer...',
      bio_ar: 'ليلى كنعان...',
      bio_fr: 'Layla Kanaan...',
      location: 'Ramallah, Palestine',
      region: 'Ramallah',
      craft_specialty: 'Modern Heritage Clothing',
      average_rating: 4.9,
      created_at: '2024-05-01T00:00:00Z'
    }
  },
  {
    id: 'product-16',
    artisan_id: 'artisan-15',
    name_en: 'The Key Hoodie',
    name_ar: 'هودي المفتاح',
    name_fr: 'Le Hoodie Clé',
    description_en: 'Sand-beige luxury hoodie featuring a handcrafted embroidery of the "Key of Return," topped with "PALESTINE" in bold, vibrant red 3D stitching.',
    description_ar: 'سترة فاخرة باللون البيج الرملي تتميز بتطريز يدوي لـ "مفتاح العودة"، تعلوها كلمة "فلسطين" بخياطة حمراء بارزة ثلاثية الأبعاد.',
    description_fr: 'Hoodie de luxe beige sable avec une broderie artisanale de la "Clé du Retour".',
    price_usd: 125,
    image_url: '/key_hoodie.jpeg',
    category: 'Clothing',
    style_en: 'Modern Heritage',
    style_ar: 'تراث حديث',
    style_fr: 'Héritage Moderne',
    features_en: ['Sand-beige luxury fabric', 'Key of Return embroidery', 'Red 3D stitching'],
    features_ar: ['قماش فاخر باللون البيج الرملي', 'تطريز مفتاح العودة', 'خياطة حمراء ثلاثية الأبعاد'],
    product_status: 'active',
    average_rating: 5.0,
    total_reviews: 0,
    authenticity_verified: true,
    created_at: '2024-05-06T00:00:00Z',
    artisans: {
      id: 'artisan-15',
      name: 'Layla Kanaan',
      photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
      bio_en: 'Layla Kanaan is a contemporary designer...',
      bio_ar: 'ليلى كنعان...',
      bio_fr: 'Layla Kanaan...',
      location: 'Ramallah, Palestine',
      region: 'Ramallah',
      craft_specialty: 'Modern Heritage Clothing',
      average_rating: 4.9,
      created_at: '2024-05-01T00:00:00Z'
    }
  },
  {
    id: 'product-17',
    artisan_id: 'artisan-15',
    name_en: 'Juthoor Heritage Wall Hanging',
    name_ar: 'لوحة جدارية تراثية من جذور',
    name_fr: 'Suspension Murale Patrimoine Juthoor',
    description_en: 'Hand-embroidered Palestinian Tatreez on natural linen. Features red and beige motifs, wooden rod, and fringe tassels.',
    description_ar: 'تطريز فلسطيني يدوي على كتان طبيعي. تتميز بزخارف حمراء وبيج وقضيب خشبي وشرابات.',
    description_fr: 'Tatreez palestinien brodé à la main sur lin naturel.',
    price_usd: 85,
    image_url: '/carbet.jpeg',
    category: 'Home Decor',
    features_en: ['Natural linen', 'Red and beige motifs', 'Wooden rod', 'Fringe tassels'],
    features_ar: ['كتان طبيعي', 'زخارف حمراء وبيج', 'قضيب خشبي', 'شرابات'],
    product_status: 'active',
    average_rating: 4.8,
    total_reviews: 0,
    authenticity_verified: true,
    created_at: '2024-05-06T00:00:00Z',
    artisans: {
      id: 'artisan-15',
      name: 'Layla Kanaan',
      photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
      bio_en: 'Layla Kanaan is a contemporary designer...',
      bio_ar: 'ليلى كنعان...',
      bio_fr: 'Layla Kanaan...',
      location: 'Ramallah, Palestine',
      region: 'Ramallah',
      craft_specialty: 'Modern Heritage Clothing',
      average_rating: 4.9,
      created_at: '2024-05-01T00:00:00Z'
    }
  }
];

// ─── Demo User ────────────────────────────────────────────────────────────────

export const DEMO_ARTISAN_USER: User = {
  id: 'artisan-1',
  email: 'fatima@juthoor.ps',
  user_type: 'artisan',
  full_name: 'Ibrahim Al-Natsheh',
  profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
};

export const DEMO_ADMIN_USER: User = {
  id: 'admin-1',
  email: 'admin@juthoor.ps',
  user_type: 'admin',
  full_name: 'System Admin',
};

// ─── Artisan Dashboard Static Stats ──────────────────────────────────────────

export const ARTISAN_DASHBOARD_STATS = {
  totalProducts: 2,
  averageRating: 4.85,
  totalSales: 3480,
  totalOrders: 78,
};

export const ARTISAN_DASHBOARD_PRODUCTS: Product[] = PRODUCTS.filter(
  (p) => p.artisan_id === 'artisan-1'
);
