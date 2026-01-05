
import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../contexts/LanguageContext';

const AddEditShopModal: React.FC = () => {
  const { isModalOpen, closeModal, shopToEdit, addShop, updateShop } = useMarketplace();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [nameEn, setNameEn] = useState('');
  const [nameTh, setNameTh] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionTh, setDescriptionTh] = useState('');
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
      setNameEn(shopToEdit.nameEn || '');
      setNameTh(shopToEdit.nameTh || '');
      setDescriptionEn(shopToEdit.descriptionEn || '');
      setDescriptionTh(shopToEdit.descriptionTh || '');
      setImageUrl(shopToEdit.imageUrl || '');
      setTags(shopToEdit.tags?.join(', ') || '');
      setFacebook(shopToEdit.contact?.facebook || '');
      setWhatsapp(shopToEdit.contact?.whatsapp || '');
      setPhone(shopToEdit.contact?.phone || '');
      setWebsite(shopToEdit.contact?.website || '');
    } else if (user?.accountType === 'business') {
      setNameEn(user.businessName || '');
      setNameTh('');
      setDescriptionEn('');
      setDescriptionTh('');
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
    if (!nameEn || !nameTh || !descriptionEn || !descriptionTh || !imageUrl) {
        setError(t('addEditShop.errorRequiredFields'));
        return;
    }
    setIsLoading(true);
    setError('');

    const shopData = {
        nameEn,
        nameTh,
        descriptionEn,
        descriptionTh,
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
        
        <h2 className="text-3xl font-black text-yellow-500 mb-10 tracking-tighter">{isEditMode ? t('addEditShop.editTitle') : t('addEditShop.addTitle')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="shopNameEn" className="block text-[10px] font-black text-slate-500 tracking-tight mb-2">Shop name (English)</label>
                <input 
                id="shopNameEn" type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)} required
                className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl focus:border-yellow-600 outline-none text-white font-black tracking-tight text-xs" 
                placeholder="e.g. Lanna Crafts"
                />
            </div>
            <div>
                <label htmlFor="shopNameTh" className="block text-[10px] font-black text-slate-500 tracking-tight mb-2">Shop name (Thai)</label>
                <input 
                id="shopNameTh" type="text" value={nameTh} onChange={(e) => setNameTh(e.target.value)} required
                className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl focus:border-yellow-600 outline-none text-white font-black tracking-tight text-xs" 
                placeholder="เช่น หัตถกรรมล้านนา"
                />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 tracking-tight mb-2">{t('account.provinceLabel')}</label>
            <input type="text" value={t(`provinces.${currentProvince}`)} disabled className="w-full p-4 bg-slate-950 border-2 border-slate-800 rounded-xl text-slate-600 font-black tracking-tight text-xs cursor-not-allowed" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="descriptionEn" className="block text-[10px] font-black text-slate-500 tracking-tight mb-2">Description (English)</label>
                <textarea
                id="descriptionEn" value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} required
                className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl focus:border-yellow-600 outline-none text-white font-black tracking-tight text-xs"
                rows={3}
                placeholder="Describe your shop in English..."
                />
            </div>
            <div>
                <label htmlFor="descriptionTh" className="block text-[10px] font-black text-slate-500 tracking-tight mb-2">Description (Thai)</label>
                <textarea
                id="descriptionTh" value={descriptionTh} onChange={(e) => setDescriptionTh(e.target.value)} required
                className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl focus:border-yellow-600 outline-none text-white font-black tracking-tight text-xs"
                rows={3}
                placeholder="อธิบายร้านค้าเป็นภาษาไทย..."
                />
            </div>
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-[10px] font-black text-slate-500 tracking-tight mb-2">{t('addEditShop.imageUrlLabel')}</label>
            <input
              id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required
              className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl focus:border-yellow-600 outline-none text-white font-black text-xs"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="border-t-2 border-slate-800 pt-8 mt-4">
             <h3 className="text-xs font-black text-yellow-600 tracking-tight mb-6">Digital Presence</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label htmlFor="facebook" className="block text-[10px] font-black text-slate-600 mb-2">Facebook</label>
                  <input id="facebook" type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)}
                    className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl text-xs text-white" />
               </div>
               <div>
                  <label htmlFor="phone" className="block text-[10px] font-black text-slate-600 mb-2">Phone</label>
                  <input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl text-xs text-white" />
               </div>
             </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center font-black tracking-tight bg-red-950/20 p-4 rounded-xl border-2 border-red-900">{error}</p>}
          
          <div className="pt-6">
            <button
              type="submit" disabled={isLoading}
              className="w-full py-5 bg-yellow-600 text-slate-950 font-black rounded-2xl shadow-2xl active:scale-95 transition-all border-2 border-yellow-400 tracking-tight text-xs"
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
