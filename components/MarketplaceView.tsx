
import React from 'react';
import ShopCard from './ShopCard';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import { View } from '../types';

interface MarketplaceViewProps {
  setActiveView: (view: View) => void;
}

const MarketplaceView: React.FC<MarketplaceViewProps> = ({ setActiveView }) => {
  const { shops, openModalToEdit, openModalToAdd } = useMarketplace();
  const { user } = useAuth();
  const { t } = useTranslation();

  const isBusiness = user?.accountType === 'business';
  const myShop = isBusiness ? shops.find(shop => shop.id === user.businessName) : null;

  const handleCtaClick = () => {
    if (!user) {
      setActiveView(View.ACCOUNT);
    } else if (user.accountType === 'personal') {
      setActiveView(View.ACCOUNT);
    } else {
      openModalToAdd();
    }
  };

  return (
    <div className="animate-fade-in pb-20">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-white mb-2">
          {t('marketplace.title')}
        </h2>
        <div className="h-1.5 w-24 bg-pink-500 mx-auto rounded-full mb-4"></div>
        <p className="text-slate-400 max-w-lg mx-auto">{t('marketplace.subtitle')}</p>
      </div>
      
      {/* Floating Action Button (FAB) for Sellers */}
      {!myShop && (
        <button 
          onClick={handleCtaClick}
          className="fixed bottom-24 right-6 z-40 bg-pink-600 text-white p-4 rounded-2xl shadow-2xl shadow-pink-600/40 border-2 border-pink-400 flex items-center gap-3 hover:bg-pink-500 transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="bg-white/20 p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="font-bold pr-2">{t('marketplace.addYourShopTitle')}</span>
        </button>
      )}

      {shops.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center bg-slate-900/40 rounded-3xl border border-slate-800">
          <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
             </svg>
          </div>
          <p className="text-slate-500 text-xl font-medium">{t('marketplace.emptyMessage')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {shops.map((shop) => {
            const isOwner = user?.accountType === 'business' && user.businessName === shop.id;
            return (
              <ShopCard 
                key={shop.id} 
                shop={shop} 
                isOwner={isOwner}
                onEdit={() => openModalToEdit(shop)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MarketplaceView;
