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
      className="bg-slate-900 rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 group border border-slate-800 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/10 text-left w-full"
    >
      <div className="relative h-52 bg-slate-800">
        {imageStatus === 'loading' && (
          <div className="absolute inset-0 animate-pulse bg-slate-800"></div>
        )}

        {imageStatus === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        <img 
          src={destination.imageUrl} 
          alt={destination.name} 
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageStatus('loaded')}
          onError={() => setImageStatus('error')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white tracking-tight">
          {t(`provinces.${destination.name}`)}
        </h3>
      </div>
      <div className="p-5">
        <p className="text-slate-400 text-sm">{destination.description}</p>
      </div>
    </button>
  );
};

export default DestinationCard;