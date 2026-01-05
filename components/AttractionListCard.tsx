
import React, { useState } from 'react';
import { FeaturedAttraction } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface AttractionListCardProps {
  attraction: FeaturedAttraction;
  onSelect: () => void;
}

const AttractionListCard: React.FC<AttractionListCardProps> = ({ attraction, onSelect }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const { t } = useTranslation();

  return (
    <button
      onClick={onSelect}
      className="flex items-center text-left w-full bg-slate-800/80 p-4 rounded-xl shadow-lg border border-slate-700/50 hover:bg-slate-800 hover:border-yellow-500/50 transition-all duration-300 group"
    >
      <div className="flex-shrink-0 w-32 h-24 bg-slate-700 rounded-lg overflow-hidden">
         {imageStatus === 'loading' && <div className="w-full h-full animate-pulse bg-slate-700"></div>}
         {imageStatus === 'error' && (
          <div className="w-full h-full flex items-center justify-center bg-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <img
          src={attraction.imageUrl}
          alt={attraction.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageStatus('loaded')}
          onError={() => setImageStatus('error')}
        />
      </div>
      <div className="ml-5">
        <h3 className="text-lg font-black text-white tracking-tight group-hover:text-yellow-400 transition-colors">
          {t(`featuredAttractions.names.${attraction.key}`)}
        </h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 italic">
          {t(`featuredAttractions.descriptions.${attraction.key}`)}
        </p>
      </div>
    </button>
  );
};

export default AttractionListCard;
