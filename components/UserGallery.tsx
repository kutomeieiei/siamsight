
import React, { useRef } from 'react';
import { MY_UPLOADS } from '../my_uploads';
import UserImageCard from './UserImageCard';
import { useTranslation } from '../contexts/LanguageContext';
import { useBranding } from '../contexts/BrandingContext';
import { useAuth } from '../contexts/AuthContext';

const UserGallery: React.FC = () => {
  const { t } = useTranslation();
  const { userPhotos, addUserPhoto } = useBranding();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto = {
          imageUrl: reader.result as string,
          title: user?.username ? `${user.username}'s Discovery` : 'My Discovery',
          province: user?.province || 'Bangkok',
          description: 'Shared by explorer via mobile import.',
          isUserUploaded: true
        };
        addUserPhoto(newPhoto);
      };
      reader.readAsDataURL(file);
    }
  };

  const allPhotos = [...userPhotos, ...MY_UPLOADS];

  return (
    <div className="mb-12 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-3xl font-black text-white">{t('explore.myPhotoAlbum')}</h2>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-slate-950 font-black text-[9px] md:text-xs rounded-full hover:bg-yellow-400 transition-all active:scale-95 shadow-lg shadow-yellow-500/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          {t('explore.importPhoto')}
        </button>
      </div>
      
      <input 
        type="file" ref={fileInputRef} 
        onChange={handleImportPhoto} accept="image/*" 
        className="hidden" 
      />

      <div className="flex space-x-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {allPhotos.map((upload, index) => (
          <UserImageCard key={index} upload={upload} />
        ))}
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default UserGallery;
