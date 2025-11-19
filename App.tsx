import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { UserView } from './components/UserView';
import { BarOwnerView } from './components/BarOwnerView';
import { MOCK_BARS, MOCK_DEALS, MOCK_COUPONS, MOCK_USER } from './constants';
import { Deal, Coupon, UserProfile, Bar } from './types';
import { Beer, Wallet, Store, User } from 'lucide-react';

// Main App Component
export default function App() {
  // Global State for the demo
  const [bars, setBars] = useState<Bar[]>(MOCK_BARS);
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USER);

  // Handlers to modify state from child components
  const addDeal = (newDeal: Deal) => {
    setDeals(prev => [newDeal, ...prev]);
  };

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons(prev => [newCoupon, ...prev]);
  };

  return (
    <HashRouter>
      <AppContent 
        bars={bars}
        deals={deals} 
        coupons={coupons} 
        currentUser={currentUser}
        addDeal={addDeal}
        addCoupon={addCoupon}
      />
    </HashRouter>
  );
}

interface AppContentProps {
  bars: Bar[];
  deals: Deal[];
  coupons: Coupon[];
  currentUser: UserProfile;
  addDeal: (d: Deal) => void;
  addCoupon: (c: Coupon) => void;
}

function AppContent({ bars, deals, coupons, currentUser, addDeal, addCoupon }: AppContentProps) {
  const location = useLocation();
  const isOwnerRoute = location.pathname.includes('/owner');

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100 font-sans selection:bg-neon-purple selection:text-white">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-neon-purple to-neon-blue rounded-lg flex items-center justify-center shadow-lg shadow-neon-purple/20">
              <Beer className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              KnoxNights
            </h1>
          </div>

          <nav className="flex space-x-1 bg-slate-800/50 p-1 rounded-full">
             <NavLink to="/" icon={<User className="w-4 h-4" />} label="Patron" active={!isOwnerRoute} />
             <NavLink to="/owner" icon={<Store className="w-4 h-4" />} label="Bar Owner" active={isOwnerRoute} />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 pb-24">
        <Routes>
          <Route path="/" element={<UserView bars={bars} deals={deals} coupons={coupons} user={currentUser} />} />
          <Route path="/owner" element={<BarOwnerView addDeal={addDeal} addCoupon={addCoupon} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Mobile Bottom Nav (only shows on small screens for User View) */}
      {!isOwnerRoute && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-card border-t border-slate-800 pb-safe z-50">
          <div className="flex justify-around items-center h-16">
             <div className="flex flex-col items-center text-slate-400 hover:text-neon-blue">
                <Store className="w-6 h-6" />
                <span className="text-[10px] mt-1">Bars</span>
             </div>
             <div className="flex flex-col items-center text-slate-400 hover:text-neon-blue">
                <Wallet className="w-6 h-6" />
                <span className="text-[10px] mt-1">Wallet</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavLink({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-1.5 rounded-full transition-all text-sm font-medium ${
        active 
          ? 'bg-slate-700 text-white shadow-sm' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}