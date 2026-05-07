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
=== JUTHOOR PLATFORM DATA ===

ARTISANS (15 total):
1. Ibrahim Al-Natsheh | Hebron | Hebron Glasswork | Rating: 4.9/5
2. Sami Al-Kurd | Nablus | Wood & Metal Craft | Rating: 4.8/5
3. Layla Al-Kilani | Ramallah | Embroidery (Tatreez) | Rating: 4.9/5
4. Maryam Al-Ali | Gaza | Traditional Dresses | Rating: 4.9/5
5. Zein Al-Tabari | Jerusalem | Jewelry Design | Rating: 4.8/5
6. Amal Mansour | Bethlehem | Accessory Design | Rating: 4.9/5
7. Lina Khoury | Ramallah | Ceramics | Rating: 4.8/5
8. Omar Haddad | Nablus | Hand-painted Ceramics | Rating: 4.7/5
9. Sara Masri | Bethlehem | Contemporary Design | Rating: 4.9/5
10. Samia Al-Kilani | Ramallah | Traditional Tatreez | Rating: 4.9/5
11. Khalil Jweiles | Hebron | Woodwork & Inlay | Rating: 4.8/5
12. Mariam Abu Dagga | Gaza City | Heavy Cross-stitch | Rating: 5.0/5
13. Amina Mansour | Bethlehem | Heritage Weaving | Rating: 4.9/5
14. Fatima & Omar | Nablus | Metal & Micro-Tatreez | Rating: 4.7/5
15. Layla Kanaan | Ramallah | Modern Heritage Clothing | Rating: 4.9/5

PRODUCTS CATALOG:
1. Hebron Glass Set (Blue & White) — $30 | Category: Hebron Glasswork | By: Ibrahim Al-Natsheh (Hebron) | Rating: 4.9 | Variants: Large Plate $30, Medium Plate $22, Glass Cup $10
2. Palestinian Heritage Wall Hooks — $25 | Category: Home Decor | By: Sami Al-Kurd (Nablus) | Rating: 4.8 | Variants: Key Hook $25, Wall Hook $40
3. Embroidered Mirrors — $18 | Category: Accessories | By: Layla Al-Kilani (Ramallah) | Rating: 4.9 | Variants: Wall Mirror $65, Wedding Souvenirs $12
4. Palestinian Heritage Dresses — $180 | Category: Clothing | By: Maryam Al-Ali (Gaza) | Rating: 4.9 | Variants: Pink Dress $180, Traditional Red Dress $220
5. Tatreez Jewelry — $35 | Category: Jewelry | By: Zein Al-Tabari (Jerusalem) | Rating: 4.8 | Variants: Earrings $35, Map Necklace $45, Necklace Pal $50
6. Tatreez Bags — $85 | Category: Accessories | By: Amal Mansour (Bethlehem) | Rating: 4.9 | Variants: Zaitouna Bag $85, Ard Al-Khayr Bag $120
7. Palestine Map Ceramic Plate — $26 | Category: Ceramics | By: Omar Haddad (Nablus) | Rating: 4.7
8. "Love is Palestine" Keffiyeh Mug — $15 | Category: Ceramics | By: Sara Masri (Bethlehem) | Rating: 4.9
9. The Pomegranate Bag (حقيبة الرمان) — $115 | Category: Accessories | By: Samia Al-Kilani (Ramallah) | Rating: 4.9 | 189 reviews
10. Carved Walnut Heritage Mirror (Blue Tatreez Inlay) — $78 | Category: Accessories | By: Khalil Jweiles (Hebron) | Rating: 4.8
11. Heritage Woven Wristlet Keychains (Set of 3) — $28 | Category: Accessories | By: Amina Mansour (Bethlehem) | Rating: 4.9 | 304 reviews (most reviewed!)
12. The Nabulsia Accessory Set — $55 | Category: Jewelry | By: Fatima & Omar (Nablus) | Rating: 4.7
13. The Map Hoodie — $110 | Category: Clothing | By: Layla Kanaan (Ramallah) | Rating: 4.9
14. The Key Hoodie — $125 | Category: Clothing | By: Layla Kanaan (Ramallah) | Rating: 5.0
15. Juthoor Heritage Wall Hanging — $85 | Category: Home Decor | By: Layla Kanaan (Ramallah) | Rating: 4.8

