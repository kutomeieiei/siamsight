
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
    <div className="animate-fade-in pb-32">
      <div className="relative w-full h-[40vh] md:h-[60vh] bg-slate-900 overflow-hidden shadow-2xl">
        <img
          src={province.imageUrl}
          alt={province.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/60"></div>
        
        <button
          onClick={onBack}
          className="absolute top-6 left-6 md:top-8 md:left-8 z-10 p-3 md:p-4 bg-slate-900 hover:bg-yellow-600 text-yellow-500 hover:text-slate-950 rounded-2xl backdrop-blur-md transition-all border-2 border-slate-700 active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full">
          <span className="bg-yellow-500 text-slate-950 text-[10px] md:text-xs font-black px-4 md:px-5 py-1.5 md:py-2 rounded-xl uppercase tracking-widest mb-4 md:mb-6 inline-block shadow-2xl border-2 border-yellow-400/30">
            {t(`regions.${province.region}`)}
          </span>
          <h1 className="text-3xl md:text-8xl font-black text-white tracking-tighter uppercase leading-tight drop-shadow-2xl">{translatedProvinceName}</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-10 mt-12 md:mt-16">
        <div className="max-w-4xl mb-16 md:mb-24">
          <h2 className="text-[10px] md:text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4 md:mb-6">{t('detailView.about', { name: translatedProvinceName })}</h2>
          <p className="text-xl md:text-3xl text-slate-200 leading-relaxed font-black uppercase tracking-tight">
            {province.description}
          </p>
        </div>

        {relatedAttractions.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center gap-4 md:gap-6 mb-10 md:mb-12">
               <div className="h-1.5 md:h-2 w-12 md:w-16 bg-yellow-600 rounded-full"></div>
               <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase">{t('detailView.featuredAttractions', { name: '' })}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {relatedAttractions.map((attraction) => (
                <AttractionListCard key={attraction.name} attraction={attraction} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvinceDetailView;
