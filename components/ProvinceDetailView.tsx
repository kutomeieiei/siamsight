import React from 'react';
import { Province, FeaturedAttraction } from '../types';
import { FEATURED_ATTRACTIONS } from '../constants';
import AttractionListCard from './AttractionListCard';
import { useTranslation } from '../contexts/LanguageContext';

interface ProvinceDetailViewProps {
  province: Province;
  onBack: () => void;
}

const ProvinceDetailView: React.FC<ProvinceDetailViewProps> = ({ province, onBack }) => {
  const { t } = useTranslation();
  const relatedAttractions = FEATURED_ATTRACTIONS.filter(
    (attraction) => attraction.province === province.name
  );
  
  const translatedProvinceName = t(`provinces.${province.name}`);

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
          src={province.imageUrl}
          alt={province.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <h1 className="text-5xl font-extrabold tracking-tight">{translatedProvinceName}</h1>
          <span className="bg-purple-900/50 text-purple-300 text-sm font-medium px-3 py-1 rounded-full border border-purple-800 mt-2 inline-block">
            {t('detailView.region', { region: t(`regions.${province.region}`) })}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 mb-8">
        <h2 className="text-2xl font-bold text-yellow-300 mb-3">{t('detailView.about', { name: translatedProvinceName })}</h2>
        <p className="text-slate-300 leading-relaxed">{province.description}</p>
      </div>

      {/* Featured Attractions Section */}
      {relatedAttractions.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">{t('detailView.featuredAttractions', { name: translatedProvinceName })}</h2>
          <div className="space-y-4">
            {relatedAttractions.map((attraction) => (
              <AttractionListCard key={attraction.name} attraction={attraction} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvinceDetailView;