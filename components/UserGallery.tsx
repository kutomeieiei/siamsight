import React from 'react';
import { MY_UPLOADS } from '../my_uploads';
import UserImageCard from './UserImageCard';
import { useTranslation } from '../contexts/LanguageContext';

const UserGallery: React.FC = () => {
  const { t } = useTranslation();

  if (!MY_UPLOADS || MY_UPLOADS.length === 0) {
    return null;
  }

  return (
    <div className="mb-12 animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-6">{t('explore.myPhotoAlbum')}</h2>
      <div className="flex space-x-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {MY_UPLOADS.map((upload, index) => (
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
