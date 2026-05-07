import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Bot, User as UserIcon, 
  Sparkles, TrendingUp, ShoppingBag, Loader2, Maximize2, Minimize2 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PRODUCTS, ARTISANS, User } from '../lib/staticData';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export function Chatbot() {
  const { user, isAuthenticated } = useAuth();
  const { dir, t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    // Initial greeting
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

  const generateResponse = async (query: string, userRole: string): Promise<string> => {
    // Artificial delay to simulate Claude thinking
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const q = query.toLowerCase();
    
    // Admin Logic
    if (userRole === 'admin') {
      if (q.includes('sales') || q.includes('revenue') || q.includes('مبيعات') || q.includes('دخل')) {
        return language === 'ar'
          ? "إجمالي المبيعات لشهر يوليو بلغ 8,200 دولار، مع نمو مستمر بنسبة 9% شهرياً. الفخار هو الفئة الأكثر استقراراً حالياً."
          : "Total sales for July reached $8,200, showing a steady 9% month-over-month growth. Ceramics are currently your most consistent category.";
      }
      if (q.includes('performance') || q.includes('artisan') || q.includes('أداء') || q.includes('حرفي')) {
        return language === 'ar'
          ? "يتصدر الحرفيون في رام الله وغزة الأداء حالياً. نوصي بزيادة التواصل مع حرفيي نابلس لتوسيع فئات الأعمال المعدنية."
          : "Artisans in Ramallah and Gaza are currently leading in performance. I recommend increasing outreach to Nablus artisans to expand metal-work categories.";
      }
    }

    // Artisan Logic
    if (userRole === 'artisan') {
      const artisanProducts = PRODUCTS.filter(p => p.artisan_id === user?.id);
      if (q.includes('my sales') || q.includes('performance') || q.includes('أدائي') || q.includes('مبيعاتي')) {
        return language === 'ar'
          ? `لديك حالياً ${artisanProducts.length} منتجات نشطة. متوسط تقييمك هو 4.8 نجوم. حققت مبيعات جيدة هذا الأسبوع!`
          : `You currently have ${artisanProducts.length} active products. Your average rating is 4.8 stars. You've had strong sales this week!`;
      }
      if (q.includes('feedback') || q.includes('reviews') || q.includes('ملاحظات') || q.includes('تقييمات')) {
        return language === 'ar'
          ? "المشترون يثنون على جودة عملك اليدوي، خاصة التفاصيل في التطريز. يطلب البعض خيارات ألوان أكثر تنوعاً."
          : "Buyers are praising the quality of your handiwork, especially the embroidery details. Some are requesting more diverse color options.";
      }
    }

    // Buyer / General Logic
    if (q.includes('product') || q.includes('best') || q.includes('recommend') || q.includes('منتج') || q.includes('أفضل') || q.includes('ترشيح')) {
      const topProducts = PRODUCTS.slice(0, 3).map(p => language === 'ar' ? p.name_ar : p.name_en).join(', ');
      return language === 'ar'
        ? `أرشح لك المنتجات التالية الأكثر طلباً: ${topProducts}. هل تود معرفة تفاصيل عن أي منها؟`
        : `I recommend our top-selling items: ${topProducts}. Would you like to know more about any of these?`;
    }

    if (q.includes('price') || q.includes('cost') || q.includes('سعر') || q.includes('تكلفة')) {
      return language === 'ar'
        ? "تتراوح أسعارنا بين 12 دولاراً للصابون النابلسي وتصل إلى 220 دولاراً للأثواب التراثية الفاخرة. كل قطعة هي استثمار في التراث."
        : "Our prices range from $12 for Nablus soap up to $220 for premium heritage thobes. Each piece is an investment in heritage.";
    }

    // Default Fallback
    return language === 'ar'
      ? "بناءً على البيانات المتاحة، يستمر التطريز (التطريز) في كونه ركيزتنا الأقوى. كيف يمكنني مساعدتك بشكل أكبر في استكشاف تراثنا؟"
      : "Based on current data, Tatreez continues to be our strongest pillar. How else can I help you explore our heritage today?";
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const role = user?.user_type || 'buyer';
      const response = await generateResponse(input, role);
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
    }
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
      style={{ width: isMinimized ? 'auto' : 'min(90vw, 400px)' }}
    >
      {/* Header */}
      <div className="bg-green-900 text-white p-4 rounded-t-[2rem] flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Bot className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm">{language === 'ar' ? 'مساعد جذور الذكي' : 'Juthoor AI Assistant'}</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-green-200 uppercase tracking-widest font-bold">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div 
            ref={scrollRef}
            className="bg-[#fefce8]/50 backdrop-blur-sm h-[400px] overflow-y-auto p-4 space-y-4 border-x border-green-100 shadow-inner"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div className={`max-w-[85%] flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-green-900 text-white' : 'bg-white text-green-900 shadow-sm border border-green-100'}`}>
                    {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-amber-500" />}
                  </div>
                  <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-green-900 text-white rounded-tr-none' 
                      : 'bg-white text-green-900 shadow-sm border border-green-50 rounded-tl-none'
                  }`}>
                    {msg.content}
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

          {/* Quick Actions */}
          <div className="bg-white/80 p-2 border-x border-green-100 overflow-x-auto no-scrollbar flex gap-2">
            {(user?.user_type === 'admin' ? ['Sales Insight', 'Performance'] : 
              user?.user_type === 'artisan' ? ['My Sales', 'Feedback'] : 
              ['Recommend', 'Pricing', 'Artisans']).map(action => (
              <button 
                key={action}
                onClick={() => {
                  setInput(action);
                  // Trigger send manually if needed, but better to let user see it
                }}
                className="whitespace-nowrap px-3 py-1.5 bg-green-50 text-green-900 text-xs font-bold rounded-lg border border-green-100 hover:bg-green-100 transition"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Input */}
          <form 
            onSubmit={handleSend}
            className="bg-white p-4 rounded-b-[2rem] border border-green-100 shadow-xl flex gap-2"
          >
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
