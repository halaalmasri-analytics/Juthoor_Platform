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
        ? `مرحباً! أنا مساعد جذور الذكي. كيف يمكنني مساعدتك اليوم؟`
        : `Hello! I'm your Juthoor AI Assistant. How can I help you today?`;
      
      setMessages([{
        id: '1',
        role: 'assistant',
        content: greeting,
        timestamp: new Date()
      }]);
    }
  }, [language]);

  const getSystemPrompt = () => {
    return `You are the Juthoor AI Assistant — a knowledgeable, warm, and culturally respectful guide for the Juthoor Palestinian Artisan Marketplace.

CRITICAL LANGUAGE RULE:
- Detect the language of the customer's message
- If they write in Arabic → respond ONLY in Arabic, nothing else
- If they write in English → respond ONLY in English, nothing else
- NEVER mix languages in a single response
- NEVER translate the user's question
- Just respond directly in their language

PERSONALITY:
- Warm, friendly, and authentic
- Knowledgeable about Palestinian crafts and products
- Patient and helpful with every question
- Proud of Palestinian heritage

PLATFORM DATA:

PRODUCTS & PRICES:

Tatreez Dresses & Clothing:
- Pink Heritage Dress — $180 (by Maryam Al-Ali, Gaza)
- Traditional Red Dress — $220 (by Maryam Al-Ali, Gaza)
- Map Hoodie — $110 (by Layla Kanaan, Ramallah)
- Key Hoodie — $125 (by Layla Kanaan, Ramallah)

Bags & Accessories:
- Zaitouna Tatreez Bag — $85 (by Amal Mansour, Bethlehem)
- Pomegranate Bag — $115 (by Samia Al-Kilani, Ramallah) - 189 reviews
- Ard Al-Khayr Bag — $120 (by Amal Mansour, Bethlehem)

Glass & Ceramics:
- Hebron Glass Cup — $10 (by Ibrahim Al-Natsheh, Hebron)
- Love is Palestine Keffiyeh Mug — $15 (by Sara Masri, Bethlehem) - 156 reviews
- Hebron Glass Medium Plate — $22
- Palestine Map Ceramic Plate — $26 (by Omar Haddad, Nablus)
- Hebron Glass Large Plate — $30

Jewelry & Accessories:
- Wedding Souvenirs — $12
- Heritage Woven Wristlet Keychains Set of 3 — $28 (by Amina Mansour, Bethlehem) - BESTSELLER - 304 reviews
- Tatreez Earrings — $35 (by Zein Al-Tabari, Jerusalem)
- Map Necklace — $45 (by Zein Al-Tabari, Jerusalem)
- Necklace Pal — $50
- Nabulsia Accessory Set — $55 (by Fatima & Omar, Nablus)

Home Decor:
- Heritage Wall Hooks — $25-$40 (by Sami Al-Kurd, Nablus)
- Carved Walnut Heritage Mirror — $78 (by Khalil Jweiles, Hebron)
- Heritage Wall Hanging — $85 (by Layla Kanaan, Ramallah)

TOP ARTISANS:
- Mariam Abu Dagga, Gaza: Rating 5.0 ⭐ (highest rated)
- Layla Kanaan, Ramallah: Rating 4.9
- Ibrahim Al-Natsheh, Hebron: Rating 4.9
- Samia Al-Kilani, Ramallah: Rating 4.9
- Amina Mansour, Bethlehem: Rating 4.9

TOP BESTSELLERS:
1. Heritage Woven Wristlet Keychains — $28 (304 reviews)
2. Pomegranate Bag — $115 (189 reviews)
3. Love is Palestine Keffiyeh Mug — $15 (156 reviews)

CITIES:
- Nablus: Tatreez, Metal Craft, Ceramics
- Hebron: Glasswork, Woodwork
- Ramallah: Tatreez, Ceramics, Modern Heritage
- Jerusalem: Jewelry Design
- Gaza: Traditional Dresses, Cross-stitch
- Bethlehem: Accessories, Heritage Weaving

RULES:
1. Always cite specific product names and exact prices
2. Never give vague or generic answers
3. When asked about a category, list all relevant products with prices
4. Be brief and direct
5. Ask clarifying questions if needed
6. Never make up information
7. Highlight cultural significance when relevant`;
  };

  const generateAiResponse = async (userQuery: string) => {
    console.log('Chatbot: Generating response for query:', userQuery);
    
    const getFallbackResponse = (query: string) => {
      const q = query.toLowerCase();
      const isAr = /[\u0600-\u06FF]/.test(q);

      const matchedProduct = PRODUCTS.find(p => 
        q.includes(p.name_en.toLowerCase()) || (p.name_ar && q.includes(p.name_ar))
      );
      if (matchedProduct) {
        return isAr 
          ? `نعم، لدينا ${matchedProduct.name_ar}. سعره $${matchedProduct.price_usd} وهو من فئة ${matchedProduct.category}. هل تود معرفة المزيد؟`
          : `Yes, we have the ${matchedProduct.name_en}. It costs $${matchedProduct.price_usd} in the ${matchedProduct.category} category. Would you like to know more?`;
      }

      if (q.includes('price') || q.includes('cost') || q.includes('سعر')) {
        return isAr ? "أسعارنا تتراوح من $12 إلى $220. هل تبحث عن فئة معينة؟" : "Our prices range from $12 to $220. Are you looking for a specific category?";
      }
      if (q.includes('artisan') || q.includes('حرفي')) {
        return isAr ? "نعمل مع حرفيين فلسطينيين مبدعين من نابلس والخليل ورام الله والقدس وغزة وبيت لحم." : "We work with talented Palestinian artisans from Nablus, Hebron, Ramallah, Jerusalem, Gaza, and Bethlehem.";
      }
      if (q.includes('ship') || q.includes('shipping') || q.includes('شحن')) {
        return isAr ? "نشحن من فلسطين إلى العالم كله. الشحن عادة يستغرق 7-14 يوم." : "We ship from Palestine worldwide! Shipping usually takes 7-14 days.";
      }

      return isAr 
        ? "أنا هنا للمساعدة! اسأل عن المنتجات أو الأسعار أو قصص الحرفيين."
        : "I'm here to help! Ask me about products, prices, or our artisans' stories.";
    };

    if (!GROQ_API_KEY) {
      console.warn('Chatbot: VITE_GROQ_API_KEY is missing. Using fallback.');
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
          model: 'llama-3.1-8b-instant',
          messages: [
            { 
              role: 'system', 
              content: getSystemPrompt()
            },
            { 
              role: 'user', 
              content: userQuery
            }
          ],
          max_tokens: 512,
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('Chatbot API error:', response.status, err);
        throw new Error('API Error');
      }

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content;
      }
      throw new Error('Invalid Response');
    } catch (error) {
      console.error('Chatbot API failed, using fallback:', error);
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
