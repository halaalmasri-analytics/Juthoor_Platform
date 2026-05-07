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
    const productsContext = PRODUCTS.map(p => ({
      name: p.name_en,
      name_ar: p.name_ar,
      price: p.price_usd,
      category: p.category,
      artisan: p.artisans?.name
    }));

    const artisansContext = ARTISANS.map(a => ({
      name: a.name,
      specialty: a.craft_specialty,
      location: a.location
    }));

    let basePrompt = `You are the Juthoor AI Assistant, a helpful and professional expert on Palestinian heritage and the Juthoor marketplace.
Your goal is to help users navigate the platform and learn about products and artisans.
Always be polite and respect the cultural significance of the items.
Current Language: ${language === 'ar' ? 'Arabic' : 'English'}. Respond in the user's language.

Available Data:
Products: ${JSON.stringify(productsContext)}
Artisans: ${JSON.stringify(artisansContext)}
`;

    if (role === 'buyer') {
      basePrompt += `\nYou are helping a Buyer. Focus on product recommendations, pricing, and artisan stories. Do not share sensitive business data or artisan personal details beyond their public bio.`;
    } else if (role === 'artisan') {
      const myProducts = PRODUCTS.filter(p => p.artisan_id === user?.id);
      basePrompt += `\nYou are helping an Artisan named ${user?.full_name}. They can ask about their own products: ${JSON.stringify(myProducts)}.
They are interested in their performance and feedback. Do not share personal data of buyers.`;
    } else if (role === 'admin') {
      basePrompt += `\nYou are helping an Admin. You have full access to all platform data, including sales trends and performance insights. Be strategic and analytical.`;
    }

    return basePrompt;
  };

  const generateAiResponse = async (userQuery: string) => {
    if (!GROQ_API_KEY) {
      return language === 'ar' 
        ? "عذراً، لم يتم تكوين مفتاح API الخاص بـ Groq بعد."
        : "Sorry, the Groq API key is not configured yet.";
    }

    const role = user?.user_type || 'buyer';
    const systemPrompt = getSystemPrompt(role);

    // Prepare message history for the API (limit to last 10 messages)
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user', content: userQuery }
    ];

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1024,
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content;
      }
      throw new Error('Invalid API response');
    } catch (error) {
      console.error('Groq API Error:', error);
      return language === 'ar'
        ? "عذراً، واجهت مشكلة في الاتصال بخادم الذكاء الاصطناعي. يرجى المحاولة مرة أخرى."
        : "Sorry, I encountered an issue connecting to the AI server. Please try again.";
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
