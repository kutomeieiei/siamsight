
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useCommunity } from '../contexts/CommunityContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import LoadingSpinner from './LoadingSpinner';
import { PROVINCES } from '../constants';
import { View } from '../types';

const CommunityMessageBubble: React.FC<{ 
  message: any; 
  isOwn: boolean; 
  t: (k: string, r?: any) => string;
  showProvince?: boolean;
}> = ({ message, isOwn, t, showProvince = false }) => {
  return (
    <div className={`flex flex-col mb-6 ${isOwn ? 'items-end' : 'items-start'}`}>
      <div className="flex items-center gap-3 mb-2 px-2">
        <span className={`text-[10px] md:text-xs font-black tracking-wide ${isOwn ? 'text-yellow-400' : 'text-yellow-500'}`}>
          {message.senderName}
          {message.senderProvince && showProvince && (
            <span className="ml-2 opacity-50 font-black">
               • {t('community.from')} {t(`provinces.${message.senderProvince}`)}
            </span>
          )}
        </span>
        <span className="text-[9px] text-slate-600 font-bold tracking-tight">
          {message.timestamp && new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <div 
        className={`max-w-[85%] px-5 md:px-6 py-3 md:py-4 rounded-2xl shadow-2xl border-2 ${
          isOwn 
            ? 'bg-yellow-600 text-slate-950 rounded-tr-none border-yellow-500' 
            : 'bg-slate-800 text-slate-200 rounded-tl-none border-slate-700'
        }`}
      >
        <p className="text-sm md:text-base font-black leading-relaxed whitespace-pre-wrap tracking-tight">{message.text}</p>
      </div>
    </div>
  );
};

interface CommunityViewProps {
  setActiveView?: (view: View) => void;
}

const CommunityView: React.FC<CommunityViewProps> = ({ setActiveView }) => {
  const { messages, sendMessage, isLoading } = useCommunity();
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [selectedHub, setSelectedHub] = useState<string>('all'); 
  const [hubSearchQuery, setHubSearchQuery] = useState<string>('');
  const [inputText, setInputText] = useState('');
  // Set to true by default for "automatic" full screen
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
      if (header) header.style.visibility = 'hidden';
      if (footer) footer.style.visibility = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (header) header.style.visibility = 'visible';
      if (footer) footer.style.visibility = 'visible';
    }
    return () => {
      document.body.style.overflow = '';
      if (header) header.style.visibility = 'visible';
      if (footer) footer.style.visibility = 'visible';
    };
  }, [isFullScreen]);

  // Click outside menu listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const filteredMessages = useMemo(() => {
    if (selectedHub === 'all') return messages;
    return messages.filter(m => m.senderProvince === selectedHub);
  }, [messages, selectedHub]);

  const sortedHubs = useMemo(() => {
    const list = [...PROVINCES].sort((a, b) => 
        t(`provinces.${a.name}`).localeCompare(t(`provinces.${b.name}`))
    );
    
    if (!hubSearchQuery.trim()) return list;
    
    const query = hubSearchQuery.toLowerCase();
    return list.filter(p => 
        t(`provinces.${p.name}`).toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query)
    );
  }, [t, hubSearchQuery]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredMessages, selectedHub]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const targetProvince = selectedHub === 'all' ? undefined : selectedHub;
    sendMessage(inputText.trim(), targetProvince);
    setInputText('');
  };

  const handleNavigate = (view: View) => {
    // When navigating away, restore normal scroll/view visibility
    setIsFullScreen(false);
    setIsMenuOpen(false);
    if (setActiveView) setActiveView(view);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <LoadingSpinner size={12} />
      </div>
    );
  }

  const currentUserName = user?.username;

  return (
    <div className={`${isFullScreen ? 'fixed inset-0 z-[100] w-screen h-screen bg-slate-950 p-0 overflow-hidden flex flex-col' : 'flex flex-col h-[calc(100vh-220px)] max-w-2xl mx-auto bg-slate-900/60 rounded-3xl shadow-2xl overflow-hidden border-2 border-slate-800 animate-fade-in'}`}>
      <div className={`p-6 md:p-8 border-b-2 border-slate-800 bg-slate-900 ${isFullScreen ? 'pt-10' : ''}`}>
        <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col">
              <h3 className="text-lg md:text-xl font-black text-white tracking-tight">{t('community.hubTitle')}</h3>
              <p className="text-[9px] md:text-[10px] text-yellow-500 font-black tracking-widest">{selectedHub === 'all' ? t('community.allProvinces') : t(`provinces.${selectedHub}`)}</p>
            </div>
            
            <div className="relative">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2.5 md:p-3 bg-slate-800 hover:bg-slate-700 text-yellow-500 hover:text-white rounded-xl transition-all border-2 border-slate-700 active:scale-90"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                </button>

                {isMenuOpen && (
                    <div ref={menuRef} className="absolute top-full right-0 mt-4 w-60 bg-slate-900 border-2 border-yellow-600 rounded-[2rem] shadow-[0_0_50px_rgba(234,179,8,0.3)] p-3 z-[110] animate-fade-in-up flex flex-col gap-1">
                        <div className="px-4 py-2 border-b border-slate-800 mb-2">
                             <p className="text-[9px] font-black uppercase text-yellow-500 tracking-[0.3em]">{t('community.navigateMenu')}</p>
                        </div>
                        <button onClick={() => handleNavigate(View.EXPLORE)} className="flex items-center w-full p-4 rounded-xl text-slate-300 hover:bg-slate-800 font-black tracking-tight text-sm text-left">{t('footer.explore')}</button>
                        <button onClick={() => handleNavigate(View.ITINERARY)} className="flex items-center w-full p-4 rounded-xl text-slate-300 hover:bg-slate-800 font-black tracking-tight text-sm text-left">{t('footer.itinerary')}</button>
                        <button onClick={() => handleNavigate(View.MARKETPLACE)} className="flex items-center w-full p-4 rounded-xl text-slate-300 hover:bg-slate-800 font-black tracking-tight text-sm text-left">{t('footer.marketplace')}</button>
                        <button onClick={() => handleNavigate(View.CHAT)} className="flex items-center w-full p-4 rounded-xl text-slate-300 hover:bg-slate-800 font-black tracking-tight text-sm text-left">{t('footer.chat')}</button>
                        <button onClick={() => handleNavigate(View.LEARNING)} className="flex items-center w-full p-4 rounded-xl text-slate-300 hover:bg-slate-800 font-black tracking-tight text-sm text-left">{t('footer.learning')}</button>
                        <button onClick={() => handleNavigate(View.ACCOUNT)} className="flex items-center w-full p-4 rounded-xl text-slate-300 hover:bg-slate-800 font-black tracking-tight text-sm text-left">{t('footer.account')}</button>
                    </div>
                )}
            </div>
        </div>
        
        <div>
            <div className="relative mb-6">
                <input
                    type="text"
                    value={hubSearchQuery}
                    onChange={(e) => setHubSearchQuery(e.target.value)}
                    placeholder={t('community.searchHub')}
                    className="w-full bg-slate-800 border-2 border-slate-700 text-sm text-slate-200 pl-12 pr-6 py-3.5 rounded-2xl focus:border-yellow-600 outline-none transition-all font-black shadow-inner"
                />
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {!hubSearchQuery && (
                <button
                onClick={() => setSelectedHub('all')}
                className={`flex-shrink-0 px-5 md:px-6 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-black transition-all border-2 ${
                    selectedHub === 'all'
                    ? 'bg-yellow-600 text-slate-950 border-yellow-500 shadow-xl'
                    : 'bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-500'
                }`}
                >
                {t('community.allProvinces')}
                </button>
            )}
            {sortedHubs.map(p => (
                <button
                key={p.name}
                onClick={() => {
                    setSelectedHub(p.name);
                    setHubSearchQuery(''); 
                }}
                className={`flex-shrink-0 px-5 md:px-6 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-black transition-all border-2 ${
                    selectedHub === p.name
                    ? 'bg-yellow-600 text-slate-950 border-yellow-500 shadow-xl'
                    : 'bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-500'
                } ${user?.province === p.name ? 'ring-2 ring-yellow-500 ring-offset-4 ring-offset-slate-900' : ''}`}
                >
                {t(`provinces.${p.name}`)}
                </button>
            ))}
            </div>
        </div>
      </div>

      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide bg-slate-950/20"
      >
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16 mb-6 md:mb-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-slate-500 font-black text-xs md:text-sm max-w-xs leading-relaxed">
              {selectedHub === 'all' 
                ? t('community.noMessages') 
                : t('community.noMessagesProvince', { province: t(`provinces.${selectedHub}`) })}
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <CommunityMessageBubble 
              key={msg.id} 
              message={msg} 
              isOwn={msg.senderName === currentUserName} 
              t={t}
              showProvince={selectedHub === 'all'}
            />
          ))
        )}
      </div>

      <div className={`p-5 md:p-6 bg-slate-900 border-t-2 border-slate-800 ${isFullScreen ? 'pb-12 md:pb-14' : ''}`}>
        {!user ? (
          <div className="text-center p-4 bg-yellow-900/10 border-2 border-yellow-900/20 rounded-2xl">
            <p className="text-xs md:text-sm text-yellow-500 font-black tracking-widest">{t('community.loginRequired')}</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex gap-3 md:gap-4 max-w-4xl mx-auto">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={selectedHub === 'all' 
                ? t('community.placeholder') 
                : t('community.placeholderProvince', { province: t(`provinces.${selectedHub}`) })}
              className="flex-1 bg-slate-800 border-2 border-slate-700 rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-sm md:text-base font-black tracking-tight focus:border-yellow-600 outline-none text-white placeholder-slate-600 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-yellow-600 text-slate-950 w-12 h-12 md:w-16 md:h-16 rounded-2xl disabled:bg-slate-800 disabled:text-slate-600 transition-all shadow-2xl active:scale-90 flex items-center justify-center flex-shrink-0 border-2 border-yellow-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CommunityView;
