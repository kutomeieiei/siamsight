
import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../contexts/LanguageContext';

const AddEditShopModal: React.FC = () => {
  const { isModalOpen, closeModal, shopToEdit, addShop, updateShop } = useMarketplace();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  
  const [facebook, setFacebook] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = shopToEdit !== null;

  useEffect(() => {
    if (shopToEdit) {
      setName(shopToEdit.name || '');
      setDescription(shopToEdit.description || '');
      setImageUrl(shopToEdit.imageUrl || '');
      setTags(shopToEdit.tags?.join(', ') || '');
      setFacebook(shopToEdit.contact?.facebook || '');
      setWhatsapp(shopToEdit.contact?.whatsapp || '');
      setPhone(shopToEdit.contact?.phone || '');
      setWebsite(shopToEdit.contact?.website || '');
    } else if (user?.accountType === 'business') {
      setName(user.businessName || '');
      setDescription('');
      setImageUrl('');
      setTags('');
      setFacebook('');
      setWhatsapp('');
      setPhone('');
      setWebsite('');
    }
    setError('');
  }, [shopToEdit, isModalOpen, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !imageUrl) {
        setError(t('addEditShop.errorRequiredFields'));
        return;
    }
    setIsLoading(true);
    setError('');

    const shopData = {
        name,
        description,
        imageUrl,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        contact: {
          facebook: facebook || undefined,
          whatsapp: whatsapp || undefined,
          phone: phone || undefined,
          website: website || undefined,
        },
    };

    try {
        if (isEditMode) {
            updateShop(shopData);
        } else {
            addShop(shopData);
        }
        setTimeout(() => {
          setIsLoading(false);
          closeModal();
        }, 500); 
    } catch (err: any) {
        setError(err.message || 'An error occurred.');
        setIsLoading(false);
    }
  };

  if (!isModalOpen || user?.accountType !== 'business') return null;
  
  const currentProvince = (shopToEdit?.province || user.province) || '';

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-xl border-2 border-slate-800 relative my-8">
        <button onClick={closeModal} className="absolute top-8 right-8 text-slate-500 hover:text-yellow-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-3xl font-black text-yellow-500 mb-10 uppercase tracking-tighter">{isEditMode ? t('addEditShop.editTitle') : t('addEditShop.addTitle')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="shopName" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t('addEditShop.nameLabel')}</label>
            <input 
              id="shopName" type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl focus:border-yellow-600 outline-none text-white font-black uppercase tracking-widest text-xs" 
              placeholder={t('addEditShop.namePlaceholder')}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t('account.provinceLabel')}</label>
            <input type="text" value={t(`provinces.${currentProvince}`)} disabled className="w-full p-4 bg-slate-950 border-2 border-slate-800 rounded-xl text-slate-600 font-black uppercase tracking-widest text-xs cursor-not-allowed" />
          </div>
          <div>
            <label htmlFor="description" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t('addEditShop.descriptionLabel')}</label>
            <textarea
              id="description" value={description} onChange={(e) => setDescription(e.target.value)} required
              className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl focus:border-yellow-600 outline-none text-white font-black uppercase tracking-widest text-xs"
              rows={3}
              placeholder={t('addEditShop.descriptionPlaceholder')}
            />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t('addEditShop.imageUrlLabel')}</label>
            <input
              id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required
              className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl focus:border-yellow-600 outline-none text-white font-black text-xs"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="border-t-2 border-slate-800 pt-8 mt-4">
             <h3 className="text-xs font-black text-yellow-600 uppercase tracking-[0.3em] mb-6">Digital Presence</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label htmlFor="facebook" className="block text-[10px] font-black text-slate-600 uppercase mb-2">Facebook</label>
                  <input id="facebook" type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)}
                    className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl text-xs text-white" />
               </div>
               <div>
                  <label htmlFor="phone" className="block text-[10px] font-black text-slate-600 uppercase mb-2">Phone</label>
                  <input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl text-xs text-white" />
               </div>
             </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center font-black uppercase tracking-widest bg-red-950/20 p-4 rounded-xl border-2 border-red-900">{error}</p>}
          
          <div className="pt-6">
            <button
              type="submit" disabled={isLoading}
              className="w-full py-5 bg-yellow-600 text-slate-950 font-black rounded-2xl shadow-2xl active:scale-95 transition-all border-2 border-yellow-400 uppercase tracking-widest text-xs"
            >
              {isLoading ? <LoadingSpinner size={6} /> : (isEditMode ? t('addEditShop.saveButton') : t('addEditShop.createButton'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditShopModal;