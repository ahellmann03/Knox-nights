import React, { useState } from 'react';
import { MOCK_BARS } from '../constants';
import { Deal, Coupon, TargetAudience } from '../types';
import { generateCampaignIdeas, GeneratedCampaign } from '../services/geminiService';
import { SectionHeader, Card } from './Layout';
import { Sparkles, Plus, Loader2, Megaphone, Target } from 'lucide-react';

interface BarOwnerViewProps {
  addDeal: (d: Deal) => void;
  addCoupon: (c: Coupon) => void;
}

export const BarOwnerView: React.FC<BarOwnerViewProps> = ({ addDeal, addCoupon }) => {
  const [myBar] = useState(MOCK_BARS[0]); // Simulating the logged-in owner's bar
  const [activeSection, setActiveSection] = useState<'create' | 'analytics'>('create');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">{myBar.name}</h2>
          <p className="text-slate-400">Owner Dashboard</p>
        </div>
        <div className="flex space-x-2">
           <button 
             onClick={() => setActiveSection('create')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'create' ? 'bg-neon-purple text-white' : 'bg-slate-800 text-slate-400'}`}
           >
             Campaign Manager
           </button>
           <button 
             onClick={() => setActiveSection('analytics')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'analytics' ? 'bg-neon-purple text-white' : 'bg-slate-800 text-slate-400'}`}
           >
             Analytics
           </button>
        </div>
      </div>

      {activeSection === 'create' ? (
        <CampaignManager barId={myBar.id} barName={myBar.name} addDeal={addDeal} addCoupon={addCoupon} />
      ) : (
        <AnalyticsDashboard />
      )}
    </div>
  );
};

const AnalyticsDashboard = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
    <Card className="p-6 border-l-4 border-l-neon-blue">
      <div className="text-slate-400 text-sm mb-1">Active Coupons</div>
      <div className="text-3xl font-bold text-white">124</div>
      <div className="text-green-400 text-xs mt-2">+12% this week</div>
    </Card>
    <Card className="p-6 border-l-4 border-l-neon-pink">
      <div className="text-slate-400 text-sm mb-1">Deal Impressions</div>
      <div className="text-3xl font-bold text-white">2.4k</div>
      <div className="text-green-400 text-xs mt-2">Trending up</div>
    </Card>
    <Card className="p-6 border-l-4 border-l-neon-purple">
      <div className="text-slate-400 text-sm mb-1">Redemption Rate</div>
      <div className="text-3xl font-bold text-white">18%</div>
      <div className="text-slate-500 text-xs mt-2">Avg for area: 15%</div>
    </Card>
    
    <Card className="col-span-full p-8 flex flex-col items-center justify-center h-64 border-dashed border-slate-700 bg-transparent">
      <div className="text-slate-500 mb-2">Detailed charts would go here (Recharts integration)</div>
      <div className="h-2 w-32 bg-slate-800 rounded overflow-hidden">
        <div className="h-full w-2/3 bg-slate-600"></div>
      </div>
    </Card>
  </div>
);

interface CampaignManagerProps {
  barId: string;
  barName: string;
  addDeal: (d: Deal) => void;
  addCoupon: (c: Coupon) => void;
}

