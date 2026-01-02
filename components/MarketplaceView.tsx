
import React, { useState, useMemo } from 'react';
import ShopCard from './ShopCard';
import { LOCAL_SHOPS } from '../constants';
import { useTranslation } from '../contexts/LanguageContext';
import { Shop } from '../types';

interface MarketplaceViewProps {
  onSelectShop: (shop: Shop) => void;
}

const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onSelectShop }) => {
  const { t } = useTranslation();
  const [provinceQuery, setProvinceQuery] = useState('');

  const filteredShops = useMemo(() => {
    if (!provinceQuery.trim()) return LOCAL_SHOPS;
    
    const lowerQuery = provinceQuery.toLowerCase();
    return LOCAL_SHOPS.filter(shop => {
      const translatedProvince = t(`provinces.${shop.province}`).toLowerCase();
      const originalProvince = shop.province.toLowerCase();
      return translatedProvince.includes(lowerQuery) || originalProvince.includes(lowerQuery);
    });
  }, [provinceQuery, t]);

  return (
    <div className="animate-fade-in pb-20 max-w-[1600px] mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-white mb-2">
          {t('marketplace.title')}
        </h2>
        <div className="h-1.5 w-24 bg-pink-500 mx-auto rounded-full mb-4"></div>
        <p className="text-slate-400 max-w-lg mx-auto">{t('marketplace.subtitle')}</p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-12 max-w-2xl mx-auto">
        <div className="relative flex-grow w-full">
          <input
            type="text"
            value={provinceQuery}
            onChange={(e) => setProvinceQuery(e.target.value)}
            placeholder={t('marketplace.searchPlaceholder')}
            className="w-full p-4 pl-12 text-lg bg-slate-900/50 border-2 border-slate-700 rounded-full focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none text-slate-100 transition-all duration-300"
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {provinceQuery && (
            <button 
                onClick={() => setProvinceQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          )}
        </div>
      </div>
      
      {filteredShops.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <p className="text-slate-400 text-lg">{t('marketplace.noResultsMessage')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredShops.map((shop) => (
            <ShopCard 
              key={shop.id} 
              shop={shop} 
              onSelect={onSelectShop}
            />
          ))}
        </div>
      )}

      {/* Merchant Contact Footer */}
      <div className="mt-20 py-8 border-t border-slate-800 text-center">
        <p className="text-pink-400/70 text-sm font-medium italic tracking-wide max-w-lg mx-auto px-4">
          {t('marketplace.merchantContact')}
        </p>
      </div>
    </div>
  );
};

export default MarketplaceView;
