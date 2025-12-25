import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

const HeaderIcon = () => (
  <svg
    viewBox="0 0 36 36"
    className="w-10 h-10"
    aria-hidden="true"
  >
    <defs>
      <clipPath id="circleClip">
        <circle cx="18" cy="18" r="18" />
      </clipPath>
    </defs>
    <g clipPath="url(#circleClip)">
      {/* Thai flag stripes. Ratio 1:1:2:1:1. Total height 36px (6px per unit) */}
      <rect width="36" height="36" fill="#A51931" /> {/* Red */}
      <rect width="36" height="24" y="6" fill="#FFFFFF" /> {/* White */}
      <rect width="36" height="12" y="12" fill="#2E2A4D" /> {/* Blue */}
    </g>
  </svg>
);


const UserDisplay: React.FC<{ user: User }> = ({ user }) => {
  const isBusiness = user.accountType === 'business';
  const displayName = isBusiness ? user.businessName : user.username;
  const colorClass = isBusiness ? 'text-pink-300' : 'text-purple-300';
  const bgClass = isBusiness ? 'bg-pink-500/10' : 'bg-purple-500/10';
  const borderClass = isBusiness ? 'border-pink-500/20' : 'border-purple-500/20';

  return (
    <div className={`flex items-center gap-2 text-sm text-slate-300 rounded-full py-1.5 px-3 ${bgClass} border ${borderClass}`}>
      <span className={`font-bold ${colorClass}`}>{displayName}</span>
    </div>
  );
};

const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale } = useTranslation();

    const toggleLanguage = () => {
        setLocale(locale === 'en' ? 'th' : 'en');
    };

    return (
        <button onClick={toggleLanguage} className="text-sm font-semibold text-slate-300 bg-slate-800/50 border border-slate-700 rounded-full px-3 py-1.5 hover:bg-slate-700 transition-colors">
            <span className={locale === 'en' ? 'text-yellow-400' : 'text-slate-400'}>EN</span>
            <span className="text-slate-600 mx-1">/</span>
            <span className={locale === 'th' ? 'text-yellow-400' : 'text-slate-400'}>TH</span>
        </button>
    );
};


const Header: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  return (
    <header className="bg-black/50 backdrop-blur-lg sticky top-0 z-20 border-b border-purple-900/50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <HeaderIcon />
          <h1 className="text-2xl font-bold tracking-wider text-white ml-2">
            {t('header.amazing')} <span className="bg-gradient-to-r from-pink-400 to-yellow-400 text-transparent bg-clip-text">{t('header.thailand')}</span>
          </h1>
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