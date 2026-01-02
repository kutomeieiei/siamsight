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
          return shop ? shop.name : '';
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
        const matchesQuery = !query || shop.name.toLowerCase().includes(query) || t(`provinces.${shop.province}`).toLowerCase().includes(query);
        const matchesProvince = !selectedProvince || shop.province === selectedProvince;
        const notSelected = !selectedShopIds.includes(shop.id);
        return matchesQuery && matchesProvince && notSelected;
    });
  }, [shopSearchQuery, selectedProvince, selectedShopIds, t]);

  const selectedShopsData = useMemo(() => {
    return selectedShopIds.map(id => LOCAL_SHOPS.find(s => s.id === id)).filter(Boolean) as Shop[];
  }, [selectedShopIds]);

  const showLocalWarning = selectedShopIds.length > 0 && (selectedShopIds.length / duration > 1.5);

  return (
    <div className="animate-fade-in pb-12">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-pink-300 to-yellow-300 text-transparent bg-clip-text">{t('itineraryPlanner.title')}</h2>
        <p className="text-slate-400 mb-8">{t('itineraryPlanner.subtitle')}</p>
      </div>
      
      <div className="max-w-2xl mx-auto bg-slate-900/50 p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-800 backdrop-blur-md">
        {/* Province Selection */}
        <div className="mb-6">
          <label htmlFor="itinerary-province" className="block text-slate-300 font-bold mb-3 text-sm uppercase tracking-wider">
            {t('itineraryPlanner.provinceLabel')}
          </label>
          <select 
            id="itinerary-province"
            value={selectedProvince} 
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setSelectedShopIds([]); // Reset shops when province changes
            }}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-white appearance-none cursor-pointer transition-all"
          >
            <option value="">{t('itineraryPlanner.anywhere')}</option>
            {sortedProvinces.map(p => (
                <option key={p.name} value={p.name}>{t(`provinces.${p.name}`)}</option>
            ))}
          </select>
        </div>

        {/* Shop Search & Selection */}
        <div className="mb-8 relative" ref={dropdownRef}>
          <label className="block text-slate-300 font-bold mb-3 text-sm uppercase tracking-wider">
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
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-white placeholder-slate-500 transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Results Dropdown */}
          {isShopDropdownOpen && (shopSearchQuery || (selectedProvince && filteredShopResults.length > 0)) && (
            <div className="absolute z-30 w-full mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
              {filteredShopResults.length > 0 ? (
                filteredShopResults.map(shop => (
                  <button
                    key={shop.id}
                    onClick={() => addShop(shop.id)}
                    className="w-full px-5 py-3 text-left hover:bg-pink-600/20 hover:text-pink-300 transition-colors flex items-center justify-between border-b border-slate-700 last:border-0"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{shop.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{t(`provinces.${shop.province}`)}</div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                ))
              ) : (
                <div className="p-4 text-slate-500 text-sm italic">{t('marketplace.noResultsMessage')}</div>
              )}
            </div>
          )}

          {/* Selected Shops Chips */}
          {selectedShopsData.length > 0 && (
            <div className="mt-4">
              <span className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{t('itineraryPlanner.selectedShopsLabel')}</span>
              <div className="flex flex-wrap gap-2">
                {selectedShopsData.map(shop => (
                  <div 
                    key={shop.id}
                    className="bg-pink-600/20 text-pink-300 border border-pink-500/30 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 animate-fade-in"
                  >
                    <span>{shop.name}</span>
                    <button onClick={() => removeShop(shop.id)} className="text-pink-400 hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Local Feasibility Warning */}
        {showLocalWarning && (
            <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-2xl animate-pulse flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-yellow-400 text-sm font-medium leading-relaxed">
                    {t('itineraryPlanner.localWarning', { count: selectedShopIds.length, days: duration })}
                </p>
            </div>
        )}

        {/* Duration */}
        <div className="mb-8">
          <label htmlFor="duration" className="block text-slate-300 font-bold mb-3 text-sm uppercase tracking-wider">
            {t('itineraryPlanner.durationLabel')}: <span className="text-yellow-400 font-black text-lg">{t('itineraryPlanner.days', { count: duration })}</span>
          </label>
          <input
            id="duration"
            type="range"
            min="3"
            max="21"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
        </div>

        {/* Interests */}
        <div className="mb-8">
          <h3 className="block text-slate-300 font-bold mb-3 text-sm uppercase tracking-wider">{t('itineraryPlanner.interestsLabel')}</h3>
          <div className="flex flex-wrap gap-2">
            {INTEREST_KEYS.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`px-4 py-2 text-xs rounded-full transition-all duration-200 border-2 font-bold ${
                  selectedInterests.includes(interest)
                    ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-yellow-500 hover:text-white'
                }`}
              >
                {t(`interests.${interest}`)}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-400 text-center mb-4 text-sm font-bold bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-yellow-500 text-white font-black py-4 rounded-2xl hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center text-lg transform hover:scale-[1.02] active:scale-95 disabled:transform-none"
        >
          {isLoading ? <LoadingSpinner /> : t('itineraryPlanner.generateButton')}
        </button>
      </div>
      
      {isLoading && (
         <div className="text-center mt-12 animate-fade-in">
            <div className="flex justify-center mb-4">
                <LoadingSpinner size={12} />
            </div>
            <p className="text-white text-xl font-black mb-1">{t('itineraryPlanner.loadingMessage')}</p>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">{t('itineraryPlanner.loadingSubMessage')}</p>
         </div>
      )}

      {itineraryResult && <ItineraryDisplay result={itineraryResult} />}
    </div>
  );
};

export default ItineraryPlanner;