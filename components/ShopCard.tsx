
import React, { useState } from 'react';
import { Shop } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface ShopCardProps {
  shop: Shop;
  onSelect?: (shop: Shop) => void;
}

const ContactIcon: React.FC<{ href?: string; type: 'facebook' | 'whatsapp' | 'phone' | 'website' }> = ({ href, type }) => {
  if (!href) return null;

  const getIcon = () => {
    switch (type) {
      case 'facebook':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'whatsapp':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.222-4.032c1.53.939 3.274 1.434 5.041 1.436 5.462 0 9.906-4.444 9.908-9.906.002-2.647-1.03-5.135-2.906-7.01s-4.363-2.908-7.012-2.91c-5.461 0-9.905 4.444-9.908 9.906-.001 1.77.497 3.498 1.438 5.025l-1.013 3.7l3.792-.993zm11.366-4.603c-.301-.151-1.784-.881-2.06-.981-.276-.1-.478-.151-.679.151-.202.301-.778 1.055-.953 1.256-.176.201-.352.226-.654.076-.301-.151-1.274-.47-2.425-1.494-.896-.8-1.499-1.787-1.674-2.088-.176-.301-.019-.464.131-.613.136-.134.301-.351.452-.526.151-.176.202-.301.302-.501.1-.201.05-.376-.026-.526-.075-.151-.679-1.636-.93-2.235-.245-.584-.492-.505-.679-.514-.175-.008-.376-.01-.577-.01s-.527.076-.803.376c-.276.301-1.055 1.029-1.055 2.509 0 1.481 1.079 2.912 1.229 3.113.151.201 2.125 3.245 5.148 4.545.719.309 1.28.494 1.716.632.722.23 1.378.197 1.898.12.579-.086 1.784-.73 2.035-1.431.25-.701.25-1.304.175-1.43-.076-.126-.276-.201-.577-.352z"/>
          </svg>
        );
      case 'phone':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'website':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        );
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'facebook':
        return "bg-blue-600/10 text-blue-500 border-blue-500/30 hover:bg-blue-600 hover:text-white";
      case 'whatsapp':
        return "bg-green-600/10 text-green-500 border-green-500/30 hover:bg-green-600 hover:text-white";
      case 'phone':
        return "bg-amber-600/10 text-amber-500 border-amber-500/30 hover:bg-amber-600 hover:text-white";
      case 'website':
        return "bg-indigo-600/10 text-indigo-500 border-indigo-500/30 hover:bg-indigo-600 hover:text-white";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700";
    }
  };

  const finalHref = type === 'whatsapp' ? `https://wa.me/${href.replace(/\+/g, '').replace(/\s/g, '')}` : type === 'phone' ? `tel:${href}` : href.startsWith('http') ? href : `https://${href}`;

  return (
    <a 
      href={finalHref} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`p-2.5 rounded-full transition-all duration-300 border shadow-sm transform hover:scale-110 ${getColorClasses()}`}
      title={type.charAt(0).toUpperCase() + type.slice(1)}
    >
      {getIcon()}
    </a>
  );
};

const ShopCard: React.FC<ShopCardProps> = ({ shop, onSelect }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const { t } = useTranslation();

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 group relative border border-slate-800 hover:border-pink-400/50 hover:shadow-2xl hover:shadow-pink-500/10 flex flex-col h-full">
      <div className="relative h-56 bg-slate-800">
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
            <h3 className="text-2xl font-black text-white tracking-tight leading-tight">{shop.name}</h3>
            <p className="text-sm text-yellow-400 font-bold uppercase tracking-wider">{t(`provinces.${shop.province}`)}</p>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <p className="text-slate-400 text-sm leading-relaxed mb-4 h-12 line-clamp-2">{shop.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
            {shop.tags.map(tag => (
                <span key={tag} className="bg-slate-800/50 text-pink-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-slate-700 tracking-wider">{tag}</span>
            ))}
        </div>
        <div className="mt-auto space-y-5">
            <button 
              onClick={() => onSelect?.(shop)}
              className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-600/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {t('marketplace.visitShop')}
            </button>
            <div className="border-t border-slate-800/50 pt-5 flex items-center justify-between">
               <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{t('marketplace.contactNow')}</span>
               <div className="flex items-center gap-3">
                  <ContactIcon href={shop.contact?.facebook} type="facebook" />
                  <ContactIcon href={shop.contact?.whatsapp} type="whatsapp" />
                  <ContactIcon href={shop.contact?.phone} type="phone" />
                  <ContactIcon href={shop.contact?.website} type="website" />
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
