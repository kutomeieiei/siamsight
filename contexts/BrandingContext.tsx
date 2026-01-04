import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { branding as defaultBranding } from '../image_assets';

interface BrandingContextType {
  logoUrl: string;
  updateLogo: (newUrl: string) => void;
  resetLogo: () => void;
  userPhotos: any[];
  addUserPhoto: (photo: any) => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

const LOGO_STORAGE_KEY = 'siam-sight-custom-logo';
const PHOTOS_STORAGE_KEY = 'siam-sight-user-photos-v1';

export const BrandingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState<string>(defaultBranding.logo);
  const [userPhotos, setUserPhotos] = useState<any[]>([]);

  useEffect(() => {
    const savedLogo = localStorage.getItem(LOGO_STORAGE_KEY);
    if (savedLogo) setLogoUrl(savedLogo);

    const savedPhotos = localStorage.getItem(PHOTOS_STORAGE_KEY);
    if (savedPhotos) {
      try {
        setUserPhotos(JSON.parse(savedPhotos));
      } catch (e) {
        console.error("Failed to load user photos", e);
      }
    }
  }, []);

  const updateLogo = (newUrl: string) => {
    setLogoUrl(newUrl);
    localStorage.setItem(LOGO_STORAGE_KEY, newUrl);
  };

  const resetLogo = () => {
    setLogoUrl(defaultBranding.logo);
    localStorage.removeItem(LOGO_STORAGE_KEY);
  };

  const addUserPhoto = (photo: any) => {
    const updated = [photo, ...userPhotos];
    setUserPhotos(updated);
    localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(updated));
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