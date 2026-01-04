
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
    className={`relative flex flex-col items-center justify-center w-full transition-all duration-300 group py-2 ${
      isActive ? 'text-yellow-400' : 'text-slate-400 hover:text-slate-100'
    } ${className}`}
    aria-label={label}
  >
    <div className={`absolute -top-3 h-1 w-10 bg-yellow-400 rounded-full transition-all duration-500 ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}></div>
    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
        {icon}
    </div>
    <span className={`text-[11px] mt-1.5 font-black tracking-wide ${isActive ? 'text-yellow-400' : 'text-slate-500'}`}>{label}</span>
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
    if (isMoreMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMoreMenuOpen]);

  const icons = {
    explore: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    itinerary: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 3l6-3" /></svg>,
    marketplace: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
    more: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t-2 border-slate-800 z-50 px-2 pb-2">
      <div className="container mx-auto flex justify-around py-3 relative">
        <NavItem icon={icons.explore} label={t('footer.explore')} isActive={activeView === View.EXPLORE} onClick={() => { setActiveView(View.EXPLORE); setIsMoreMenuOpen(false); }} />
        <NavItem icon={icons.itinerary} label={t('footer.itinerary')} isActive={activeView === View.ITINERARY} onClick={() => { setActiveView(View.ITINERARY); setIsMoreMenuOpen(false); }} />
        <NavItem icon={icons.marketplace} label={t('footer.marketplace')} isActive={activeView === View.MARKETPLACE} onClick={() => { setActiveView(View.MARKETPLACE); setIsMoreMenuOpen(false); }} />

        <div className="flex w-full relative">
          <NavItem icon={icons.more} label={t('footer.more')} isActive={isMoreMenuOpen} onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)} />
          {isMoreMenuOpen && (
            <div ref={menuRef} className="absolute bottom-20 right-0 w-64 bg-slate-900 border-2 border-yellow-600 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.2)] p-3 flex flex-col gap-2 animate-fade-in-up">
              <button onClick={() => { setActiveView(View.LEARNING); setIsMoreMenuOpen(false); }} className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all ${activeView === View.LEARNING ? 'bg-yellow-600 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'}`}>
                <span className="text-sm font-black tracking-tight">{t('footer.learning')}</span>
              </button>
              <button onClick={() => { setActiveView(View.COMMUNITY); setIsMoreMenuOpen(false); }} className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all ${activeView === View.COMMUNITY ? 'bg-yellow-600 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'}`}>
                <span className="text-sm font-black tracking-tight">{t('footer.community')}</span>
              </button>
              <button onClick={() => { setActiveView(View.CHAT); setIsMoreMenuOpen(false); }} className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all ${activeView === View.CHAT ? 'bg-yellow-600 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'}`}>
                <span className="text-sm font-black tracking-tight">{t('footer.chat')}</span>
              </button>
              <button onClick={() => { setActiveView(View.ACCOUNT); setIsMoreMenuOpen(false); }} className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all ${activeView === View.ACCOUNT ? 'bg-yellow-600 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'}`}>
                <span className="text-sm font-black tracking-tight">{t('footer.account')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default FooterNav;
