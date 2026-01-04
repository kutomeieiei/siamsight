
import React, { useState } from 'react';
import { Province } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface DestinationCardProps {
  destination: Province;
  onSelect: (destination: Province) => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onSelect }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const { t } = useTranslation();

  return (
    <button
      onClick={() => onSelect(destination)}
      className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl transform transition-all duration-300 group border border-slate-800 hover:border-yellow-600 text-left w-full relative aspect-[4/3]"
    >
      <div className="absolute inset-0">
        {imageStatus === 'loading' && (
          <div className="absolute inset-0 animate-pulse bg-slate-900"></div>
        )}

        <img 
          src={destination.imageUrl} 
          alt={destination.name} 
          className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageStatus('loaded')}
          onError={() => setImageStatus('error')}
        />
        <div className="absolute inset-0 bg-slate-950/60 transition-colors group-hover:bg-slate-950/40"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 p-8 w-full">
        <div className="mb-4">
            <span className="bg-yellow-500 text-slate-950 text-[9px] font-black px-4 py-1.5 rounded uppercase tracking-[0.25em] shadow-2xl border border-yellow-400/30">
                {t(`regions.${destination.region}`)}
            </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-4 leading-none drop-shadow-2xl">
          {t(`provinces.${destination.name}`)}
        </h3>
        <div className="h-1 w-10 bg-yellow-500 transition-all group-hover:w-16 rounded-full mb-4"></div>
        <p className="text-slate-300 text-xs font-semibold line-clamp-2 opacity-90 leading-relaxed tracking-tight">
          {destination.description}
        </p>
      </div>
    </button>
  );
};

export default DestinationCard;