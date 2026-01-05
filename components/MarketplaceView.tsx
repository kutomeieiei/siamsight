
import React, { useState, useMemo, useEffect } from 'react';
import ShopCard from './ShopCard';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Shop, View } from '../types';

interface MarketplaceViewProps {
  onSelectShop: (shop: Shop) => void;
  setActiveView: (view: View) => void;
}

const STORAGE_KEY = 'siam-sight-liked-shops';

const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onSelectShop, setActiveView }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { shops } = useMarketplace();
  const [provinceQuery, setProvinceQuery] = useState('');
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [likedShopIds, setLikedShopIds] = useState<string[]>([]);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setLikedShopIds(JSON.parse(stored)); } catch (e) { console.error(e); }
    }
  }, []);

  const toggleLike = (shopId: string) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    setLikedShopIds(prev => {
      const next = prev.includes(shopId) ? prev.filter(id => id !== shopId) : [...prev, shopId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const filteredShops = useMemo(() => {
    let list = [...shops];
    if (showLikedOnly) list = list.filter(shop => likedShopIds.includes(shop.id));
    if (provinceQuery.trim()) {
      const lowerQuery = provinceQuery.toLowerCase();
      list = list.filter(shop => t(`provinces.${shop.province}`).toLowerCase().includes(lowerQuery));
    }
    return list;
  }, [provinceQuery, showLikedOnly, likedShopIds, t, shops]);

  return (
    <div className="animate-fade-in pb-32 max-w-[1400px] mx-auto px-4">
      <div className="text-center mb-10 md:mb-16 mt-6 md:mt-0">
        <h2 className="text-3xl md:text-7xl font-black text-yellow-500 mb-4 tracking-tighter">
          {t('marketplace.title')}
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-lg tracking-tight font-black">"{t('marketplace.subtitle')}"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 md:mb-16 max-w-3xl mx-auto">
        <div className="relative group">
          <input
            type="text"
            value={provinceQuery}
            onChange={(e) => setProvinceQuery(e.target.value)}
            placeholder={t('marketplace.searchPlaceholder')}
            className="w-full p-4 md:p-6 pl-12 md:pl-14 bg-slate-900 border-2 border-slate-800 rounded-2xl focus:border-yellow-600 focus:outline-none text-slate-100 font-black transition-all shadow-xl tracking-tight text-xs md:text-base"
          />
          <svg className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-yellow-600 group-focus-within:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button 
            onClick={() => setShowLikedOnly(!showLikedOnly)}
            className={`w-full py-4 md:py-6 px-6 md:px-8 rounded-2xl font-black text-[10px] md:text-xs tracking-tight transition-all flex items-center justify-center gap-3 md:gap-4 border-2 shadow-xl active:scale-95 ${
                showLikedOnly 
                ? 'bg-yellow-600 border-yellow-400 text-slate-950' 
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-yellow-600'
            }`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            {t('marketplace.favorites')} ({likedShopIds.length})
        </button>
      </div>
      
      {filteredShops.length === 0 ? (
        <div className="py-24 md:py-32 text-center bg-slate-950/40 rounded-3xl border-2 border-slate-900 shadow-inner">
            <p className="text-slate-600 text-xl md:text-2xl font-black tracking-tight">{t('marketplace.noResultsMessage')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} onSelect={onSelectShop} isLiked={likedShopIds.includes(shop.id)} onToggleLike={() => toggleLike(shop.id)} />
          ))}
        </div>
      )}

      <div className="mt-16 md:mt-24 text-center">
          <p className="text-[10px] md:text-xs text-slate-600 font-black tracking-tight max-w-md mx-auto leading-relaxed">{t('marketplace.merchantContact')}</p>
      </div>

      {showAuthPrompt && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in">
          <div className="bg-slate-900 border-2 border-yellow-600 w-full max-w-md p-8 md:p-10 rounded-3xl shadow-2xl animate-fade-in-up">
            <h3 className="text-2xl md:text-3xl font-black text-white text-center mb-4 tracking-tighter">{t('marketplace.authModalTitle')}</h3>
            <p className="text-slate-500 text-center mb-8 md:mb-10 font-black tracking-tight text-[10px]">"{t('marketplace.authModalDesc')}"</p>
            <div className="space-y-4">
              <button onClick={() => setActiveView(View.ACCOUNT)} className="w-full py-4 md:py-5 bg-yellow-600 text-slate-950 font-black rounded-xl shadow-xl active:scale-95 transition-all border-2 border-yellow-400 tracking-tight text-[10px] md:text-xs">
                {t('marketplace.authModalLogin')}
              </button>
              <button onClick={() => setShowAuthPrompt(false)} className="w-full py-3 md:py-4 text-slate-600 font-black tracking-tight text-[9px] md:text-[10px] hover:text-yellow-500 transition-colors">
                {t('marketplace.authModalCancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceView;
