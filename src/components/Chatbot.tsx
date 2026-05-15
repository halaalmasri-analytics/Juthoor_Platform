import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Bot, User as UserIcon, 
  Sparkles, Loader2, Maximize2, Minimize2 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PRODUCTS, ARTISANS } from '../lib/staticData';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

export function Chatbot() {
  const { user } = useAuth();
  const { dir, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length === 0) {
      const greeting = language === 'ar' 
        ? `مرحباً! أنا مساعد جذور الذكي، أعمل بتقنية الذكاء الاصطناعي. كيف يمكنني مساعدتك اليوم؟`
        : `Hello! I'm your Juthoor AI Assistant, powered by Groq. How can I help you today?`;
      
      setMessages([{
        id: '1',
        role: 'assistant',
        content: greeting,
        timestamp: new Date()
      }]);
    }
  }, [language]);

  const getSystemPrompt = (role: string) => {
    const isAr = language === 'ar';

    const platformData = `
=== JUTHOOR PLATFORM — COMPLETE REFERENCE DATA ===

📍 ARTISANS BY CITY & SPECIALTY:

NABLUS (specializes in Tatreez Embroidery & Metal Craft):
  • Sami Al-Kurd — Wood & Metal Craft | Rating 4.8 | Products: Heritage Wall Hooks ($25–$40)
  • Omar Haddad — Hand-painted Ceramics | Rating 4.7 | Products: Palestine Map Ceramic Plate ($26)
  • Fatima & Omar — Metal & Micro-Tatreez | Rating 4.7 | Products: The Nabulsia Accessory Set ($55)

HEBRON (specializes in Glasswork & Woodwork):
  • Ibrahim Al-Natsheh — Hebron Glasswork | Rating 4.9 | Products: Hebron Glass Set (Cup $10, Medium Plate $22, Large Plate $30)
  • Khalil Jweiles — Woodwork & Inlay | Rating 4.8 | Products: Carved Walnut Heritage Mirror ($78)

RAMALLAH (specializes in Tatreez, Ceramics & Modern Heritage):
  • Layla Al-Kilani — Embroidery/Tatreez | Rating 4.9 | Products: Embroidered Mirrors ($18, Wall Mirror $65)
  • Lina Khoury — Ceramics | Rating 4.8 | (ceramic specialist)
  • Samia Al-Kilani — Traditional Tatreez | Rating 4.9 | Products: The Pomegranate Bag ($115) — 189 reviews
  • Layla Kanaan — Modern Heritage Clothing | Rating 4.9 | Products: Map Hoodie ($110), Key Hoodie ($125), Heritage Wall Hanging ($85)

JERUSALEM (specializes in Jewelry & Traditional Textiles):
  • Zein Al-Tabari — Jewelry Design | Rating 4.8 | Products: Tatreez Earrings ($35), Map Necklace ($45), Necklace Pal ($50)

GAZA (specializes in Traditional Dresses & Cross-stitch):
  • Maryam Al-Ali — Traditional Dresses | Rating 4.9 | Products: Pink Heritage Dress ($180), Traditional Red Dress ($220)
  • Mariam Abu Dagga — Heavy Cross-stitch | Rating 5.0 ⭐ (highest rated artisan on platform)

BETHLEHEM (specializes in Accessories & Heritage Weaving):
  • Amal Mansour — Accessory Design | Rating 4.9 | Products: Tatreez Bags — Zaitouna Bag ($85), Ard Al-Khayr Bag ($120)
  • Sara Masri — Contemporary Design | Rating 4.9 | Products: "Love is Palestine" Keffiyeh Mug ($15)
  • Amina Mansour — Heritage Weaving | Rating 4.9 | Products: Heritage Woven Wristlet Keychains Set of 3 ($28) — 304 reviews, BEST SELLER

---

🛍️ PRODUCTS BY CATEGORY WITH SPECIFIC NAMES & PRICES:

TATREEZ DRESSES & CLOTHING ($80–$220):
  • Pink Heritage Dress — $180 | By Maryam Al-Ali, Gaza | Hand-embroidered tatreez
  • Traditional Red Dress — $220 | By Maryam Al-Ali, Gaza | Premium heritage thobe
  • The Map Hoodie — $110 | By Layla Kanaan, Ramallah | 3D embroidered Palestine map
  • The Key Hoodie — $125 | By Layla Kanaan, Ramallah | "Key of Return" embroidery, rated 5.0/5

OLIVE WOOD CRAFTS ($25–$85):
  • Heritage Wall Hooks (Key Hook) — $25 | By Sami Al-Kurd, Nablus | Functional olive wood art
  • Heritage Wall Hooks (Large) — $40 | By Sami Al-Kurd, Nablus
  • Juthoor Heritage Wall Hanging — $85 | By Layla Kanaan, Ramallah | Natural linen & wooden rod

CERAMICS & POTTERY ($10–$80):
  • Hebron Glass Cup — $10 | By Ibrahim Al-Natsheh, Hebron | Authentic Hebron blue glass
  • "Love is Palestine" Keffiyeh Mug — $15 | By Sara Masri, Bethlehem | Rating 4.9, 156 reviews
  • Hebron Glass Medium Plate — $22 | By Ibrahim Al-Natsheh, Hebron
  • Palestine Map Ceramic Plate — $26 | By Omar Haddad, Nablus | Map of Palestine with Arabic calligraphy
  • Hebron Glass Large Display Plate — $30 | By Ibrahim Al-Natsheh, Hebron

HANDWOVEN & TATREEZ BAGS ($40–$120):
  • Tatreez Bags - Zaitouna Bag — $85 | By Amal Mansour, Bethlehem | Contemporary tatreez design
  • The Pomegranate Bag — $115 | By Samia Al-Kilani, Ramallah | Al-Subul motifs, olive wood handles, 189 reviews
  • Tatreez Bags - Ard Al-Khayr Bag — $120 | By Amal Mansour, Bethlehem | Premium heritage bag

JEWELRY ($35–$55):
  • Tatreez Earrings — $35 | By Zein Al-Tabari, Jerusalem
  • Map Necklace — $45 | By Zein Al-Tabari, Jerusalem | Palestine map pendant
  • The Nabulsia Accessory Set (Earrings + Bracelet) — $55 | By Fatima & Omar, Nablus | Micro-tatreez on metal

ACCESSORIES & GIFTS ($12–$78):
  • Wedding Souvenirs set — $12 | By Layla Al-Kilani, Ramallah
  • Heritage Woven Wristlet Keychains (Set of 3) — $28 | By Amina Mansour, Bethlehem | BESTSELLER, 304 reviews
  • Carved Walnut Heritage Mirror — $78 | By Khalil Jweiles, Hebron | Walnut wood + blue tatreez inlay

---

💰 PRICE RANGES SUMMARY:
  • Budget-friendly (under $30): Glass cups, mugs, keychains, wedding souvenirs, ceramic plates
  • Mid-range ($30–$80): Jewelry, glass sets, mirrors, wall hooks, accessories
  • Premium ($80–$130): Tatreez bags, hoodies, wall hangings, heritage bags
  • Luxury ($130–$220): Heritage thobes and traditional embroidered dresses

🏆 TOP 3 BESTSELLERS:
  1. Heritage Woven Wristlet Keychains — $28 (304 reviews)
  2. The Pomegranate Bag — $115 (189 reviews)
  3. "Love is Palestine" Keffiyeh Mug — $15 (156 reviews)
`;

    let systemPrompt = `You are the Juthoor AI Assistant — a knowledgeable and warm guide for the Juthoor Palestinian Artisan Marketplace.

CRITICAL RULES:
1. ALWAYS cite specific product names, exact prices, and artisan names from the data below.
2. NEVER give vague or generic answers — every answer must reference real data.
3. When asked about a category (dresses, bags, ceramics, etc.), list the specific products with their prices.
4. Respond in ${isAr ? 'Arabic' : 'English'} language.
5. Be warm, culturally respectful, and proud of Palestinian heritage.

${platformData}
`;

    if (role === 'buyer') {
      systemPrompt += `
ROLE: Helping a BUYER.
- When they ask about products, give specific product names and prices from the data.
- For category questions (e.g. "do you have bags?"), list ALL relevant products with prices.
- Suggest budget options and premium options when relevant.
- Do NOT share artisan business/sales data.
- Highlight the cultural significance and heritage story of products when relevant.
`;
    } else if (role === 'artisan') {
      const myProducts = PRODUCTS.filter(p => p.artisan_id === user?.id);
      systemPrompt += `
ROLE: Helping ARTISAN "${user?.full_name || 'our artisan'}".
My products listed on Juthoor: ${JSON.stringify(myProducts.map(p => ({ name: p.name_en, price: p.price_usd, rating: p.average_rating, reviews: p.total_reviews })))}
- Provide advice on product performance, pricing strategy, and presentation.
- Compare their ratings to platform averages (4.85 avg).
- Do NOT reveal buyer personal data or other artisans' private sales figures.
`;
    } else if (role === 'admin') {
      systemPrompt += `
ROLE: Helping a PLATFORM ADMIN.
- Full access to all platform data.
- Platform stats: 15 artisans, 15+ products, 6 cities covered, +9% MoM revenue growth.
- Best category: Accessories. Top-rated artisan: Mariam Abu Dagga (5.0). Most reviewed: Wristlet Keychains (304 reviews).
- Provide strategic insights on category trends, artisan performance gaps, and growth opportunities.
`;
    } else {
      systemPrompt += `
ROLE: Helping a GUEST VISITOR.
- Introduce Juthoor as Palestine's premier artisan marketplace.
- Share 2-3 specific products as examples with real names and prices.
- Encourage them to create an account to purchase.
`;
    }

    return systemPrompt;
  };

  const generateAiResponse = async (userQuery: string) => {
    console.log('Chatbot: Generating response for query:', userQuery);
    
    // FALLBACK LOGIC: If API fails or key is missing
    const getFallbackResponse = (query: string) => {
      const q = query.toLowerCase();
      const isAr = /[\u0600-\u06FF]/.test(q);

      // 1. Check for product mentions
      const matchedProduct = PRODUCTS.find(p => 
        q.includes(p.name_en.toLowerCase()) || (p.name_ar && q.includes(p.name_ar))
      );
      if (matchedProduct) {
        return isAr 
          ? `نعم، لدينا ${matchedProduct.name_ar}. سعره ${matchedProduct.price_usd}$ وهو من فئة ${matchedProduct.category}. هل تود معرفة المزيد؟`
          : `Yes, we have the ${matchedProduct.name_en}. It costs $${matchedProduct.price_usd} and belongs to the ${matchedProduct.category} category. Would you like to know more?`;
      }

      // 2. Check for general questions
      if (q.includes('price') || q.includes('cost') || q.includes('سعر')) {
        return isAr ? "تتراوح أسعارنا بين 12$ و 220$. هل تبحث عن فئة معينة؟" : "Our prices range from $12 to $220. Are you looking for a specific category?";
      }
      if (q.includes('artisan') || q.includes('حرفي')) {
        return isAr ? "نحن نعمل مع أكثر من 150 حرفياً فلسطينياً مبدعاً. يمكنك رؤيتهم في صفحة الحرفيين." : "We work with over 150 talented Palestinian artisans. You can see them on the Artisans page.";
      }
      if (q.includes('location') || q.includes('shipping') || q.includes('شحن')) {
        return isAr ? "نشحن من فلسطين إلى جميع أنحاء العالم! يستغرق الشحن عادة من 7 إلى 14 يوماً." : "We ship from Palestine to the whole world! Shipping usually takes 7-14 days.";
      }

      return isAr 
        ? "أنا هنا للمساعدة! يمكنك سؤالي عن المنتجات، الأسعار، أو قصص الحرفيين الفلسطينيين."
        : "I'm here to help! You can ask me about products, prices, or the stories of our Palestinian artisans.";
    };

    if (!GROQ_API_KEY) {
      console.warn('Chatbot: VITE_GROQ_API_KEY is missing. Using local fallback.');
      return getFallbackResponse(userQuery);
    }

    const role = user?.user_type || 'guest';
    const isArQuery = /[\u0600-\u06FF]/.test(userQuery);
    const targetLanguage = isArQuery ? 'Arabic' : 'English';

    // Build a self-contained context block embedded directly in the user message
    const contextBlock = `
CONTEXT — Juthoor Palestinian Artisan Marketplace:

PRODUCTS & PRICES:
- Tatreez Dresses: Pink Heritage Dress $180, Traditional Red Dress $220 (by Maryam Al-Ali, Gaza)
- Clothing: Map Hoodie $110, Key Hoodie $125 (by Layla Kanaan, Ramallah)
- Bags: Zaitouna Tatreez Bag $85, Pomegranate Bag $115, Ard Al-Khayr Bag $120
- Ceramics & Glass: Hebron Glass Cup $10, Keffiyeh Mug $15, Medium Plate $22, Ceramic Map Plate $26, Large Plate $30
- Accessories: Wedding Souvenirs $12, Keychains Set $28, Tatreez Earrings $35, Map Necklace $45, Nabulsia Set $55, Walnut Mirror $78, Wall Hanging $85
- Jewelry: Tatreez Earrings $35, Map Necklace $45, Necklace Pal $50, Nabulsia Set $55
- Home Decor: Heritage Wall Hooks $25-$40, Heritage Wall Hanging $85

ARTISANS BY CITY:
- Nablus: Sami Al-Kurd (wood/metal), Omar Haddad (ceramics), Fatima & Omar (micro-tatreez jewelry)
- Hebron: Ibrahim Al-Natsheh (glasswork, rating 4.9), Khalil Jweiles (woodwork, rating 4.8)
- Ramallah: Layla Al-Kilani (tatreez/embroidery), Samia Al-Kilani (tatreez bags), Layla Kanaan (modern heritage clothing)
- Jerusalem: Zein Al-Tabari (jewelry design)
- Gaza: Maryam Al-Ali (traditional dresses), Mariam Abu Dagga (cross-stitch, rating 5.0 - highest rated)
- Bethlehem: Amal Mansour (tatreez bags), Sara Masri (contemporary/mugs), Amina Mansour (heritage weaving, 304 reviews)

PRICE RANGES: Budget <$30 | Mid $30-$80 | Premium $80-$130 | Luxury $130-$220
TOP SELLERS: Wristlet Keychains $28 (304 reviews), Pomegranate Bag $115 (189 reviews), Keffiyeh Mug $15 (156 reviews)
${role === 'admin' ? '\nADMIN DATA: 15 artisans, 15 products, 6 cities, +9% MoM revenue, best category: Accessories' : ''}
${role === 'artisan' ? `\nARTISAN RULES: Only discuss this artisan's own products. Do not reveal buyer info or other artisans' sales.` : ''}
${role === 'buyer' ? '\nBUYER RULES: Do not share artisan financial/sales data. Help buyer discover and compare products.' : ''}

INSTRUCTIONS: You are the Juthoor AI Assistant. Answer ONLY using the data above. Always cite specific product names and prices. Never give generic responses. Respond ONLY in ${targetLanguage}. Do not translate the user's question, just answer in ${targetLanguage}.
 
 USER QUESTION: ${userQuery}

Answer based only on the context above:`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { 
              role: 'system', 
              content: "You are Juthoor's AI assistant for a Palestinian artisan marketplace. You help buyers and artisans with products, orders, shipping, payments, and anything related to the platform.\n\nCRITICAL RULE: Always reply in the same language the user writes in.\n- If the user writes in Arabic → respond in Arabic only\n- If the user writes in English → respond in English only\n- Never mix languages in one response\n\nPlatform details:\n- Juthoor sells authentic Palestinian handmade products: tatreez embroidery, olive oil, ceramics, bags, wall art, and more\n- Products are from Palestinian cities: Nablus, Hebron, Ramallah, Jerusalem, and others\n- Users can be Buyers or Artisans\n- Payment methods: credit/debit card, PayPal, Reflect\n- Features: wishlist, order history, Heritage Authenticity Badge\n- Tagline: Rooted in Palestine, Reaching the World\n\nBe warm, helpful, and concise."
            },
            { role: 'user', content: contextBlock }
          ],
          max_tokens: 1024,
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('Chatbot: API error:', response.status, err);
        throw new Error('API Error');
      }

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content;
      }
      throw new Error('Invalid Response');
    } catch (error) {
      console.error('Chatbot: API failed, using fallback:', error);
      return getFallbackResponse(userQuery);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const aiResponse = await generateAiResponse(input);
    
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-green-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 group"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-green-900 px-3 py-1 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-green-100">
          {language === 'ar' ? 'اسأل جذور' : 'Ask Juthoor'}
        </span>
      </button>
    );
  }

  return (
    <div 
      className={`fixed ${isMinimized ? 'bottom-6' : 'bottom-6 md:bottom-10'} ${dir === 'rtl' ? 'left-6 md:left-10' : 'right-6 md:right-10'} z-50 flex flex-col transition-all duration-300 ease-in-out`}
      style={{ width: isMinimized ? 'auto' : 'min(90vw, 450px)' }}
    >
      <div className="bg-green-900 text-white p-4 rounded-t-[2rem] flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Bot className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm">{language === 'ar' ? 'مساعد جذور الذكي' : 'Juthoor AI Assistant'}</h3>
            <div className="flex items-center gap-1 text-[10px]">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-200 uppercase tracking-widest font-bold">Groq Powered</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-lg transition">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div ref={scrollRef} className="bg-stone-50 h-[450px] overflow-y-auto p-4 space-y-4 border-x border-green-100 shadow-inner no-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                <div className={`max-w-[85%] flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-green-900 text-white' : 'bg-white text-green-900 shadow-sm border border-green-100'}`}>
                    {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-amber-500" />}
                  </div>
                  <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-green-900 text-white rounded-tr-none shadow-md' 
                      : 'bg-white text-green-900 shadow-sm border border-green-50 rounded-tl-none'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div className={`text-[10px] mt-1 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-green-50 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-green-900 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-green-900 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-green-900 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="bg-white p-4 rounded-b-[2rem] border border-green-100 shadow-xl flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'ar' ? 'اكتب رسالتك...' : 'Type a message...'}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-900 transition"
            />
            <button 
              disabled={!input.trim() || isTyping}
              className="bg-green-900 text-white p-2.5 rounded-xl hover:bg-green-800 disabled:opacity-50 transition shadow-md"
            >
              {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
