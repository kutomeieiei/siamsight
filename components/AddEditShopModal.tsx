
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
  
  // Contact States
  const [facebook, setFacebook] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = shopToEdit !== null;

  useEffect(() => {
    if (shopToEdit) {
      setName(shopToEdit.name);
      setDescription(shopToEdit.description);
      setImageUrl(shopToEdit.imageUrl);
      setTags(shopToEdit.tags.join(', '));
      setFacebook(shopToEdit.contact?.facebook || '');
      setWhatsapp(shopToEdit.contact?.whatsapp || '');
      setPhone(shopToEdit.contact?.phone || '');
      setWebsite(shopToEdit.contact?.website || '');
    } else if (user?.accountType === 'business') {
      setName(user.businessName);
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
        }
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
  
  const currentProvince = shopToEdit?.province || user.province;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-lg border border-slate-700 relative my-8">
        <button onClick={closeModal} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold text-pink-300 mb-6">{isEditMode ? t('addEditShop.editTitle') : t('addEditShop.addTitle')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="shopName" className="block text-sm font-medium text-slate-300">{t('addEditShop.nameLabel')}</label>
            <input 
              id="shopName" type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="mt-1 w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-white" 
              placeholder={t('addEditShop.namePlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">{t('account.provinceLabel')}</label>
            <input type="text" value={t(`provinces.${currentProvince}`)} disabled className="mt-1 w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-400 cursor-not-allowed" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300">{t('addEditShop.descriptionLabel')}</label>
            <textarea
              id="description" value={description} onChange={(e) => setDescription(e.target.value)} required
              className="mt-1 w-full p-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-white"
              rows={3}
              placeholder={t('addEditShop.descriptionPlaceholder')}
            />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300">{t('addEditShop.imageUrlLabel')}</label>
            <input
              id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required
              className="mt-1 w-full p-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-slate-300">{t('addEditShop.tagsLabel')}</label>
            <input
              id="tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)}
              className="mt-1 w-full p-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-white"
              placeholder={t('addEditShop.tagsPlaceholder')}
            />
          </div>

          <div className="border-t border-slate-700 pt-4 mt-4">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{t('addEditShop.contactInfo')}</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label htmlFor="facebook" className="block text-xs font-medium text-slate-500">{t('addEditShop.facebookLabel')}</label>
                  <input id="facebook" type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)}
                    className="mt-1 w-full p-2 bg-slate-700/50 border border-slate-600 rounded-md text-xs text-white" placeholder="facebook.com/myshop" />
               </div>
               <div>
                  <label htmlFor="whatsapp" className="block text-xs font-medium text-slate-500">{t('addEditShop.whatsappLabel')}</label>
                  <input id="whatsapp" type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                    className="mt-1 w-full p-2 bg-slate-700/50 border border-slate-600 rounded-md text-xs text-white" placeholder="+66..." />
               </div>
               <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-slate-500">{t('addEditShop.phoneLabel')}</label>
                  <input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full p-2 bg-slate-700/50 border border-slate-600 rounded-md text-xs text-white" placeholder="08x..." />
               </div>
               <div>
                  <label htmlFor="website" className="block text-xs font-medium text-slate-500">{t('addEditShop.websiteLabel')}</label>
                  <input id="website" type="text" value={website} onChange={(e) => setWebsite(e.target.value)}
                    className="mt-1 w-full p-2 bg-slate-700/50 border border-slate-600 rounded-md text-xs text-white" placeholder="https://..." />
               </div>
             </div>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          
          <div className="pt-2">
            <button
              type="submit" disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              {isLoading ? <LoadingSpinner size={5} /> : (isEditMode ? t('addEditShop.saveButton') : t('addEditShop.createButton'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditShopModal;
