import React, { useState } from 'react';
import { Deal, Coupon, UserProfile, Bar } from '../types';
import { SectionHeader, Card, Badge } from './Layout';
import { planNightOut, NightPlan } from '../services/geminiService';
import { Clock, MapPin, QrCode, Search, Sparkles, Store, Star, Footprints, Loader2, ArrowRight } from 'lucide-react';

interface UserViewProps {
  bars: Bar[];
  deals: Deal[];
  coupons: Coupon[];
  user: UserProfile;
}

export const UserView: React.FC<UserViewProps> = ({ bars, deals, coupons, user }) => {
  const [activeTab, setActiveTab] = useState<'bars' | 'deals' | 'wallet' | 'concierge'>('bars');
  const [searchTerm, setSearchTerm] = useState('');

  // --- Filter Logic ---
  const filteredBars = bars.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredDeals = deals.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.barName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const targetedCoupons = coupons.filter(c => 
    user.preferences.includes(c.targetAudience)
  );

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="sticky top-16 z-40 bg-dark-bg/95 backdrop-blur py-2 border-b border-slate-800 -mx-4 px-4 md:mx-0 md:px-0 md:static md:bg-transparent md:border-0">
        <div className="flex overflow-x-auto no-scrollbar gap-2 md:gap-4">
          <NavTab active={activeTab === 'bars'} onClick={() => setActiveTab('bars')} icon={<Store className="w-4 h-4" />} label="Bars" />
          <NavTab active={activeTab === 'deals'} onClick={() => setActiveTab('deals')} icon={<Star className="w-4 h-4" />} label="Deals" />
          <NavTab active={activeTab === 'concierge'} onClick={() => setActiveTab('concierge')} icon={<Sparkles className="w-4 h-4 text-neon-purple" />} label="Concierge" />
          <NavTab 
            active={activeTab === 'wallet'} 
            onClick={() => setActiveTab('wallet')} 
            icon={<QrCode className="w-4 h-4" />} 
            label="Wallet" 
            badge={targetedCoupons.length > 0 ? targetedCoupons.length : undefined}
          />
        </div>
      </div>

      {/* Views */}
      {activeTab === 'bars' && (
        <div className="animate-fade-in">
           <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search venues (e.g., Rooftop, Jazz)..."
              className="w-full bg-dark-card border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-neon-blue transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBars.map(bar => (
              <BarCard key={bar.id} bar={bar} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'deals' && (
        <div className="animate-fade-in">
          <SectionHeader title="Tonight's Specials" subtitle="Best prices in town right now" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDeals.map(deal => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'concierge' && (
        <div className="animate-fade-in">
          <ConciergeView bars={bars} deals={deals} />
        </div>
      )}

      {activeTab === 'wallet' && (
        <div className="animate-fade-in space-y-4">
           <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 p-4 rounded-xl mb-6">
            <h3 className="font-semibold text-indigo-300 mb-1">Targeted For You</h3>
            <p className="text-sm text-indigo-200/70">
              Based on your likes: {user.preferences.join(', ')}.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {targetedCoupons.map(coupon => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-Components ---

interface NavTabProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const NavTab: React.FC<NavTabProps> = ({ active, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all border ${
      active 
        ? 'bg-slate-800 border-slate-600 text-white shadow-sm' 
        : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
    {badge ? (
      <span className="bg-neon-pink text-white text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span>
    ) : null}
  </button>
);

const BarCard: React.FC<{ bar: Bar }> = ({ bar }) => (
  <Card className="group hover:border-neon-blue/50 transition-all duration-300 hover:-translate-y-1">
    <div className="h-48 overflow-hidden relative">
      <img src={bar.image} alt={bar.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-white px-2 py-1 rounded text-xs font-bold flex items-center">
        <Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" />
        {bar.rating}
      </div>
      <div className="absolute bottom-2 left-2">
        <Badge color={
          bar.vibe === 'Packed' ? 'pink' : 
          bar.vibe === 'Live Music' ? 'purple' : 
          'blue'
        }>
          {bar.vibe}
        </Badge>
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-lg text-white mb-1">{bar.name}</h3>
      <p className="text-slate-400 text-xs flex items-center mb-3">
        <MapPin className="w-3 h-3 mr-1" /> {bar.address}
      </p>
      <p className="text-slate-300 text-sm line-clamp-2 mb-3">{bar.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {bar.tags.map(tag => (
          <span key={tag} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">{tag}</span>
        ))}
      </div>
    </div>
  </Card>
);

const ConciergeView: React.FC<{ bars: Bar[], deals: Deal[] }> = ({ bars, deals }) => {
  const [query, setQuery] = useState('');
  const [plan, setPlan] = useState<NightPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const result = await planNightOut(query, bars, deals);
    setPlan(result);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(167,139,250,0.3)]">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">AI Nightlife Concierge</h2>
        <p className="text-slate-400">Tell us your mood, and we'll curate the perfect night out in Knoxville.</p>
      </div>

      <form onSubmit={handlePlan} className="relative mb-8">
        <input 
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g., 'Quiet date night with cocktails' or 'Rowdy beer crawl'..."
          className="w-full bg-slate-900/50 border border-slate-700 rounded-full py-4 pl-6 pr-32 text-white focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all outline-none shadow-inner"
        />
        <button 
          type="submit"
          disabled={loading || !query}
          className="absolute right-2 top-2 bottom-2 bg-neon-purple hover:bg-neon-purple/90 text-white px-6 rounded-full font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Plan It'}
        </button>
      </form>

      {plan && (
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in">
          <div className="flex justify-between items-start mb-6 border-b border-slate-700 pb-4">
            <div>
              <h3 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-neon-blue">{plan.title}</h3>
              <p className="text-neon-purple text-sm mt-1">{plan.vibeDescription}</p>
            </div>
            <div className="bg-slate-950 px-3 py-1 rounded border border-slate-800 text-green-400 font-mono text-sm">
              {plan.estimatedCost}
            </div>
          </div>

          <div className="space-y-8 relative">
            {/* Connecting Line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-700/50"></div>

            {plan.itinerary.map((stop, idx) => (
              <div key={idx} className="relative flex gap-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 border-2 border-neon-blue flex items-center justify-center z-10 shadow-[0_0_10px_rgba(96,165,250,0.2)]">
                  <span className="font-bold text-white">{idx + 1}</span>
                </div>
                <div className="flex-1 bg-dark-card border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-colors">
                  <h4 className="font-bold text-white text-lg mb-1">{stop.barName}</h4>
                  <p className="text-slate-400 text-sm mb-3">{stop.reason}</p>
                  <div className="bg-slate-900/50 inline-block px-3 py-2 rounded-lg border border-slate-800">
                     <div className="flex items-start gap-2">
                        <Footprints className="w-4 h-4 text-neon-pink mt-0.5" />
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-0.5">Try This</span>
                          <span className="text-sm text-slate-200">{stop.suggestedActivity}</span>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button className="text-slate-400 hover:text-white text-sm flex items-center justify-center w-full group">
              Start Navigation <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusing existing DealCard but ensuring imports work
const DealCard: React.FC<{ deal: Deal }> = ({ deal }) => (
  <Card className="group hover:border-slate-600 transition-colors">
    <div className="aspect-video w-full overflow-hidden relative">
      <img src={deal.imageUrl} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded text-xs font-bold">
        {deal.startTime} - {deal.endTime}
      </div>
    </div>
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg text-white group-hover:text-neon-blue transition-colors">{deal.title}</h3>
          <div className="flex items-center text-slate-400 text-xs mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            {deal.barName}
          </div>
        </div>
        <div className="bg-neon-blue/10 text-neon-blue px-2 py-1 rounded font-bold text-sm">
          {deal.price}
        </div>
      </div>
      <p className="text-slate-300 text-sm mb-4 line-clamp-2">{deal.description}</p>
      <div className="flex gap-2">
        {deal.tags.map(tag => <Badge key={tag} color="purple">{tag}</Badge>)}
      </div>
    </div>
  </Card>
);

const CouponCard: React.FC<{ coupon: Coupon }> = ({ coupon }) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4 relative overflow-hidden flex flex-col md:flex-row items-center gap-4 group">
    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-dark-bg rounded-full"></div>
    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-dark-bg rounded-full"></div>
    <div className="absolute left-24 top-0 bottom-0 w-[1px] border-l-2 border-dashed border-slate-700 hidden md:block"></div>

    <div className="flex-shrink-0 flex flex-col items-center justify-center w-full md:w-20 text-center space-y-2">
      <div className="bg-white p-2 rounded-lg">
        <QrCode className="w-12 h-12 text-black" />
      </div>
      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Scan</span>
    </div>

    <div className="flex-1 text-center md:text-left">
      <div className="text-xs font-bold text-neon-pink mb-1 uppercase tracking-wider">Exclusive Offer</div>
      <h3 className="font-bold text-xl text-white mb-1">{coupon.title}</h3>
      <p className="text-slate-400 text-sm mb-3">{coupon.description} at <span className="text-slate-300 font-medium">{coupon.barName}</span></p>
      
      <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
        <div className="bg-slate-800 border border-slate-600 px-3 py-1 rounded font-mono text-neon-blue text-sm select-all">
          {coupon.code}
        </div>
        <span className="text-xs text-slate-500 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {coupon.expiry}
        </span>
      </div>
    </div>
  </div>
);