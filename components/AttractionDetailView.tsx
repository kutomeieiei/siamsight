
import React from 'react';
import { FeaturedAttraction } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface AttractionDetailViewProps {
  attraction: FeaturedAttraction;
  onBack: () => void;
}

const AttractionDetailView: React.FC<AttractionDetailViewProps> = ({ attraction, onBack }) => {
  const { t } = useTranslation();
  const translatedAttractionName = t(`featuredAttractions.names.${attraction.key}`);
  
  return (
    <div className="animate-fade-in pb-32">
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-slate-900 overflow-hidden shadow-2xl">
        <img
          src={attraction.imageUrl}
          alt={attraction.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/60"></div>
        
        <button
          onClick={onBack}
          className="absolute top-8 left-8 z-10 p-4 bg-slate-900 hover:bg-yellow-600 text-yellow-500 hover:text-slate-950 rounded-2xl backdrop-blur-md transition-all border-2 border-slate-700 active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="absolute bottom-0 left-0 p-10 md:p-16 w-full">
          <span className="bg-yellow-600 text-slate-950 text-xs font-black px-5 py-2 rounded-xl uppercase tracking-widest mb-6 inline-block shadow-2xl">
            {t(`provinces.${attraction.province}`)}
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-tight drop-shadow-2xl">{translatedAttractionName}</h1>
        </div>
      </div>

      <div className="container mx-auto px-10 mt-16">
        <div className="max-w-4xl">
          <h2 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6">{t('detailView.about', { name: '' })}</h2>
          <p className="text-2xl md:text-3xl text-slate-200 leading-relaxed font-black uppercase tracking-tight">
            {t(`featuredAttractions.descriptions.${attraction.key}`)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttractionDetailView;