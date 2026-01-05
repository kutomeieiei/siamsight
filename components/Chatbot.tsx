
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Chat, GenerateContentResponse } from '@google/genai';
import { ChatMessage, GroundingChunk, FeaturedAttraction } from '../types';
import { startChatSession } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../contexts/LanguageContext';
import { FEATURED_ATTRACTIONS } from '../constants';
import { uiAssets } from '../image_assets';
import MarkdownRenderer from './MarkdownRenderer';
import { useAuth } from '../contexts/AuthContext';

const LIKED_LANDMARKS_KEY = 'siam-sight-liked-landmarks-v5';

const AiAvatar = () => (
  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 border-2 border-yellow-500 shadow-lg overflow-hidden">
    <img 
      src={uiAssets.nongSiamAvatar} 
      alt="Nong Siam Avatar" 
      className="w-full h-full object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/bottts/svg?seed=NongSiam';
      }}
    />
  </div>
);

const LandmarkCard: React.FC<{
    place: FeaturedAttraction;
    isLiked: boolean;
    onToggleLike: (e: React.MouseEvent) => void;
    onPlanVisit: (place: FeaturedAttraction) => void;
    t: (k: string) => string;
}> = ({ place, isLiked, onToggleLike, onPlanVisit, t }) => (
    <div className="group relative flex flex-col h-full bg-slate-900 rounded-3xl overflow-hidden transition-all duration-300 border-2 border-slate-800 hover:border-yellow-600 shadow-xl">
      <div className="relative h-52 md:h-64 bg-slate-800 overflow-hidden">
        <img 
          src={place.imageUrl} 
          alt={place.name} 
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-slate-950/60"></div>
        
        <div className="absolute top-4 right-4 z-20">
            <button 
                onClick={onToggleLike}
                className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl backdrop-blur-md border-2 transition-all duration-300 active:scale-75 shadow-2xl ${
                    isLiked 
                      ? 'bg-yellow-600 border-yellow-400 text-slate-950 font-black' 
                      : 'bg-black/40 border-white/10 text-white hover:text-yellow-400'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 md:h-5 md:w-5 ${isLiked ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-[9px] md:text-[10px] font-black tracking-tight">{isLiked ? 'Saved' : 'Save'}</span>
            </button>
        </div>

        <div className="absolute bottom-5 left-5 pr-6">
            <h3 className="text-white font-black text-xl md:text-2xl leading-none mb-3 truncate tracking-tight">{t(`featuredAttractions.names.${place.key}`)}</h3>
            <p className="text-[9px] md:text-[10px] text-yellow-500 font-black tracking-tight">{t(`provinces.${place.province}`)}</p>
        </div>
      </div>

      <div className="p-6 md:p-7 flex-grow flex flex-col">
        <p className="text-slate-400 text-[10px] md:text-xs leading-relaxed mb-6 h-10 md:h-10 line-clamp-2 italic font-medium">
          "{t(`featuredAttractions.descriptions.${place.key}`)}"
        </p>
        
        <div className="mt-auto">
            <button 
              onClick={() => onPlanVisit(place)}
              className="w-full py-4 md:py-5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black tracking-tight rounded-2xl transition-all shadow-2xl active:scale-95 text-[10px] md:text-xs"
            >
              {t('chatbot.askHowToVisit')}
            </button>
        </div>
      </div>
    </div>
);

const Chatbot: React.FC = () => {
  const { t, locale } = useTranslation();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [landmarkSearch, setLandmarkSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(LIKED_LANDMARKS_KEY);
    if (stored) {
        try { setLikedIds(JSON.parse(stored)); } catch (e) { console.error(e); }
    }
  }, []);

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

  const toggleLike = useCallback((e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setLikedIds(prev => {
        const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
        localStorage.setItem(LIKED_LANDMARKS_KEY, JSON.stringify(next));
        return next;
    });
  }, []);

  useEffect(() => {
    setMessages([{ sender: 'ai', text: t('chatbot.initialMessage') }]);
    setChat(null);
  }, [locale, t]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const filteredLandmarks = useMemo(() => {
    if (!landmarkSearch.trim()) return FEATURED_ATTRACTIONS;
    const q = landmarkSearch.toLowerCase();
    return FEATURED_ATTRACTIONS.filter(p => 
        t(`provinces.${p.province}`).toLowerCase().includes(q) || 
        t(`featuredAttractions.names.${p.key}`).toLowerCase().includes(q)
    );
  }, [landmarkSearch, t]);

  const handleSend = useCallback(async (textOverride?: string) => {
    const textToSend = textOverride || userInput;
    if (!textToSend.trim() || isLoading) return;

    let currentChat = chat || startChatSession(locale);
    if (!chat) setChat(currentChat);

    const userMsg: ChatMessage = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg, { sender: 'ai', text: '' }]);
    if (!textOverride) setUserInput('');
    setIsLoading(true);

    try {
      const stream = await currentChat.sendMessageStream({ message: textToSend });
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        const chunkText = c.text;
        setMessages(prev => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last.sender === 'ai') last.text += chunkText;
          return next;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last.sender === 'ai') last.text = "Error reaching the kingdom. Please check your connection.";
          return next;
      });
    } finally {
      setIsLoading(false);
    }
  }, [userInput, chat, isLoading, locale]);

  const handlePlanVisit = (place: FeaturedAttraction) => {
    const prompt = t('chatbot.howToVisitPrompt')
        .replace('{{place}}', t(`featuredAttractions.names.${place.key}`))
        .replace('{{province}}', t(`provinces.${place.province}`));
    handleSend(prompt);
    document.getElementById('nong-siam-concierge')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`${isFullScreen ? '' : 'animate-fade-in max-w-[1400px] mx-auto pb-48 px-4'}`}>
      {!isFullScreen && (
        <>
          <div className="text-center mb-10 md:mb-16 mt-6 md:mt-0">
            <h2 className="text-2xl md:text-6xl font-black text-yellow-500 mb-3 tracking-tighter leading-[0.9]">
              {t('chatbot.title')}
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-[11px] md:text-sm font-bold tracking-tight opacity-80">"{t('chatbot.subtitle')}"</p>
          </div>

          <section className="mb-16 md:mb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-6 md:gap-8 border-b-2 border-slate-900 pb-8 md:pb-10">
                <div>
                    <h3 className="text-xl md:text-3xl font-black text-white mb-2 tracking-tight">{t('chatbot.famousPlacesTitle')}</h3>
                    <p className="text-[9px] md:text-[10px] text-yellow-600 font-black tracking-tight">{t('chatbot.famousPlacesSubtitle')}</p>
                </div>
                <div className="relative w-full md:w-96">
                    <input
                        type="text" value={landmarkSearch}
                        onChange={(e) => setLandmarkSearch(e.target.value)}
                        placeholder={t('chatbot.searchLandmarkPlaceholder')}
                        className="w-full bg-slate-900 border-2 border-slate-800 text-[13px] md:text-sm text-slate-100 py-4 md:py-5 pl-12 md:pl-14 pr-6 rounded-2xl focus:border-yellow-600 outline-none transition-all shadow-xl font-black tracking-tight"
                    />
                    <svg className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredLandmarks.map((place) => (
                    <LandmarkCard 
                        key={place.key}
                        place={place}
                        isLiked={likedIds.includes(place.key)}
                        onToggleLike={(e) => toggleLike(e, place.key)}
                        onPlanVisit={handlePlanVisit}
                        t={t}
                    />
                ))}
            </div>
          </section>
        </>
      )}

      <section 
        id="nong-siam-concierge" 
        className={`${isFullScreen ? 'fixed inset-0 z-[100] w-screen h-screen bg-slate-950 p-0 overflow-hidden' : 'max-w-4xl mx-auto transition-all duration-500 relative'}`}
      >
        <div className={`bg-slate-900 border-2 border-slate-800 shadow-2xl flex flex-col ${isFullScreen ? 'h-full w-full rounded-none' : 'h-[450px] md:h-[500px] rounded-3xl overflow-hidden'}`}>
            <div className="p-6 md:p-8 border-b-2 border-slate-800 bg-slate-800/40 flex items-center justify-between">
               <div className="flex items-center gap-4 md:gap-6">
                  <div className="relative">
                    <AiAvatar />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-4 md:h-4 bg-yellow-500 border-2 md:border-4 border-slate-900 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-black text-xl md:text-2xl text-white tracking-tight">Nong Siam</h3>
                    {!isFullScreen && <p className="text-[8px] md:text-[10px] font-black tracking-tight text-yellow-500">{t('chatbot.online')}</p>}
                  </div>
               </div>
               
               <button 
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-2.5 md:p-3 bg-slate-800 hover:bg-slate-700 text-yellow-500 hover:text-white rounded-xl transition-all border-2 border-slate-700 active:scale-90"
               >
                {isFullScreen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
               </button>
            </div>

            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 md:space-y-10 scrollbar-hide bg-slate-950/20">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 md:p-6 rounded-2xl shadow-2xl border-2 ${
                    msg.sender === 'user' 
                      ? 'bg-yellow-600 border-yellow-500 text-slate-950 rounded-tr-none font-black tracking-tight' 
                      : 'bg-slate-800 border-slate-700 text-slate-200 rounded-tl-none font-normal tracking-tight'
                  }`}>
                    {msg.text === '' ? (
                         <div className="flex gap-2 py-2">
                             <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-yellow-500 rounded-full animate-bounce"></div>
                             <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                             <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                         </div>
                    ) : (
                      msg.sender === 'user' ? (
                        <p className="text-sm md:text-base font-black tracking-tight leading-relaxed">{msg.text}</p>
                      ) : (
                        <MarkdownRenderer text={msg.text} />
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={`p-6 md:p-8 bg-slate-900 border-t-2 border-slate-800 ${isFullScreen ? 'pb-10 md:pb-12' : ''}`}>
              <div className="relative max-w-4xl mx-auto flex gap-3 md:gap-4">
                  <input
                    type="text" value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t('chatbot.placeholder')}
                    className="flex-1 py-4 md:py-5 px-6 md:px-8 bg-slate-800 border-2 border-slate-700 rounded-2xl outline-none focus:border-yellow-600 text-white transition-all shadow-inner font-black tracking-tight text-[13px] md:text-sm"
                  />
                  <button 
                    onClick={() => handleSend()} disabled={!userInput.trim() || isLoading}
                    className="w-16 md:w-20 bg-yellow-600 text-slate-950 rounded-2xl flex items-center justify-center transition-all disabled:bg-slate-800 disabled:text-slate-600 active:scale-95 shadow-2xl border-2 border-yellow-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
              </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Chatbot;
