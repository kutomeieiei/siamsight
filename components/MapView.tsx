
import React, { useState, useMemo } from 'react';
import { Province, FeaturedAttraction } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

type Location = (Province | FeaturedAttraction) & { type: 'province' | 'attraction' };

interface MapViewProps {
  provinces: Province[];
  attractions: FeaturedAttraction[];
  onSelectProvince: (province: Province) => void;
  onSelectAttraction: (attraction: FeaturedAttraction) => void;
}

const THAILAND_BOUNDS = {
  top: 20.5,
  bottom: 5.5,
  left: 97.3,
  right: 105.7,
};

const convertCoordsToPercent = (lat: number, lng: number) => {
  const y = ((THAILAND_BOUNDS.top - lat) / (THAILAND_BOUNDS.top - THAILAND_BOUNDS.bottom)) * 100;
  const x = ((lng - THAILAND_BOUNDS.left) / (THAILAND_BOUNDS.right - THAILAND_BOUNDS.left)) * 100;
  return { top: `${y}%`, left: `${x}%` };
};

const MapView: React.FC<MapViewProps> = ({ provinces, attractions, onSelectProvince, onSelectAttraction }) => {
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  const { t } = useTranslation();

  const locations = useMemo((): Location[] => {
    const mappedProvinces: Location[] = provinces.map(p => ({ ...p, type: 'province' }));
    const mappedAttractions: Location[] = attractions.map(a => ({ ...a, type: 'attraction' }));
    return [...mappedProvinces, ...mappedAttractions];
  }, [provinces, attractions]);

  const handleMarkerClick = (location: Location) => {
    setActiveLocation(location);
  };

  const handleDetailsClick = (location: Location) => {
    if (location.type === 'province') {
        onSelectProvince(location as Province);
    } else {
        onSelectAttraction(location as FeaturedAttraction);
    }
  };

  const renderActiveLocationMenu = () => {
    if (!activeLocation) return null;

    const locationName = activeLocation.type === 'province'
        ? t(`provinces.${activeLocation.name}`)
        : t(`featuredAttractions.names.${(activeLocation as FeaturedAttraction).key}`);
    
    const locationSubtext = activeLocation.type === 'province'
        ? t('detailView.region', { region: t(`regions.${(activeLocation as Province).region}`) })
        : t(`provinces.${(activeLocation as FeaturedAttraction).province}`);

    return (
        <div 
            key={activeLocation.name}
            className="absolute bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-80 bg-slate-900/90 backdrop-blur-xl border-2 border-yellow-600 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-30 animate-fade-in-up overflow-hidden"
        >
            <button 
                onClick={() => setActiveLocation(null)} 
                className="absolute top-4 right-4 text-yellow-500 bg-slate-950/80 backdrop-blur-md rounded-full p-2 hover:bg-yellow-500 hover:text-slate-950 focus:outline-none z-40 transition-all border border-white/10 active:scale-90 shadow-xl" 
                aria-label="Close menu"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            
            <div className="h-36 md:h-44 w-full relative overflow-hidden">
                <img src={activeLocation.imageUrl} alt={activeLocation.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
            </div>
            
            <div className="px-6 pb-7 pt-2">
                <div className="flex flex-col mb-6">
                    <span className="text-[8px] md:text-[10px] text-yellow-500 font-black uppercase tracking-[0.3em] mb-1">{locationSubtext}</span>
                    <h3 className="font-black text-white text-xl md:text-2xl truncate tracking-tight drop-shadow-lg">{locationName}</h3>
                </div>
                
                <button 
                    onClick={() => handleDetailsClick(activeLocation)}
                    className="w-full bg-yellow-600 text-slate-950 text-[10px] md:text-xs font-black py-4.5 md:py-5 rounded-2xl hover:bg-yellow-500 transition-all uppercase tracking-[0.2em] shadow-2xl border-2 border-yellow-500 active:scale-95 flex items-center justify-center gap-3"
                >
                    <span>{t('mapView.viewDetails')}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
};


  return (
    <div className="w-full aspect-[4/5] md:aspect-[4/3] max-w-4xl mx-auto bg-slate-950/30 backdrop-blur-sm rounded-[3rem] relative overflow-hidden border-2 border-slate-800 shadow-2xl animate-fade-in">
        {/* Abstract Pattern Overlay */}
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 1200'%3E%3Cpath d='M400 0 L450 50 L420 100 L480 150 L450 200 L500 250 L480 300 L520 350 L500 400 L550 450 L520 500 L580 550 L550 600 L600 650 L580 700 L620 750 L600 800 L650 850 L620 900 L680 950 L650 1000 L700 1050 L680 1100 L720 1150 L700 1200 L300 1200 L280 1150 L320 1100 L300 1050 L350 1000 L320 950 L380 900 L350 850 L400 800 L380 750 L420 700 L400 650 L450 600 L420 550 L480 500 L450 450 L500 400 L480 350 L420 300 L450 250 L400 200 L420 150 L380 100 L400 50 Z' fill='%23eab308'/%3E%3C/svg%3E")`}}></div>
        
        {locations.map((loc) => {
            const { top, left } = convertCoordsToPercent(loc.lat, loc.lng);
            const isActive = activeLocation?.name === loc.name;
            const isAttraction = loc.type === 'attraction';

            return (
                <button 
                    key={`${loc.type}-${loc.name}`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none z-10 p-2"
                    style={{ top, left }}
                    onClick={() => handleMarkerClick(loc)}
                    aria-label={`Show details for ${loc.name}`}
                >
                    <div className={`rounded-full transition-all duration-300 ${isActive ? 'ring-4 ring-offset-2 ring-offset-slate-950' : 'ring-0'} ${isAttraction ? 'ring-yellow-500' : 'ring-yellow-400'}`}>
                        {isAttraction ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 text-yellow-500 transition-transform duration-300 ${isActive ? 'scale-125 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]' : 'scale-100'}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l.293.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" />
                            </svg>
                        ) : (
                             <div className={`w-4 h-4 bg-yellow-400 rounded-full border-2 border-slate-950 transition-transform duration-300 ${isActive ? 'scale-150 shadow-[0_0_20px_rgba(234,179,8,0.6)]' : 'scale-100 hover:scale-110'}`}></div>
                        )}
                    </div>
                </button>
            );
        })}

        {renderActiveLocationMenu()}
    </div>
  );
};

export default MapView;
