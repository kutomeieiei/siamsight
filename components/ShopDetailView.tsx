
import React from 'react';
import { Shop, Product } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface ShopDetailViewProps {
  shop: Shop;
  onBack: () => void;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-lg group hover:border-pink-500/30 transition-all">
    <div className="relative h-48 bg-slate-800 overflow-hidden">
      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      {product.price && (
        <div className="absolute top-3 right-3 bg-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
          {product.price}
        </div>
      )}
    </div>
    <div className="p-4">
      <h4 className="text-white font-bold leading-tight mb-1">{product.name}</h4>
    </div>
  </div>
);

const ShopDetailView: React.FC<ShopDetailViewProps> = ({ shop, onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in-up pb-20">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-300 hover:text-pink-400 transition-colors mb-6 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <span>{t('shopDetail.backButton')}</span>
      </button>

      {/* Hero Section */}
      <div className="relative w-full h-96 bg-slate-800 rounded-3xl overflow-hidden shadow-2xl mb-10">
        <img
          src={shop.imageUrl}
          alt={shop.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-10 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="text-pink-400 font-black uppercase tracking-widest text-sm mb-2 block">{t(`provinces.${shop.province}`)}</span>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">{shop.name}</h1>
            <div className="flex flex-wrap gap-2">
              {shop.tags.map(tag => (
                <span key={tag} className="bg-slate-900/80 backdrop-blur-md text-slate-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-2xl min-w-[200px]">
             <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">{t('marketplace.contactNow')}</h4>
             <div className="flex gap-4">
                {shop.contact?.facebook && <a href={`https://${shop.contact.facebook}`} target="_blank" className="text-blue-400 hover:scale-110 transition-transform"><svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>}
                {shop.contact?.phone && <a href={`tel:${shop.contact.phone}`} className="text-amber-400 hover:scale-110 transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></a>}
                {shop.contact?.website && <a href={`https://${shop.contact.website}`} target="_blank" className="text-indigo-400 hover:scale-110 transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg></a>}
             </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-4xl mx-auto mb-16 px-4">
        <p className="text-xl text-slate-300 leading-relaxed text-center font-medium italic">"{shop.description}"</p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
          <span className="w-12 h-1.5 bg-pink-600 rounded-full"></span>
          {t('shopDetail.productsTitle')}
        </h2>
        
        {shop.products && shop.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shop.products.map((product, idx) => (
              <ProductCard key={idx} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800">
             <p className="text-slate-500 font-medium">{t('shopDetail.noProducts')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetailView;
