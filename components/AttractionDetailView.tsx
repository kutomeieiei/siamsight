
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
    <div className="animate-fade-in-up">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-300 hover:text-yellow-400 transition-colors mb-6 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <span>{t('detailView.backButton')}</span>
      </button>

      {/* Hero Section */}
      <div className="relative w-full h-80 bg-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20 mb-8">
        <img
          src={attraction.imageUrl}
          alt={attraction.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <h1 className="text-5xl font-extrabold tracking-tight">{translatedAttractionName}</h1>
          <span className="bg-yellow-900/50 text-yellow-300 text-sm font-medium px-3 py-1 rounded-full border border-yellow-800 mt-2 inline-block">
            {t(`provinces.${attraction.province}`)}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 mb-8">
        <h2 className="text-2xl font-bold text-yellow-300 mb-3">{t('detailView.about', { name: translatedAttractionName })}</h2>
        <p className="text-slate-300 leading-relaxed">{t(`featuredAttractions.descriptions.${attraction.key}`)}</p>
      </div>
    </div>
  );
};

export default AttractionDetailView;