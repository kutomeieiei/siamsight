import React from 'react';
import { View } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface FooterNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  // FIX: Changed type from JSX.Element to React.ReactNode to resolve namespace error.
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center justify-center w-full transition-colors duration-200 group ${
      isActive ? 'text-yellow-400' : 'text-slate-400 hover:text-yellow-400'
    }`}
    aria-label={label}
  >
    <div className={`absolute -top-3 h-1 w-8 bg-yellow-400 rounded-full transition-all duration-300 ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}></div>
    {icon}
    <span className={`text-xs mt-1 font-medium ${isActive ? 'text-yellow-400' : 'text-slate-400'}`}>{label}</span>
  </button>
);

const FooterNav: React.FC<FooterNavProps> = ({ activeView, setActiveView }) => {
  const { t } = useTranslation();
  const exploreIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const itineraryIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 3l6-3" />
    </svg>
  );

  const chatIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );

  const marketplaceIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );

  const accountIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-purple-900/50 z-10">
      <div className="container mx-auto flex justify-around py-3">
        <NavItem
          icon={exploreIcon}
          label={t('footer.explore')}
          isActive={activeView === View.EXPLORE}
          onClick={() => setActiveView(View.EXPLORE)}
        />
        <NavItem
          icon={itineraryIcon}
          label={t('footer.itinerary')}
          isActive={activeView === View.ITINERARY}
          onClick={() => setActiveView(View.ITINERARY)}
        />
        <NavItem
          icon={chatIcon}
          label={t('footer.chat')}
          isActive={activeView === View.CHAT}
          onClick={() => setActiveView(View.CHAT)}
        />
        <NavItem
          icon={marketplaceIcon}
          label={t('footer.marketplace')}
          isActive={activeView === View.MARKETPLACE}
          onClick={() => setActiveView(View.MARKETPLACE)}
        />
        <NavItem
          icon={accountIcon}
          label={t('footer.account')}
          isActive={activeView === View.ACCOUNT}
          onClick={() => setActiveView(View.ACCOUNT)}
        />
      </div>
    </footer>
  );
};

export default FooterNav;