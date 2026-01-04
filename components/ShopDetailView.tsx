
import React, { useState, useEffect } from 'react';
import { Shop, Product, View } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface ShopDetailViewProps {
  shop: Shop;
  onBack: () => void;
  setActiveView: (view: View) => void;
}

const LIKED_PRODUCTS_KEY = 'siam-sight-liked-products-v1';

const LargeContactButton: React.FC<{ href?: string; type: 'facebook' | 'phone'; label: string }> = ({ href, type, label }) => {
  if (!href) return null;

  const getIcon = () => {
    switch (type) {
      case 'facebook':
        return (
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'phone':
        return (
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      default: return null;
    }
  };

  const finalHref = type === 'phone' ? `tel:${href}` : href.startsWith('http') ? href : `https://${href}`;

  return (
    <a 
      href={finalHref} target="_blank" rel="noopener noreferrer" 
      className="flex items-center justify-center gap-3 md:gap-4 py-4 md:py-6 px-6 md:px-10 rounded-[1.5rem] md:rounded-[2rem] bg-slate-900 border-2 border-slate-800 text-white hover:bg-yellow-500 hover:text-slate-950 transition-all shadow-2xl active:scale-95 group"
    >
      <div className="p-2.5 md:p-3 bg-slate-800 rounded-xl group-hover:bg-yellow-600 transition-colors">
        {getIcon()}
      </div>
      <span className="font-black uppercase tracking-widest text-[10px] md:text-xs">{label}</span>
    </a>
  );
};

const ProductCard: React.FC<{ 
    product: Product; 
    onMoreInfo: () => void; 
    isLiked: boolean;
    t: any;
}> = ({ product, onMoreInfo, isLiked, t }) => {
    const displayLikes = (product.likeCount || 0) + (isLiked ? 1 : 0);

    return (
        <button
            onClick={onMoreInfo}
            className="group relative aspect-[4/3] w-full bg-slate-950 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden transition-all duration-300 border-2 border-slate-800 hover:border-yellow-600 shadow-2xl text-left"
        >
            <img 
                src={product.imageUrl} alt={product.name} 
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" 
            />
            
            <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/40"></div>
            
            <div className="absolute top-5 right-5 z-20 flex flex-col items-end gap-2.5">
                <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl backdrop-blur-xl border-2 transition-all duration-200 ${
                    isLiked 
                    ? 'bg-yellow-600 border-yellow-400 text-slate-950 font-black' 
                    : 'bg-slate-950/80 border-slate-700 text-slate-400'
                }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 md:h-5 md:w-5 ${isLiked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-[11px] md:text-xs font-black">{displayLikes}</span>
                </div>
                {product.price && (
                    <div className="bg-slate-950/90 backdrop-blur-md text-white text-[9px] md:text-[10px] font-black px-3.5 py-1.5 rounded-xl shadow-2xl border-2 border-slate-800">
                        {product.price}
                    </div>
                )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <h4 className="text-white font-black leading-relaxed text-xl md:text-3xl mb-3 md:mb-4 truncate group-hover:text-yellow-400 transition-colors uppercase tracking-tight">{product.name}</h4>
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="h-1 md:h-1.5 w-10 md:w-12 bg-yellow-600 rounded-full group-hover:w-20 md:group-hover:w-24 transition-all"></div>
                </div>
            </div>
        </button>
    );
};

const ProductModal: React.FC<{ 
  product: Product | null; 
  onClose: () => void; 
  shopName: string;
  isLiked: boolean;
  onToggleLike: (productName: string) => void;
  t: any;
}> = ({ product, onClose, shopName, isLiked, onToggleLike, t }) => {
  if (!product) return null;

  const displayLikes = (product.likeCount || 0) + (isLiked ? 1 : 0);

  return (
    <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center p-0 md:p-6 bg-slate-950/90 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border-2 border-slate-800 w-full max-w-xl rounded-t-[3rem] md:rounded-[3rem] overflow-hidden shadow-2xl animate-fade-in-up relative pb-10 md:pb-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 md:top-8 md:right-8 z-20 p-3 md:p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all border-2 border-slate-700 shadow-2xl active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="aspect-[4/3] relative">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-950/60"></div>
          <div className="absolute bottom-8 left-8 md:bottom-10 md:left-10 right-8 md:right-10">
            <span className="text-yellow-500 font-black text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3 md:mb-4 block">{shopName}</span>
            <h3 className="text-xl md:text-4xl font-black text-white leading-tight uppercase tracking-tighter drop-shadow-2xl">{product.name}</h3>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <p className="text-slate-300 leading-relaxed text-[11px] md:text-sm italic mb-8 md:mb-12 font-black uppercase tracking-tight">"{product.description}"</p>
          
          <div className="flex items-center justify-between mb-8 md:mb-12 pb-6 md:pb-10 border-b-2 border-slate-800">
            <div>
              <p className="text-[9px] md:text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mb-2 md:mb-3">{t('marketplace.authenticityCheck')}</p>
              <p className="text-yellow-500 font-black flex items-center gap-2.5 md:gap-3 uppercase tracking-widest text-[9px] md:text-[10px]">
                <span className="w-2 md:w-3 h-2 md:h-3 bg-yellow-500 rounded-full animate-pulse"></span>
                {t('marketplace.certified')}
              </p>
            </div>
            {product.price && (
              <div className="text-right">
                <p className="text-[9px] md:text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mb-2 md:mb-3">{t('marketplace.guidePrice')}</p>
                <p className="text-xl md:text-4xl font-black text-white tracking-tighter">{product.price}</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => onToggleLike(product.name)}
            className={`w-full py-4 md:py-7 rounded-[1.5rem] md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-3 md:gap-5 border-2 ${
                isLiked 
                ? 'bg-yellow-700 border-yellow-500 text-slate-950' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-yellow-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill={`currentColor`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isLiked ? `${t('marketplace.lovedIt')} (${displayLikes})` : `${t('marketplace.saveToFavorites')} (${displayLikes})`}
          </button>
        </div>
      </div>
    </div>
  );
};

const ShopDetailView: React.FC<ShopDetailViewProps> = ({ shop, onBack, setActiveView }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [likedProductNames, setLikedProductNames] = useState<string[]>([]);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LIKED_PRODUCTS_KEY);
    if (stored) {
      try { setLikedProductNames(JSON.parse(stored)); } catch (e) { console.error(e); }
    }
  }, []);

  const handleToggleLike = (productName: string) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    setLikedProductNames(prev => {
        const isCurrentlyLiked = prev.includes(productName);
        const next = isCurrentlyLiked ? prev.filter(name => name !== productName) : [...prev, productName];
        localStorage.setItem(LIKED_PRODUCTS_KEY, JSON.stringify(next));
        return next;
    });
  };

  return (
    <div className="animate-fade-in pb-32">
      <div className="container mx-auto px-6 pt-6 md:pt-10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-3 md:gap-5 text-slate-400 hover:text-yellow-500 transition-colors mb-8 md:mb-12 group bg-slate-900 px-5 md:px-10 py-3.5 md:py-5 rounded-[1.5rem] md:rounded-[2rem] border-2 border-slate-800 shadow-2xl active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:-translate-x-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="font-black text-[9px] md:text-xs uppercase tracking-[0.4em]">{t('shopDetail.backButton')}</span>
        </button>
      </div>

      <div className="relative w-full h-[40vh] md:h-[60vh] bg-slate-900 overflow-hidden shadow-2xl mb-12 md:mb-20">
        <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/60"></div>
        <div className="absolute bottom-0 left-0 p-8 md:p-24 w-full">
            <span className="bg-yellow-600 text-slate-950 text-[10px] md:text-xs font-black px-4 md:px-6 py-2 md:py-2.5 rounded-xl uppercase tracking-[0.4em] mb-6 md:mb-8 inline-block shadow-2xl border-2 border-yellow-500/30">
              {t(`provinces.${shop.province}`)}
            </span>
            <h1 className="text-2xl md:text-9xl font-black text-white leading-relaxed mb-6 md:mb-12 tracking-tighter drop-shadow-2xl uppercase">{shop.name}</h1>
            <div className="flex flex-wrap gap-2 md:gap-4">
              {shop.tags.map(tag => (
                <span key={tag} className="bg-slate-900/90 text-slate-400 text-[8px] md:text-xs font-black px-3 md:px-6 py-1.5 md:py-3 rounded-2xl border-2 border-slate-800 uppercase tracking-widest shadow-xl">
                  {tag}
                </span>
              ))}
            </div>
        </div>
      </div>

      <div className="container mx-auto px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 mb-20 md:mb-32 items-start">
            <div className="max-w-4xl">
                <h2 className="text-[9px] md:text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] mb-6 md:mb-8">{t('marketplace.storeHeritage')}</h2>
                <p className="text-xl md:text-4xl text-slate-200 leading-relaxed font-black uppercase tracking-tight">
                    {shop.description}
                </p>
            </div>

            <div className="bg-slate-900 border-2 border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
                <h2 className="text-[9px] md:text-[11px] font-black text-yellow-600 uppercase tracking-[0.5em] mb-8 md:mb-10 text-center">{t('marketplace.connectWithUs')}</h2>
                <div className="flex flex-col gap-4 md:gap-6">
                    <LargeContactButton href={shop.contact?.facebook} type="facebook" label={t('marketplace.officialFacebook')} />
                    <LargeContactButton href={shop.contact?.phone} type="phone" label={t('marketplace.callMerchant')} />
                </div>
            </div>
        </div>

        <div className="mb-24 md:mb-40">
          <div className="flex items-center gap-5 md:gap-10 mb-10 md:mb-20">
             <div className="h-1.5 md:h-2 w-12 md:w-24 bg-yellow-600 rounded-full"></div>
             <h2 className="text-2xl md:text-6xl font-black text-white tracking-tighter uppercase">{t('shopDetail.productsTitle')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {shop.products?.map((product, idx) => (
                <ProductCard key={idx} product={product} onMoreInfo={() => setSelectedProduct(product)} isLiked={likedProductNames.includes(product.name)} t={t} />
            ))}
          </div>
        </div>
      </div>

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        shopName={shop.name} 
        isLiked={selectedProduct ? likedProductNames.includes(selectedProduct.name) : false} 
        onToggleLike={handleToggleLike} 
        t={t}
      />
    </div>
  );
};

export default ShopDetailView;
