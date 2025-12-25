
import React, { useState, useMemo, useEffect } from 'react';
import { PROVINCES, REGION_KEYS, FEATURED_ATTRACTIONS } from '../constants';
import DestinationCard from './DestinationCard';
import FeaturedAttractionCard from './FeaturedAttractionCard';
import { Province, FeaturedAttraction } from '../types';
import MapView from './MapView';
import { useTranslation } from '../contexts/LanguageContext';
import UserGallery from './UserGallery';

const RegionHeadingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-yellow-400">
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
    }, 10000); // Change every 10 seconds

    return () => clearInterval(timer); // Cleanup on component unmount
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
    <div className="space-y-16">
      {REGION_KEYS.map((region) => (
        <section key={region}>
          <div className="flex items-center gap-4 mb-6">
             <RegionHeadingIcon />
             <h3 className="text-3xl font-bold text-white tracking-wide">{t(`regions.${region}`)}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {provincesByRegion[region].map((province) => (
              <DestinationCard key={`${region}-${province.name}`} destination={province} onSelect={onSelectProvince} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );

  const SearchResultsView = () => (
     <div className="animate-fade-in">
        <h3 className="text-2xl font-bold mb-6 text-slate-200">
          {filteredResults.provinces.length + filteredResults.attractions.length > 0 
            ? t('explore.searchResults', { query: searchQuery })
            : t('explore.noResults', { query: searchQuery })}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.provinces.map((province) => (
            <DestinationCard key={province.name} destination={province} onSelect={onSelectProvince} />
          ))}
          {/* Note: In a real app, you might want a different card for attractions in search results */}
          {filteredResults.attractions.map((attraction) => (
             <DestinationCard key={attraction.name} destination={{...attraction, region: 'North'}} onSelect={() => onSelectAttraction(attraction)} />
          ))}
        </div>
      </div>
  );


  return (
    <div className="animate-fade-in">
      {/* Featured Attraction Section */}
      <div className="mb-12">
        <FeaturedAttractionCard 
          attraction={FEATURED_ATTRACTIONS[featuredIndex]} 
          onSelect={onSelectAttraction} 
        />
      </div>

      {/* User Photo Gallery */}
      <UserGallery />

      <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-pink-300 to-yellow-300 text-transparent bg-clip-text">{t('explore.title')}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t('explore.subtitle')}</p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center mb-6">
          <div className="bg-slate-800 p-1 rounded-full flex items-center border border-slate-700">
              <button 
                  onClick={() => setViewMode('list')}
                  className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-purple-900/50'}`}
              >
                  {t('explore.listView')}
              </button>
              <button 
                  onClick={() => setViewMode('map')}
                  className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${viewMode === 'map' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-purple-900/50'}`}
              >
                  {t('explore.mapView')}
              </button>
          </div>
      </div>
      
      {/* Search Bar */}
      <div className="mb-12 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t('explore.searchPlaceholder')}
            className="w-full p-4 pl-12 text-lg bg-slate-900/50 border-2 border-slate-700 rounded-full focus:ring-4 focus:ring-yellow-500/50 focus:border-yellow-500 focus:outline-none text-slate-100 transition-all duration-300"
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
