
import React, { useState } from 'react';
import { Shop } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface ShopCardProps {
  shop: Shop;
  isOwner?: boolean;
  onEdit?: () => void;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, isOwner, onEdit }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const { t } = useTranslation();

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 group relative border border-slate-800 hover:border-pink-400/50 hover:shadow-2xl hover:shadow-pink-500/10">
      {isOwner && (
        <button
          onClick={onEdit}
          className="absolute top-3 right-3 z-10 bg-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-pink-500 transition-colors shadow-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
          </svg>
          {t('shopCard.edit')}
        </button>
      )}
      <div className="relative h-52 bg-slate-800">
        {imageStatus === 'loading' && <div className="absolute inset-0 animate-pulse bg-slate-800"></div>}
        
        {imageStatus === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <img 
          src={shop.imageUrl} 
          alt={shop.name} 
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageStatus('loaded')}
          onError={() => setImageStatus('error')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
            <h3 className="text-xl font-bold text-white tracking-tight">{shop.name}</h3>
            <p className="text-sm text-yellow-400 font-semibold">{t(`provinces.${shop.province}`)}</p>
        </div>
      </div>
      <div className="p-5">
        <p className="text-slate-400 text-sm mb-4">{shop.description}</p>
        <div className="flex flex-wrap gap-2">
            {shop.tags.map(tag => (
                <span key={tag} className="bg-slate-800 text-pink-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-700">{tag}</span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
