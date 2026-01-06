
import React, { useState } from 'react';
import { FeaturedAttraction } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { uiAssets } from '../image_assets';

interface FeaturedAttractionCardProps {
  attraction: FeaturedAttraction;
  onSelect: (attraction: FeaturedAttraction) => void;
}

const FeaturedAttractionCard: React.FC<FeaturedAttractionCardProps> = ({ attraction, onSelect }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const { t } = useTranslation();

  return (
    <button
      onClick={() => onSelect(attraction)}
      className="relative w-full h-96 bg-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-yellow-900/10 group animate-fade-in text-left border border-slate-700 hover:border-yellow-500 transition-all duration-500"
    >
      <div className="absolute inset-0">
        {imageStatus === 'loading' && (
          <div className="w-full h-full animate-pulse bg-slate-800"></div>
        )}

        <img 
          src={imageStatus === 'error' ? uiAssets.placeholder : attraction.imageUrl} 
          alt={attraction.name} 
          loading="eager"
          className={`w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-110 ${imageStatus === 'loaded' || imageStatus === 'error' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageStatus('loaded')}
          onError={() => setImageStatus('error')}
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full">
        <span className="inline-block bg-yellow-500 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-full mb-4 border border-yellow-400/50 shadow-xl">
          {t('explore.featuredTag')}
        </span>
        <h2 className="text-3xl md:text-6xl font-black tracking-tighter leading-none mb-2 drop-shadow-2xl">
          {t(`featuredAttractions.names.${attraction.key}`)}
        </h2>
        <p className="text-lg font-black text-yellow-500 mb-4 tracking-tight drop-shadow-lg">{t(`provinces.${attraction.province}`)}</p>
        <p className="mt-2 max-w-2xl text-slate-300 text-sm md:text-base font-semibold leading-relaxed opacity-90 line-clamp-2 md:line-clamp-none">
          {t(`featuredAttractions.descriptions.${attraction.key}`)}
        </p>
      </div>
    </button>
  );
};

export default FeaturedAttractionCard;
