
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { useBranding } from '../contexts/BrandingContext';

const HeaderIcon = () => {
  const { logoUrl } = useBranding();
  return (
    <div className="h-12 md:h-16 flex items-center justify-start overflow-hidden">
      <img 
        src={logoUrl} 
        alt="App Logo" 
        className="h-full w-auto object-contain max-w-[200px] md:max-w-[280px] transition-all duration-500" 
      />
    </div>
  );
};


const UserDisplay: React.FC<{ user: User }> = ({ user }) => {
  const isBusiness = user.accountType === 'business';
  const displayName = isBusiness ? user.businessName : user.username;
  const colorClass = 'text-yellow-400';
  const bgClass = 'bg-yellow-500/10';
  const borderClass = 'border-yellow-500/30';

  return (
    <div className={`flex items-center gap-2 text-sm text-slate-300 rounded-full py-1.5 px-3 ${bgClass} border ${borderClass}`}>
      <span className={`font-black uppercase text-[10px] tracking-widest ${colorClass}`}>{displayName}</span>
    </div>
  );
};

const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale } = useTranslation();

    const toggleLanguage = () => {
        setLocale(locale === 'en' ? 'th' : 'en');
    };

    return (
        <button onClick={toggleLanguage} className="text-[10px] font-black tracking-widest text-slate-300 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 hover:bg-slate-800 transition-colors uppercase">
            <span className={locale === 'en' ? 'text-yellow-400' : 'text-slate-500'}>EN</span>
            <span className="text-slate-700 mx-2">|</span>
            <span className={locale === 'th' ? 'text-yellow-400' : 'text-slate-500'}>TH</span>
        </button>
    );
};


const Header: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <header className="bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto px-4 py-2 md:py-3 flex items-center justify-between">
        <div className="flex items-center">
          <HeaderIcon />
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {user && <UserDisplay user={user} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
