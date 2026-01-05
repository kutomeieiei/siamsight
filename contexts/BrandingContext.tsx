
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { branding as defaultBranding } from '../image_assets';
// Import UserUpload type for context definition
import { UserUpload } from '../types';

interface BrandingContextType {
  logoUrl: string;
  updateLogo: (newUrl: string) => void;
  resetLogo: () => void;
  // Added userPhotos to context type
  userPhotos: UserUpload[];
  // Added addUserPhoto to context type
  addUserPhoto: (photo: UserUpload) => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

const LOGO_STORAGE_KEY = 'siam-sight-custom-logo';
// Storage key for user-uploaded photos
const PHOTOS_STORAGE_KEY = 'siam-sight-user-photos-v2';

export const BrandingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState<string>(defaultBranding.logo);
  // State for storing user-uploaded photos
  const [userPhotos, setUserPhotos] = useState<UserUpload[]>([]);

  useEffect(() => {
    const savedLogo = localStorage.getItem(LOGO_STORAGE_KEY);
    if (savedLogo) setLogoUrl(savedLogo);

    // Hydrate user photos from localStorage on mount
    const savedPhotos = localStorage.getItem(PHOTOS_STORAGE_KEY);
    if (savedPhotos) {
      try {
        setUserPhotos(JSON.parse(savedPhotos));
      } catch (e) {
        console.error("Failed to recover user photos from storage", e);
      }
    }
  }, []);

  const updateLogo = (newUrl: string) => {
    setLogoUrl(newUrl);
    localStorage.setItem(LOGO_STORAGE_KEY, newUrl);
  };

  const resetLogo = () => {
    setLocaleLogo();
  };

  const setLocaleLogo = () => {
    setLogoUrl(defaultBranding.logo);
    localStorage.removeItem(LOGO_STORAGE_KEY);
  };

  // Add a new photo to the collection and persist to storage
  const addUserPhoto = (photo: UserUpload) => {
    setUserPhotos(prev => {
      const next = [photo, ...prev];
      localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <BrandingContext.Provider value={{ logoUrl, updateLogo, resetLogo, userPhotos, addUserPhoto }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) throw new Error('useBranding must be used within BrandingProvider');
  return context;
};
