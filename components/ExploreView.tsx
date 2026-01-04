
import React, { useState, useMemo, useEffect } from 'react';
import { PROVINCES, REGION_KEYS, FEATURED_ATTRACTIONS } from '../constants';
import DestinationCard from './DestinationCard';
import FeaturedAttractionCard from './FeaturedAttractionCard';
import { Province, FeaturedAttraction } from '../types';
import MapView from './MapView';
import { useTranslation } from '../contexts/LanguageContext';
import UserGallery from './UserGallery';

const RegionHeadingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-yellow-500">
    <path d="M12.48,2.59a2.33,2.33,0,0,0-1,0,1,1,0,0,0-.42.82,10.2,10.2,0,0,1-.5,2.75,3.13,3.13,0,0,1-3,2.5,3.28,3.28,0,0,1-2.29-1,1,1,0,0,0-1.2-.21L2.4,8.6a1,1,0,0,0-.43,1.38,13.8,13.8,0,0,0,4.2,6.44,14.2,14.2,0,0,0,10.4,4,1,1,0,0,0,1-.75,12.2,12.2,0,0,0,.7-4.57,1,1,0,0,0-1-1.06,3.13,3.13,0,0,1-2.5-3.06,3.7,3.7,0,0,1,1.1-2.58,1,1,0,0,0-.09-1.4Z" />
    <path d="M18.89,3.11a1,1,0,0,0-1.4,0l-1.8,1.8a1,1,0,0,0,0,1.4,0.78,0.78,0,0,1,0,1.1,1,1,0,0,0,0,1.4,0.78,0.78,0,0,1,0,1.1,1,1,0,0,0,1.4,0l3.5-3.5A1,1,0,0,0,18.89,3.11Z" />
  </svg>
);

interface ExploreViewProps {
  onSelectProvince: (province: Province) => void;
  onSelectAttraction: (attraction: FeaturedAttraction) => void;
}

const ExploreView: React.FC<ExploreViewProps> = ({ onSelectProvince, onSelectAttraction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndex((prevIndex) => (prevIndex + 1) % FEATURED_ATTRACTIONS.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredResults = useMemo(() => {
    if (!searchQuery) {
      return { provinces: [], attractions: [] };
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    const provinces = PROVINCES.filter(p =>
      t(`provinces.${p.name}`).toLowerCase().includes(lowerCaseQuery)
    );
    const attractions = FEATURED_ATTRACTIONS.filter(a =>
      t(`featuredAttractions.names.${a.key}`).toLowerCase().includes(lowerCaseQuery) || 
      t(`provinces.${a.province}`).toLowerCase().includes(lowerCaseQuery)
    );
    return { provinces, attractions };
  }, [searchQuery, t]);

  const provincesByRegion = useMemo(() => {
    const grouped: { [key: string]: Province[] } = {};
    for (const province of PROVINCES) {
      if (!grouped[province.region]) {
        grouped[province.region] = [];
      }
      if (!grouped[province.region].some(p => p.name === province.name)) {
        grouped[province.region].push(province);
      }
    }
    return grouped;
  }, []);
  
  const ListView = () => (
    <div className="space-y-12 md:space-y-24">
      {REGION_KEYS.map((region) => (
        <section key={region} className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10">
             <RegionHeadingIcon />
             <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase">{t(`regions.${region}`)}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {provincesByRegion[region].map((province) => (
              <DestinationCard key={`${region}-${province.name}`} destination={province} onSelect={onSelectProvince} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );

  const SearchResultsView = () => (
     <div className="animate-fade-in max-w-[1200px] mx-auto px-4">
        <h3 className="text-xl md:text-3xl font-black mb-8 md:mb-10 text-slate-200 uppercase tracking-tight">
          {filteredResults.provinces.length + filteredResults.attractions.length > 0 
            ? t('explore.searchResults', { query: searchQuery })
            : t('explore.noResults', { query: searchQuery })}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {filteredResults.provinces.map((province) => (
            <DestinationCard key={province.name} destination={province} onSelect={onSelectProvince} />
          ))}
          {filteredResults.attractions.map((attraction) => (
             <DestinationCard key={attraction.name} destination={{...attraction, region: 'North'}} onSelect={() => onSelectAttraction(attraction)} />
          ))}
        </div>
      </div>
  );

  return (
    <div className="animate-fade-in pb-32">
      <div className="mb-10 md:mb-16 px-4">
        <FeaturedAttractionCard 
          attraction={FEATURED_ATTRACTIONS[featuredIndex]} 
          onSelect={onSelectAttraction} 
        />
      </div>

      <div className="px-4">
        <UserGallery />
      </div>

      <div className="text-center mb-10 md:mb-16 px-4 mt-6 md:mt-0">
          <h2 className="text-2xl md:text-7xl font-black mb-4 text-yellow-500 tracking-tighter uppercase leading-[0.9]">{t('explore.title')}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-[11px] md:text-lg font-bold uppercase tracking-[0.15em] opacity-80">{t('explore.subtitle')}</p>
      </div>

      <div className="flex justify-center mb-10 md:mb-16 px-4">
          <div className="thai-glass p-1.5 rounded-[2rem] flex items-center border border-yellow-500/20 shadow-2xl">
              <button 
                  onClick={() => setViewMode('list')}
                  className={`px-5 md:px-10 py-3 md:py-4 text-[9px] md:text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${viewMode === 'list' ? 'bg-yellow-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                  {t('explore.listView')}
              </button>
              <button 
                  onClick={() => setViewMode('map')}
                  className={`px-5 md:px-10 py-3 md:py-4 text-[9px] md:text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${viewMode === 'map' ? 'bg-yellow-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                  {t('explore.mapView')}
              </button>
          </div>
      </div>
      
      <div className="mb-12 md:mb-24 max-w-3xl mx-auto px-6">
        <div className="relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t('explore.searchPlaceholder')}
            className="w-full p-4 md:p-6 pl-12 md:pl-14 text-sm md:text-lg bg-slate-900/80 backdrop-blur-md border-2 border-slate-800 rounded-[2rem] md:rounded-[2.5rem] focus:border-yellow-600 focus:outline-none text-slate-100 transition-all duration-300 shadow-2xl font-black uppercase tracking-widest"
          />
          <svg className="absolute left-4 md:left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-yellow-600 group-focus-within:text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
       {viewMode === 'list' && (
        searchQuery ? <SearchResultsView /> : <ListView />
      )}
      
      {viewMode === 'map' && (
        <MapView
          provinces={searchQuery ? filteredResults.provinces : PROVINCES}
          attractions={searchQuery ? filteredResults.attractions : FEATURED_ATTRACTIONS}
          onSelectProvince={onSelectProvince}
          onSelectAttraction={onSelectAttraction}
        />
      )}
    </div>
  );
};

export default ExploreView;
