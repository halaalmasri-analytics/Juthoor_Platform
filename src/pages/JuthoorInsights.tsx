import { useState, useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { ARTISANS } from '../lib/staticData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, Brain, 
  ArrowUpRight, ArrowDownRight, Search, Sparkles, Filter, CheckCircle, XCircle,
  FileText, Table as TableIcon, ArrowRight, X
} from 'lucide-react';

// Mock Data
const revenueData = [
  { month: 'Jan', revenue: 4500, orders: 120 },
  { month: 'Feb', revenue: 5200, orders: 145 },
  { month: 'Mar', revenue: 4800, orders: 132 },
  { month: 'Apr', revenue: 6100, orders: 168 },
  { month: 'May', revenue: 5900, orders: 155 },
  { month: 'Jun', revenue: 7500, orders: 210 },
  { month: 'Jul', revenue: 8200, orders: 235 },
];

const categoryData = [
  { name: 'Tatreez', value: 45 },
  { name: 'Ceramics', value: 25 },
  { name: 'Olive Oil', value: 15 },
  { name: 'Olive Wood', value: 10 },
  { name: 'Glasswork', value: 5 },
];

const artisanPerformance = [
  { name: 'Samia Al-Kilani', sales: 4200, rating: 4.9 },
  { name: 'Ibrahim Al-Natsheh', sales: 3800, rating: 4.8 },
  { name: 'Mariam Abu Dagga', sales: 3500, rating: 5.0 },
  { name: 'Khalil Jweiles', sales: 2900, rating: 4.7 },
  { name: 'Amina Mansour', sales: 2400, rating: 4.9 },
];

const COLORS = ['#064e3b', '#065f46', '#047857', '#059669', '#10b981'];

