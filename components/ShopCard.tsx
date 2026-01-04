
import React from 'react';
import { Shop } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface ShopCardProps {
  shop: Shop;
  onSelect?: (shop: Shop) => void;
  isLiked?: boolean;
  onToggleLike?: () => void;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, onSelect, isLiked = false, onToggleLike }) => {
  const { t } = useTranslation();
  const displayLikes = (shop.likeCount || 0) + (isLiked ? 1 : 0);

  return (
    <button
      onClick={() => onSelect?.(shop)}
      className="group relative aspect-[4/3] w-full bg-slate-950 rounded-3xl overflow-hidden transition-all duration-300 border-2 border-slate-800 hover:border-yellow-500 shadow-xl text-left"
    >
      <img 
        src={shop.imageUrl} alt={shop.name} 
        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
      />
      
      <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/40 transition-colors"></div>

      <div className="absolute top-6 right-6 z-20">
        <button 
            onClick={(e) => { e.stopPropagation(); onToggleLike?.(); }}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-xl backdrop-blur-xl border-2 transition-all duration-200 active:scale-90 shadow-xl ${
                isLiked 
                  ? 'bg-yellow-600 border-yellow-400 text-slate-950 font-black' 
                  : 'bg-slate-950/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLiked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs font-black">{displayLikes}</span>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-10 flex flex-col justify-end">
        <div className="mb-4">
            <span className="bg-yellow-600 text-slate-950 text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.2em] shadow-xl border border-yellow-500/30">
                {t(`provinces.${shop.province}`)}
            </span>
        </div>
        
        <h3 className="text-white font-black text-3xl leading-tight mb-6 tracking-tighter group-hover:text-yellow-400 transition-colors uppercase">
            {shop.name}
        </h3>
        
        <div className="h-1 w-12 bg-yellow-500 rounded-full group-hover:w-20 transition-all"></div>
      </div>
    </button>
  );
};

export default ShopCard;
