
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

// Bounding box for Thailand for lat/lng to pixel conversion
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

  const renderActiveLocationPopup = () => {
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
            className="absolute bg-slate-800/80 backdrop-blur-md rounded-lg shadow-2xl w-64 border border-slate-700 z-20 animate-fade-in-up"
            style={convertCoordsToPercent(activeLocation.lat, activeLocation.lng)}
        >
            <button onClick={() => setActiveLocation(null)} className="absolute -top-2 -right-2 text-slate-300 bg-slate-700 rounded-full p-0.5 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 z-30" aria-label="Close popup">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            <div className="h-28 w-full bg-slate-700 rounded-t-lg">
                <img src={activeLocation.imageUrl} alt={activeLocation.name} className="w-full h-full object-cover rounded-t-lg" />
            </div>
            <div className="p-3">
                <h3 className="font-bold text-white truncate">{locationName}</h3>
                <p className="text-sm text-slate-400 mb-3">{locationSubtext}</p>
                <button 
                    onClick={() => handleDetailsClick(activeLocation)}
                    className="w-full bg-purple-600 text-white text-sm font-semibold py-2 rounded-md hover:bg-purple-500 transition-colors"
                >
                    {t('mapView.viewDetails')}
                </button>
            </div>
        </div>
    );
};


  return (
    <div className="w-full aspect-[4/3] max-w-4xl mx-auto bg-slate-800 rounded-2xl relative overflow-hidden border-2 border-slate-700 shadow-2xl animate-fade-in">
        {/* Stylized Map Background */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 1200'%3E%3Cpath d='M400 0 L450 50 L420 100 L480 150 L450 200 L500 250 L480 300 L520 350 L500 400 L550 450 L520 500 L580 550 L550 600 L600 650 L580 700 L620 750 L600 800 L650 850 L620 900 L680 950 L650 1000 L700 1050 L680 1100 L720 1150 L700 1200 L300 1200 L280 1150 L320 1100 L300 1050 L350 1000 L320 950 L380 900 L350 850 L400 800 L380 750 L420 700 L400 650 L450 600 L420 550 L480 500 L450 450 L500 400 L480 350 L420 300 L450 250 L400 200 L420 150 L380 100 L400 50 Z' fill='%230f172a'/%3E%3C/svg%3E")`}}></div>
        
        {locations.map((loc) => {
            const { top, left } = convertCoordsToPercent(loc.lat, loc.lng);
            const isActive = activeLocation?.name === loc.name;
            const isAttraction = loc.type === 'attraction';

            return (
                <button 
                    key={`${loc.type}-${loc.name}`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none z-10"
                    style={{ top, left }}
                    onClick={() => handleMarkerClick(loc)}
                    aria-label={`Show details for ${loc.name}`}
                >
                    <div className={`rounded-full transition-all duration-300 ${isActive ? 'ring-4 ring-offset-2 ring-offset-slate-800' : 'ring-0'} ${isAttraction ? 'ring-yellow-400' : 'ring-pink-400'}`}>
                        {isAttraction ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-yellow-400 transition-transform duration-300 ${isActive ? 'scale-125' : 'scale-100'}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l.293.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" />
                            </svg>
                        ) : (
                             <div className={`w-3 h-3 bg-pink-400 rounded-full border-2 border-slate-800 transition-transform duration-300 ${isActive ? 'scale-125' : 'scale-100'}`}></div>
                        )}
                    </div>
                </button>
            );
        })}

        {/* Active Location Popup */}
        {renderActiveLocationPopup()}
    </div>
  );
};

export default MapView;