export function JuthoorInsights() {
  const { dir, t } = useLanguage();
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  // KPI Data
  const kpiData = {
    totalSales: '$42,850',
    activeArtisans: '142',
    monthlyBuyers: '1,894',
    avgOrderValue: '$84.20'
  };
  
  // Verification State
  const [verifiedIds, setVerifiedIds] = useState<string[]>([]);
  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const stored = JSON.parse(localStorage.getItem('juthoor_verified_artisans') || '[]');
    setVerifiedIds(stored);
  }, []);

  const handleApprove = (artisanId: string) => {
    const newVerified = [...verifiedIds, artisanId];
    setVerifiedIds(newVerified);
    localStorage.setItem('juthoor_verified_artisans', JSON.stringify(newVerified));
  };

  const handleReject = (artisanId: string) => {
    // For demo purposes, we can just remove them from the pending list
    // by adding them to a rejected list, but let's just use the same list for simplicity
    // or create a rejected list. To keep it simple, just add to a 'rejected' list or ignore.
    const rejected = JSON.parse(localStorage.getItem('juthoor_rejected_artisans') || '[]');
    rejected.push(artisanId);
    localStorage.setItem('juthoor_rejected_artisans', JSON.stringify(rejected));
    // force re-render
    setVerifiedIds([...verifiedIds]);
  };

  const rejectedIds = JSON.parse(localStorage.getItem('juthoor_rejected_artisans') || '[]');
  
  const pendingArtisans = ARTISANS.filter(a => 
    a.verification_status === 'pending' && 
    !verifiedIds.includes(a.id) &&
    !rejectedIds.includes(a.id)
  );

  const handleAiAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion) return;
    setIsAsking(true);
    setAiAnswer(null);

    // Simulate AI thinking
    setTimeout(() => {
      const answers: Record<string, string> = {
        'trending': 'Currently, "The Pomegranate Bag" is trending with a 25% increase in searches this month. Olive Wood products are also seeing a seasonal spike in Europe.',
        'sales': 'Total sales reached $8,200 in July, showing a steady 9% month-over-month growth. Ceramics are your most consistent category.',
        'artisans': 'Top-performing artisans are currently concentrated in Ramallah and Gaza. Expanding outreach to Nablus could unlock more metal-work categories.',
        'growth': 'Revenue is projected to hit $10k by September if the current growth in the "Accessories" category continues.'
      };

      const foundKey = Object.keys(answers).find(key => aiQuestion.toLowerCase().includes(key));
      setAiAnswer(foundKey ? answers[foundKey] : "Based on current data, Tatreez continues to be our strongest pillar, accounting for 45% of all volume. I recommend featuring more Nabulsi Micro-Tatreez in next month's campaign.");
      setIsAsking(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-2 font-serif tracking-tight">{t('juthoor_insights')}</h1>
            <p className="text-gray-500 font-medium">{t('insights_subtitle')}</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition shadow-sm">
              <Filter className="w-4 h-4" />
              {t('filter_data')}
            </button>
            <button 
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-2 bg-green-900 px-6 py-2.5 rounded-xl text-white font-bold hover:bg-green-800 transition shadow-lg"
            >
              <TrendingUp className="w-4 h-4" />
              {t('generate_report')}
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-green-100/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-2xl text-green-900">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +12.5%
              </span>
            </div>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-1">{t('total_sales')}</p>
            <h3 className="text-3xl font-black text-green-900">{kpiData.totalSales}</h3>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-green-100/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 p-3 rounded-2xl text-amber-700">
                <Users className="w-6 h-6" />
              </div>
              <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +4
              </span>
            </div>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-1">{t('active_artisans')}</p>
            <h3 className="text-3xl font-black text-green-900">{kpiData.activeArtisans}</h3>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-green-100/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-700">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="flex items-center text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                <ArrowDownRight className="w-3 h-3 mr-1" />
                -2%
              </span>
            </div>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-1">{t('monthly_buyers')}</p>
            <h3 className="text-3xl font-black text-green-900">{kpiData.monthlyBuyers}</h3>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-green-100/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-2xl text-orange-700">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +5.2%
              </span>
            </div>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-1">{t('avg_order_value')}</p>
            <h3 className="text-3xl font-black text-green-900">{kpiData.avgOrderValue}</h3>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-10 mb-8 md:mb-10">
          <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-md border border-gray-100">
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-xl font-bold text-green-900">{t('revenue_performance')}</h2>
               <div className="flex gap-2 text-xs font-bold text-gray-400">
                 <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-900"></div> {t('monthly_revenue')}</span>
                 <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-200"></div> {t('orders')}</span>
               </div>
             </div>
             <div className="h-[400px] w-full">
               {mounted && (
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={revenueData}>
                     <defs>
                       <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#064e3b" stopOpacity={0.1}/>
                         <stop offset="95%" stopColor="#064e3b" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                     <Tooltip 
                       contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                       cursor={{stroke: '#064e3b', strokeWidth: 2}}
                     />
                     <Area type="monotone" dataKey="revenue" stroke="#064e3b" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                     <Area type="monotone" dataKey="orders" stroke="#bbf7d0" strokeWidth={2} fill="transparent" />
                   </AreaChart>
                 </ResponsiveContainer>
               )}
             </div>
          </div>

          <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-green-900 mb-8">{t('sales_by_category')}</h2>
            <div className="h-[300px] w-full">
               {mounted && (
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={categoryData}
                       cx="50%"
                       cy="50%"
                       innerRadius={70}
                       outerRadius={100}
                       paddingAngle={8}
                       dataKey="value"
                     >
                       {categoryData.map((_entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                       contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                     />
                     <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                   </PieChart>
                 </ResponsiveContainer>
               )}
            </div>
          </div>
        </div>

        {/* Verification Requests Section */}
        <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-md border border-gray-100 mb-8 md:mb-10">
          <h2 className="text-xl font-bold text-green-900 mb-6">{t('verification_requests')}</h2>
          
          {pendingArtisans.length === 0 ? (
            <div className="text-center py-8 text-gray-500 font-medium bg-gray-50 rounded-2xl">
              No pending verification requests at this time.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className={`w-full ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                <thead>
                  <tr className="border-b-2 border-gray-100 text-gray-400 font-bold uppercase text-xs tracking-wider">
                    <th className="pb-4 px-4">{t('artisan_name')}</th>
                    <th className="pb-4 px-4">Location</th>
                    <th className="pb-4 px-4">{t('craft_type')}</th>
                    <th className="pb-4 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendingArtisans.map((artisan) => (
                    <tr key={artisan.id} className="hover:bg-green-50/50 transition">
                      <td className="py-4 px-4 font-bold text-gray-900">
                        <div className="flex items-center gap-3">
                          {artisan.photo_url ? (
                            <img src={artisan.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold">
                              {artisan.name.charAt(0)}
                            </div>
                          )}
                          {artisan.name}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 font-medium">{artisan.location}</td>
                      <td className="py-4 px-4 text-gray-600 font-medium">{artisan.craft_specialty}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleApprove(artisan.id)}
                            className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1.5 rounded-lg font-bold text-sm transition"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {t('approve')}
                          </button>
                          <button 
                            onClick={() => handleReject(artisan.id)}
                            className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-bold text-sm transition"
                          >
                            <XCircle className="w-4 h-4" />
                            {t('reject')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Artisan Performance & AI Box */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-10 mb-8 md:mb-12">
           <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-green-900 mb-8">{t('top_artisans')}</h2>
              <div className="space-y-6">
                {artisanPerformance.map((artisan, index) => (
                   <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-green-50 transition">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-green-900 text-white rounded-xl flex items-center justify-center font-bold">
                         {index + 1}
                       </div>
                       <div>
                         <p className="font-bold text-gray-900">{artisan.name}</p>
                         <p className="text-xs text-gray-500">{t('verified_master')}</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="font-black text-green-800">${artisan.sales}</p>
                       <p className="text-xs text-amber-600 font-bold flex items-center justify-end gap-1">
                         <TrendingUp className="w-3 h-3" />
                         {t('top_tier')}
                       </p>
                     </div>
                   </div>
                ))}
              </div>
           </div>

           <div className="bg-green-900 p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <Brain className="w-64 h-64" />
             </div>
             
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                 <div className="bg-white/20 p-2 rounded-lg">
                   <Sparkles className="w-6 h-6 text-amber-300" />
                 </div>
                 <h2 className="text-2xl font-bold">{t('ai_insights')}</h2>
               </div>

               <p className="text-green-100/80 mb-8 leading-relaxed">
                 {t('ai_desc')}
               </p>

               <form onSubmit={handleAiAsk} className="relative mb-6">
                 <input 
                   type="text" 
                   value={aiQuestion}
                   onChange={(e) => setAiQuestion(e.target.value)}
                   placeholder={t('ai_placeholder')}
                   className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:ring-4 focus:ring-white/10 transition placeholder:text-green-100/30"
                 />
                 <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-green-900 p-3 rounded-xl hover:bg-amber-100 transition shadow-lg">
                   <Search className="w-5 h-5" />
                 </button>
               </form>

               {isAsking && (
                 <div className="flex items-center gap-3 text-green-200 animate-pulse bg-white/5 p-6 rounded-2xl border border-white/5">
                   <Loader2Icon className="w-5 h-5 animate-spin" />
                   {t('ai_thinking')}
                 </div>
               )}

               {aiAnswer && (
                 <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 animate-fadeIn transition-all">
                    <p className="text-lg leading-relaxed italic text-green-50">
                      "{aiAnswer}"
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
                      <TrendingUp className="w-4 h-4" />
                      {t('strategic_recommendation')}
                    </div>
                 </div>
               )}
             </div>
           </div>
        </div>
      </div>

      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        data={{
          kpis: kpiData,
          artisans: artisanPerformance,
          categories: categoryData,
          revenue: revenueData
        }}
      />
    </div>
  );
}

function Loader2Icon({className}: any) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
  )
}

function ReportModal({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data: any }) {
  if (!isOpen) return null;

  const generatePDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Header
    doc.setFillColor(6, 78, 59); // Juthoor Green
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Juthoor Insights Report', 20, 25);
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 160, 25);

    // KPI Summary
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('KPI Summary', 20, 55);
    
    const kpiRows = [
      ['Total Sales', data.kpis.totalSales],
      ['Active Artisans', data.kpis.activeArtisans],
      ['Monthly Buyers', data.kpis.monthlyBuyers],
      ['Avg. Order Value', data.kpis.avgOrderValue],
    ];

    autoTable(doc, {
      startY: 60,
      head: [['Metric', 'Value']],
      body: kpiRows,
      theme: 'striped',
      headStyles: { fillColor: [6, 78, 59] },
    });

    // Top Artisans
    doc.text('Top Performing Artisans', 20, (doc as any).lastAutoTable.finalY + 20);
    
    const artisanRows = data.artisans.map((a: any) => [a.name, `$${a.sales}`, `${a.rating} / 5.0`]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 25,
      head: [['Artisan', 'Total Sales', 'Rating']],
      body: artisanRows,
      theme: 'striped',
      headStyles: { fillColor: [6, 78, 59] },
    });

    // Categories
    doc.text('Sales by Category', 20, (doc as any).lastAutoTable.finalY + 20);
    
    const categoryRows = data.categories.map((c: any) => [c.name, `${c.value}%`]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 25,
      head: [['Category', 'Market Share']],
      body: categoryRows,
      theme: 'striped',
      headStyles: { fillColor: [6, 78, 59] },
    });

    doc.save(`Juthoor_Insights_Report_${date.replace(/\//g, '-')}.pdf`);
  };

  const generateExcel = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: KPIs
    const kpiWS = XLSX.utils.json_to_sheet([
      { Metric: 'Total Sales', Value: data.kpis.totalSales },
      { Metric: 'Active Artisans', Value: data.kpis.activeArtisans },
      { Metric: 'Monthly Buyers', Value: data.kpis.monthlyBuyers },
      { Metric: 'Avg. Order Value', Value: data.kpis.avgOrderValue },
      { Metric: 'Generated Date', Value: new Date().toLocaleString() }
    ]);
    XLSX.utils.book_append_sheet(wb, kpiWS, "KPI Overview");

    // Sheet 2: Artisans
    const artisanWS = XLSX.utils.json_to_sheet(data.artisans.map((a: any) => ({
      'Artisan Name': a.name,
      'Total Sales ($)': a.sales,
      'Rating': a.rating
    })));
    XLSX.utils.book_append_sheet(wb, artisanWS, "Top Artisans");

    // Sheet 3: Categories
    const categoryWS = XLSX.utils.json_to_sheet(data.categories.map((c: any) => ({
      'Category': c.name,
      'Percentage (%)': c.value
    })));
    XLSX.utils.book_append_sheet(wb, categoryWS, "Sales by Category");

    XLSX.writeFile(wb, `Juthoor_Data_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-8 relative animate-fadeIn">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-8">
           <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
             <TrendingUp className="w-8 h-8 text-green-900" />
           </div>
           <h2 className="text-2xl font-bold text-green-900">Generate Report</h2>
           <p className="text-gray-500 mt-2">Select your preferred format</p>
        </div>
        
        <div className="space-y-4">
           <button 
             onClick={() => { generatePDF(); onClose(); }}
             className="w-full flex items-center justify-between p-5 border-2 border-gray-100 rounded-2xl hover:border-green-800 hover:bg-green-50 transition group"
           >
             <div className="flex items-center gap-4">
               <div className="bg-red-100 p-3 rounded-xl text-red-600 group-hover:bg-red-200 transition">
                 <FileText className="w-6 h-6" />
               </div>
               <div className="text-left">
                 <p className="font-bold text-gray-900">Download as PDF</p>
                 <p className="text-xs text-gray-500">Visual report with tables</p>
               </div>
             </div>
             <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-green-800 transition" />
           </button>
           
           <button 
             onClick={() => { generateExcel(); onClose(); }}
             className="w-full flex items-center justify-between p-5 border-2 border-gray-100 rounded-2xl hover:border-green-800 hover:bg-green-50 transition group"
           >
             <div className="flex items-center gap-4">
               <div className="bg-green-100 p-3 rounded-xl text-green-600 group-hover:bg-green-200 transition">
                 <TableIcon className="w-6 h-6" />
               </div>
               <div className="text-left">
                 <p className="font-bold text-gray-900">Download as Excel</p>
                 <p className="text-xs text-gray-500">Raw data spreadsheet</p>
               </div>
             </div>
             <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-green-800 transition" />
           </button>
        </div>
      </div>
    </div>
  );
}
