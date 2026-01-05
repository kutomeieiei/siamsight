
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ItineraryResult, Shop } from '../types';
import { INTEREST_KEYS, PROVINCES, LOCAL_SHOPS } from '../constants';
import { generateItinerary } from '../services/geminiService';
import ItineraryDisplay from './ItineraryDisplay';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../contexts/LanguageContext';

const ItineraryPlanner: React.FC = () => {
  const [duration, setDuration] = useState<number>(7);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedShopIds, setSelectedShopIds] = useState<string[]>([]);
  const [shopSearchQuery, setShopSearchQuery] = useState<string>('');
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState<boolean>(false);
  const [itineraryResult, setItineraryResult] = useState<ItineraryResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t, locale } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsShopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const addShop = (shopId: string) => {
    if (!selectedShopIds.includes(shopId)) {
      setSelectedShopIds([...selectedShopIds, shopId]);
    }
    setShopSearchQuery('');
    setIsShopDropdownOpen(false);
  };

  const removeShop = (shopId: string) => {
    setSelectedShopIds(selectedShopIds.filter(id => id !== shopId));
  };

  const handleSubmit = async () => {
    if (selectedInterests.length === 0) {
      setError(t('itineraryPlanner.errorSelectInterest'));
      return;
    }
    setError(null);
    setIsLoading(true);
    setItineraryResult(null);

    try {
      const translatedInterests = selectedInterests.map(key => t(`interests.${key}`));
      const provinceName = selectedProvince ? t(`provinces.${selectedProvince}`) : '';
      
      const shopNames = selectedShopIds.map(id => {
          const shop = LOCAL_SHOPS.find(s => s.id === id);
          if (!shop) return '';
          return locale === 'th' ? shop.nameTh : shop.nameEn;
      }).filter(Boolean);

      const result = await generateItinerary(
        duration, 
        translatedInterests, 
        provinceName, 
        locale,
        shopNames
      );
      setItineraryResult(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const sortedProvinces = [...PROVINCES].sort((a, b) => 
    t(`provinces.${a.name}`).localeCompare(t(`provinces.${b.name}`))
  );

  const filteredShopResults = useMemo(() => {
    const query = shopSearchQuery.toLowerCase();
    if (!query && !selectedProvince) return [];
    
    return LOCAL_SHOPS.filter(shop => {
        const shopName = locale === 'th' ? shop.nameTh : shop.nameEn;
        const matchesQuery = !query || shopName.toLowerCase().includes(query) || t(`provinces.${shop.province}`).toLowerCase().includes(query);
        const matchesProvince = !selectedProvince || shop.province === selectedProvince;
        const notSelected = !selectedShopIds.includes(shop.id);
        return matchesQuery && matchesProvince && notSelected;
    });
  }, [shopSearchQuery, selectedProvince, selectedShopIds, t, locale]);

  const selectedShopsData = useMemo(() => {
    return selectedShopIds.map(id => LOCAL_SHOPS.find(s => s.id === id)).filter(Boolean) as Shop[];
  }, [selectedShopIds]);

  return (
    <div className="animate-fade-in pb-12">
      <div className="text-center px-4 mt-6 md:mt-0">
        <h2 className="text-2xl md:text-5xl font-black mb-3 text-white tracking-tighter">{t('itineraryPlanner.title')}</h2>
        <p className="text-slate-400 mb-10 text-sm md:text-lg">{t('itineraryPlanner.subtitle')}</p>
      </div>
      
      <div className="max-w-2xl mx-auto thai-glass p-6 md:p-10 rounded-3xl shadow-2xl border border-yellow-500/10 mx-4 md:mx-auto">
        <div className="mb-8">
          <label htmlFor="itinerary-province" className="block text-slate-500 font-black mb-4 text-[10px] md:text-xs tracking-tight">
            {t('itineraryPlanner.provinceLabel')}
          </label>
          <select 
            id="itinerary-province"
            value={selectedProvince} 
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setSelectedShopIds([]); 
            }}
            className="w-full p-4 md:p-5 bg-slate-800 border-2 border-slate-700 rounded-2xl focus:border-yellow-600 focus:outline-none text-white appearance-none cursor-pointer transition-all font-black text-sm md:text-base"
          >
            <option value="">{t('itineraryPlanner.anywhere')}</option>
            {sortedProvinces.map(p => (
                <option key={p.name} value={p.name}>{t(`provinces.${p.name}`)}</option>
            ))}
          </select>
        </div>

        <div className="mb-10 relative" ref={dropdownRef}>
          <label className="block text-slate-500 font-black mb-4 text-[10px] md:text-xs tracking-tight">
            {t('itineraryPlanner.shopLabel')}
          </label>
          
          <div className="relative">
            <input
              type="text"
              value={shopSearchQuery}
              onChange={(e) => {
                setShopSearchQuery(e.target.value);
                setIsShopDropdownOpen(true);
              }}
              onFocus={() => setIsShopDropdownOpen(true)}
              placeholder={t('itineraryPlanner.shopSearchPlaceholder')}
              className="w-full p-4 md:p-5 bg-slate-800 border-2 border-slate-700 rounded-2xl focus:border-yellow-600 focus:outline-none text-white placeholder-slate-600 transition-all font-black text-sm md:text-base"
            />
          </div>

          {isShopDropdownOpen && (shopSearchQuery || (selectedProvince && filteredShopResults.length > 0)) && (
            <div className="absolute z-30 w-full mt-2 bg-slate-800 border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
              {filteredShopResults.length > 0 ? (
                filteredShopResults.map(shop => {
                  const shopName = locale === 'th' ? shop.nameTh : shop.nameEn;
                  return (
                    <button
                      key={shop.id}
                      onClick={() => addShop(shop.id)}
                      className="w-full px-5 md:px-6 py-3.5 md:py-4 text-left hover:bg-slate-700 transition-colors flex items-center justify-between border-b border-slate-700 last:border-0"
                    >
                      <div>
                        <div className="font-black text-white text-xs md:text-sm">{shopName}</div>
                        <div className="text-[9px] md:text-[10px] text-yellow-500 font-black tracking-tight mt-1">{t(`provinces.${shop.province}`)}</div>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  );
                })
              ) : (
                <div className="p-5 text-slate-500 text-xs italic font-bold">{t('marketplace.noResultsMessage')}</div>
              )}
            </div>
          )}

          {selectedShopsData.length > 0 && (
            <div className="mt-6">
              <span className="block text-slate-600 text-[9px] md:text-[10px] font-black tracking-tight mb-3">{t('itineraryPlanner.selectedShopsLabel')}</span>
              <div className="flex flex-wrap gap-2">
                {selectedShopsData.map(shop => {
                  const shopName = locale === 'th' ? shop.nameTh : shop.nameEn;
                  return (
                    <div 
                      key={shop.id}
                      className="bg-yellow-900/40 text-yellow-400 border-2 border-yellow-800 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[10px] md:text-xs font-black flex items-center gap-2 md:gap-3 animate-fade-in"
                    >
                      <span>{shopName}</span>
                      <button onClick={() => removeShop(shop.id)} className="text-yellow-500 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mb-10">
          <label htmlFor="duration" className="block text-slate-500 font-black mb-4 text-[10px] md:text-xs tracking-tight">
            {t('itineraryPlanner.durationLabel')}: <span className="text-yellow-400 text-lg md:text-xl ml-2 font-black tracking-tight">{t('itineraryPlanner.days', { count: duration })}</span>
          </label>
          <input
            id="duration"
            type="range"
            min="3"
            max="21"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full h-2.5 md:h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-yellow-500"
          />
        </div>

        <div className="mb-10">
          <h3 className="block text-slate-500 font-black mb-4 text-[10px] md:text-xs tracking-tight">{t('itineraryPlanner.interestsLabel')}</h3>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {INTEREST_KEYS.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`px-4 py-2.5 md:px-6 md:py-3 text-[10px] md:text-xs rounded-xl transition-all duration-200 border-2 font-black tracking-tight ${
                  selectedInterests.includes(interest)
                    ? 'bg-yellow-600 text-slate-950 border-yellow-400 shadow-xl'
                    : 'bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-500'
                }`}
              >
                {t(`interests.${interest}`)}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-400 text-center mb-6 text-xs md:text-sm font-black bg-red-950/20 p-4 rounded-xl border-2 border-red-900">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-yellow-500 text-slate-950 font-black py-4 md:py-5 rounded-2xl shadow-2xl transition-all disabled:bg-slate-800 disabled:text-slate-600 flex items-center justify-center text-base md:text-lg tracking-tight active:scale-95"
        >
          {isLoading ? <LoadingSpinner /> : t('itineraryPlanner.generateButton')}
        </button>
      </div>
      
      {isLoading && (
         <div className="text-center mt-10 md:mt-12 animate-fade-in px-4">
            <p className="text-yellow-500 text-xl md:text-2xl font-black mb-2 tracking-tight">{t('itineraryPlanner.loadingMessage')}</p>
            <p className="text-slate-500 text-[10px] md:text-sm font-black tracking-tight">{t('itineraryPlanner.loadingSubMessage')}</p>
         </div>
      )}

      {itineraryResult && <ItineraryDisplay result={itineraryResult} />}
    </div>
  );
};

export default ItineraryPlanner;
