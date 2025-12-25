import React, { useState } from 'react';
import { UserUpload } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface UserImageCardProps {
  upload: UserUpload;
}

const UserImageCard: React.FC<UserImageCardProps> = ({ upload }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const { t } = useTranslation();

  return (
    <div className="w-64 h-80 bg-slate-900 rounded-xl overflow-hidden shadow-lg group border border-slate-800 text-left flex-shrink-0 snap-center">
      <div className="relative h-full">
        {imageStatus === 'loading' && (
          <div className="absolute inset-0 animate-pulse bg-slate-800"></div>
        )}

        {imageStatus === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        <img 
          src={upload.imageUrl} 
          alt={upload.title} 
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageStatus('loaded')}
          onError={() => setImageStatus('error')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-bold tracking-tight">{upload.title}</h3>
            <p className="text-sm font-medium text-yellow-300">{t(`provinces.${upload.province}`)}</p>
            <p className="text-xs text-slate-300 mt-1">{upload.description}</p>
        </div>
      </div>
    </div>
  );
};

export default UserImageCard;
