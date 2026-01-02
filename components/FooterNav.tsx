
import React, { useState, useRef, useEffect } from 'react';
import { View } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface FooterNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}> = ({ icon, label, isActive, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center justify-center w-full transition-colors duration-200 group py-1 ${
      isActive ? 'text-yellow-400' : 'text-slate-400 hover:text-yellow-400'
    } ${className}`}
    aria-label={label}
  >
    <div className={`absolute -top-3 h-1 w-8 bg-yellow-400 rounded-full transition-all duration-300 ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}></div>
    {icon}
    <span className={`text-[10px] md:text-xs mt-1 font-medium ${isActive ? 'text-yellow-400' : 'text-slate-400'}`}>{label}</span>
  </button>
);

const FooterNav: React.FC<FooterNavProps> = ({ activeView, setActiveView }) => {
  const { t } = useTranslation();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    if (isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoreMenuOpen]);

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

  const marketplaceIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );

  const learningIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  const chatIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );

  const communityIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const accountIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const moreIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  );

  const isMoreViewActive = [View.COMMUNITY, View.CHAT, View.ACCOUNT, View.LEARNING].includes(activeView);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-purple-900/50 z-50 px-1">
      <div className="container mx-auto flex justify-around py-3 relative">
        <NavItem
          icon={exploreIcon}
          label={t('footer.explore')}
          isActive={activeView === View.EXPLORE}
          onClick={() => { setActiveView(View.EXPLORE); setIsMoreMenuOpen(false); }}
        />
        <NavItem
          icon={itineraryIcon}
          label={t('footer.itinerary')}
          isActive={activeView === View.ITINERARY}
          onClick={() => { setActiveView(View.ITINERARY); setIsMoreMenuOpen(false); }}
        />
        <NavItem
          icon={marketplaceIcon}
          label={t('footer.marketplace')}
          isActive={activeView === View.MARKETPLACE}
          onClick={() => { setActiveView(View.MARKETPLACE); setIsMoreMenuOpen(false); }}
        />

        {/* Desktop Only Items */}
        <NavItem
          className="hidden lg:flex"
          icon={learningIcon}
          label={t('footer.learning')}
          isActive={activeView === View.LEARNING}
          onClick={() => { setActiveView(View.LEARNING); setIsMoreMenuOpen(false); }}
        />
        <NavItem
          className="hidden md:flex"
          icon={communityIcon}
          label={t('footer.community')}
          isActive={activeView === View.COMMUNITY}
          onClick={() => { setActiveView(View.COMMUNITY); setIsMoreMenuOpen(false); }}
        />
        <NavItem
          className="hidden md:flex"
          icon={chatIcon}
          label={t('footer.chat')}
          isActive={activeView === View.CHAT}
          onClick={() => { setActiveView(View.CHAT); setIsMoreMenuOpen(false); }}
        />
        <NavItem
          className="hidden md:flex"
          icon={accountIcon}
          label={t('footer.account')}
          isActive={activeView === View.ACCOUNT}
          onClick={() => { setActiveView(View.ACCOUNT); setIsMoreMenuOpen(false); }}
        />

        {/* Mobile More Trigger */}
        <div className="flex md:hidden w-full relative">
          <NavItem
            icon={moreIcon}
            label={t('footer.more')}
            isActive={isMoreViewActive || isMoreMenuOpen}
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
          />

          {/* Overflow Menu */}
          {isMoreMenuOpen && (
            <div 
              ref={menuRef}
              className="absolute bottom-16 right-0 w-52 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 animate-fade-in-up z-50"
            >
              <button 
                onClick={() => { setActiveView(View.LEARNING); setIsMoreMenuOpen(false); }}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${activeView === View.LEARNING ? 'bg-yellow-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <div className="scale-75">{learningIcon}</div>
                <span className="text-sm font-semibold">{t('footer.learning')}</span>
              </button>
              <button 
                onClick={() => { setActiveView(View.COMMUNITY); setIsMoreMenuOpen(false); }}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${activeView === View.COMMUNITY ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <div className="scale-75">{communityIcon}</div>
                <span className="text-sm font-semibold">{t('footer.community')}</span>
              </button>
              <button 
                onClick={() => { setActiveView(View.CHAT); setIsMoreMenuOpen(false); }}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${activeView === View.CHAT ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <div className="scale-75">{chatIcon}</div>
                <span className="text-sm font-semibold">{t('footer.chat')}</span>
              </button>
              <button 
                onClick={() => { setActiveView(View.ACCOUNT); setIsMoreMenuOpen(false); }}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${activeView === View.ACCOUNT ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <div className="scale-75">{accountIcon}</div>
                <span className="text-sm font-semibold">{t('footer.account')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default FooterNav;