const CampaignManager: React.FC<CampaignManagerProps> = ({ barId, barName, addDeal, addCoupon }) => {
  const [product, setProduct] = useState('');
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideas, setIdeas] = useState<GeneratedCampaign[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<GeneratedCampaign | null>(null);
  const [formType, setFormType] = useState<'deal' | 'coupon'>('deal');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !goal) return;
    
    setIsGenerating(true);
    setIdeas([]); // Clear previous
    setSelectedIdea(null);

    const results = await generateCampaignIdeas(product, goal, barName);
    setIdeas(results);
    setIsGenerating(false);
  };

  const handlePublish = () => {
    if (!selectedIdea) return;

    if (formType === 'deal') {
      const newDeal: Deal = {
        id: Math.random().toString(36).substr(2, 9),
        barId,
        barName,
        title: selectedIdea.title,
        description: selectedIdea.description,
        price: '$5.00', // Simplified for demo
        imageUrl: `https://picsum.photos/seed/${Math.random()}/400/300`,
        startTime: '18:00',
        endTime: '21:00',
        tags: [selectedIdea.suggestedAudience]
      };
      addDeal(newDeal);
    } else {
       // Map the string from AI to a valid enum if possible, otherwise default
       let target = TargetAudience.BEER_LOVERS;
       const upperSuggestion = selectedIdea.suggestedAudience.toUpperCase();
       if (upperSuggestion.includes("STUDENT")) target = TargetAudience.STUDENTS;
       if (upperSuggestion.includes("PROFESSIONAL")) target = TargetAudience.PROFESSIONALS;
       if (upperSuggestion.includes("COCKTAIL")) target = TargetAudience.COCKTAIL_FANS;

       const newCoupon: Coupon = {
         id: Math.random().toString(36).substr(2, 9),
         barId,
         barName,
         title: selectedIdea.title,
         description: selectedIdea.description,
         code: 'KNOX' + Math.floor(Math.random() * 1000),
         discountAmount: '15% OFF',
         targetAudience: target,
         expiry: '24h'
       };
       addCoupon(newCoupon);
    }

    // Reset
    setIdeas([]);
    setProduct('');
    setGoal('');
    setSelectedIdea(null);
    alert('Campaign Published Successfully!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      
      {/* Left: AI Input */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-2 mb-4 text-neon-purple">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-lg text-white">Gemini Marketing Assistant</h3>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Describe what you want to promote, and our AI will generate catchy titles, descriptions, and targeting strategies for you.
          </p>
          
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">What are you promoting?</label>
              <input 
                type="text" 
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g., Craft IPAs, Tequila Tuesday, Live Music..."
                className="w-full bg-dark-bg border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-neon-purple focus:ring-1 focus:ring-neon-purple outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">What is your goal?</label>
              <input 
                type="text" 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Fill the patio, Attract students, Clear inventory..."
                className="w-full bg-dark-bg border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-neon-purple focus:ring-1 focus:ring-neon-purple outline-none"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isGenerating || !product || !goal}
              className="w-full bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGenerating ? 'Thinking...' : 'Generate Ideas'}
            </button>
          </form>
        </div>

        {/* Manual Toggle if they want to skip AI */}
        <div className="flex items-center justify-center text-slate-500 text-sm">
           <div className="h-px bg-slate-800 w-12 mx-2"></div>
           or
           <div className="h-px bg-slate-800 w-12 mx-2"></div>
        </div>

        <button className="w-full py-3 border border-dashed border-slate-600 text-slate-400 rounded-lg hover:border-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Create Manually (Coming Soon)
        </button>
      </div>

      {/* Right: AI Results */}
      <div className="space-y-4">
        {ideas.length > 0 && (
          <div className="mb-4 flex justify-between items-center">
             <h3 className="font-bold text-white">Select a Campaign</h3>
             <div className="flex bg-slate-800 rounded p-1">
                <button 
                  onClick={() => setFormType('deal')} 
                  className={`text-xs px-3 py-1 rounded transition-colors ${formType === 'deal' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
                >
                  Public Deal
                </button>
                <button 
                  onClick={() => setFormType('coupon')}
                  className={`text-xs px-3 py-1 rounded transition-colors ${formType === 'coupon' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
                >
                  Targeted Coupon
                </button>
             </div>
          </div>
        )}

        <div className="space-y-4">
           {ideas.map((idea, idx) => (
             <div 
               key={idx}
               onClick={() => setSelectedIdea(idea)}
               className={`cursor-pointer border rounded-xl p-4 transition-all hover:scale-[1.02] ${
                 selectedIdea === idea 
                   ? 'bg-neon-purple/10 border-neon-purple' 
                   : 'bg-dark-card border-slate-700 hover:border-slate-500'
               }`}
             >
               <div className="flex justify-between items-start">
                 <h4 className="font-bold text-white text-lg">{idea.title}</h4>
                 {selectedIdea === idea && <div className="w-3 h-3 bg-neon-purple rounded-full shadow-[0_0_10px_#a78bfa]"></div>}
               </div>
               <p className="text-slate-300 text-sm mt-1 mb-3">{idea.description}</p>
               <div className="flex items-center text-xs text-slate-400 bg-slate-800/50 inline-flex px-2 py-1 rounded">
                  <Target className="w-3 h-3 mr-1" />
                  Target: <span className="text-neon-blue ml-1">{idea.suggestedAudience}</span>
               </div>
             </div>
           ))}

           {ideas.length === 0 && !isGenerating && (
             <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl p-12">
               <Megaphone className="w-12 h-12 mb-4 opacity-20" />
               <p>Generated ideas will appear here.</p>
             </div>
           )}
        </div>

        {selectedIdea && (
          <div className="pt-4 border-t border-slate-800">
            <button 
              onClick={handlePublish}
              className="w-full bg-white text-dark-bg font-bold py-3 rounded-lg hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Publish {formType === 'deal' ? 'Deal' : 'Coupon'} Now
            </button>
          </div>
        )}
      </div>

    </div>
  );
};