PRICE RANGES BY CATEGORY:
- Ceramics: $15–$26
- Accessories & Bags: $12–$120
- Jewelry: $35–$55
- Clothing & Dresses: $110–$220
- Home Decor: $25–$85
- Overall range: $10 (Glass Cup) to $220 (Traditional Red Dress)

TOP SELLERS: Heritage Woven Wristlet Keychains (304 reviews), The Pomegranate Bag (189 reviews), "Love is Palestine" Keffiyeh Mug (156 reviews)
`;

    let systemPrompt = `You are the Juthoor AI Assistant — an expert guide for the Juthoor Palestinian Artisan Marketplace.
You MUST use the specific data below to answer questions. Never give generic answers. 
Always mention real product names, prices, artisan names, and locations from the data.
Respond in ${isAr ? 'Arabic' : 'English'} language.

${platformData}
`;

    if (role === 'buyer') {
      systemPrompt += `
ROLE: You are helping a BUYER.
- Help them discover products, compare prices, and learn about artisans.
- Recommend specific products with their real names and prices.
- You can share artisan names, locations, and specialties.
- Do NOT share any artisan's private financial data or sales numbers.
- Encourage purchases by highlighting heritage stories and authenticity.
`;
    } else if (role === 'artisan') {
      const myProducts = PRODUCTS.filter(p => p.artisan_id === user?.id);
      systemPrompt += `
ROLE: You are helping an ARTISAN named ${user?.full_name || 'our artisan'}.
Their products on Juthoor: ${JSON.stringify(myProducts.map(p => ({ name: p.name_en, price: p.price_usd, rating: p.average_rating, reviews: p.total_reviews })))}
- Help them understand their product performance and customer feedback.
- Give advice on pricing, presentation, and how to improve sales.
- Do NOT reveal personal information of any buyers.
- Do NOT reveal sales data of other artisans.
`;
    } else if (role === 'admin') {
      systemPrompt += `
ROLE: You are helping a PLATFORM ADMIN.
- You have FULL access to all platform data above.
- Provide strategic analytics insights on categories, artisan performance, and pricing.
- Total platform artisans: 15 | Active products: 15+ | Cities covered: Hebron, Nablus, Ramallah, Jerusalem, Gaza, Bethlehem
- Monthly revenue trend: +9% MoM | Best performing category: Accessories | Top artisan by reviews: Mariam Abu Dagga (5.0 rating)
`;
    } else {
      // Guest/unauthenticated
      systemPrompt += `
ROLE: You are helping a GUEST VISITOR.
- Introduce them to Juthoor and Palestinian heritage crafts.
- Show them specific products and encourage them to create an account.
- Share artisan stories and cultural heritage context.
`;
    }

    return systemPrompt;
  };

  const generateAiResponse = async (userQuery: string) => {
    console.log('Chatbot: Generating response for query:', userQuery);
    
    // FALLBACK LOGIC: If API fails or key is missing
    const getFallbackResponse = (query: string) => {
      const q = query.toLowerCase();
      const isAr = language === 'ar';

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

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            { 
              role: 'user', 
              content: `${getSystemPrompt(user?.user_type || 'buyer')}\n\nUser Question: ${userQuery}` 
            }
          ],
          max_tokens: 1024,
          temperature: 0.7,
        })
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content;
      }
      throw new Error('Invalid Response');
    } catch (error) {
      console.error('Chatbot: API failed, falling back to local logic:', error);
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
