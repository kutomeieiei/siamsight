
import React, { useState } from 'react';
import { FeaturedAttraction } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

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
      className="relative w-full h-96 bg-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20 group animate-fade-in text-left"
    >
      {/* Background Image & Loaders */}
      <div className="absolute inset-0">
        {imageStatus === 'loading' && (
          <div className="w-full h-full animate-pulse bg-slate-800"></div>
        )}

        {imageStatus === 'error' && (
          <div className="w-full h-full flex items-center justify-center bg-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <img 
          src={attraction.imageUrl} 
          alt={attraction.name} 
          className={`w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110 ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageStatus('loaded')}
          onError={() => setImageStatus('error')}
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
        <span className="inline-block bg-yellow-500/20 text-yellow-300 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-yellow-500/50">
          {t('explore.featuredTag')}
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {t(`featuredAttractions.names.${attraction.key}`)}
        </h2>
        <p className="text-lg font-medium text-slate-300">{t(`provinces.${attraction.province}`)}</p>
        <p className="mt-2 max-w-2xl text-slate-300">
          {t(`featuredAttractions.descriptions.${attraction.key}`)}
        </p>
      </div>
    </button>
  );
};

export default FeaturedAttractionCard;