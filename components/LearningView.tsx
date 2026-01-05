
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Chat, GenerateContentResponse } from '@google/genai';
import { ChatMessage, GroundingChunk } from '../types';
import { startLearningSession } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../contexts/LanguageContext';
import { uiAssets, learningImages } from '../image_assets';
import MarkdownRenderer from './MarkdownRenderer';

const KruAvatar = () => (
  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 border-2 border-yellow-500 overflow-hidden shadow-2xl">
    <img 
      src={uiAssets.kruSiamAvatar} 
      alt="Kru Siam Avatar" 
      className="w-full h-full object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/bottts/svg?seed=KruSiam';
      }}
    />
  </div>
);

const CategoryIcon = ({ type, size = "text-xl" }: { type: string, size?: string }) => {
  const map: Record<string, string> = {
    'Food': '🍜',
    'อาหาร': '🍜',
    'Souvenir': '🎁',
    'ของที่ระลึก': '🎁',
    'Textile': '🧶',
    'สิ่งทอ': '🧶',
    'Home Decor': '🏠',
    'ของแต่งบ้าน': '🏠',
    'Accessories': '💍',
    'เครื่องประดับ': '💍',
    'all': '✨'
  };
  return <span className={size}>{map[type] || '🏷️'}</span>;
};

const HistoryModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  history: string; 
  imageUrl: string;
  t: (k: string) => string;
}> = ({ isOpen, onClose, title, history, imageUrl, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-slate-950/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-slate-800 w-full max-w-2xl rounded-t-[3rem] md:rounded-[3rem] overflow-hidden shadow-2xl animate-fade-in-up relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 md:top-8 md:right-8 z-10 p-3 md:p-4 bg-slate-950 hover:bg-slate-800 text-yellow-500 rounded-2xl transition-all border-2 border-slate-700 shadow-2xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="h-56 md:h-80 relative">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-950/50"></div>
          <div className="absolute bottom-8 md:bottom-10 left-8 md:left-10 right-8 md:right-10">
            <h3 className="text-2xl md:text-5xl font-black text-white leading-relaxed drop-shadow-2xl tracking-tighter">{title}</h3>
            <div className="flex items-center gap-3 mt-3 md:mt-4">
                <div className="h-1 w-12 md:h-1.5 md:w-16 bg-yellow-600 rounded-full"></div>
                <p className="text-yellow-500 font-black text-[8px] md:text-10px tracking-tight">{t('learning.historyTitle')}</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 max-h-[50vh] overflow-y-auto scrollbar-hide">
          <div className="mb-8 md:mb-10">
             <p className="text-slate-200 text-lg md:text-xl leading-relaxed font-medium">
               {history}
             </p>
          </div>
          
          <div className="pt-4">
             <div className="flex items-start gap-5 md:gap-6 p-6 md:p-8 bg-slate-950/50 rounded-[2rem] md:rounded-[2.5rem] border-2 border-slate-800">
                <div className="p-3 md:p-4 bg-yellow-600 text-slate-950 rounded-2xl shadow-2xl">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                   </svg>
                </div>
                <div>
                   <h4 className="text-[10px] md:text-xs font-black text-white tracking-tight mb-1.5 md:mb-2">{t('learning.expertInsightTitle')}</h4>
                   <p className="text-[10px] md:text-sm text-slate-500 font-black leading-relaxed tracking-tight">{t('learning.expertInsightDesc')}</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CraftCard: React.FC<{ 
  title: string; 
  type: string;
  province: string;
  imageUrl: string;
  onAsk: (title: string) => void;
  onMoreInfo: () => void;
  askText: string;
}> = ({ title, type, province, imageUrl, onAsk, onMoreInfo, askText }) => (
  <button 
    onClick={onMoreInfo}
    className="group relative aspect-[4/3] w-full bg-slate-950 rounded-3xl overflow-hidden transition-all duration-300 border-2 border-slate-800 hover:border-yellow-500 shadow-xl text-left"
  >
    <img 
        src={imageUrl} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
    />
    <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/40 transition-colors"></div>
    
    <div className="absolute top-5 left-5 flex flex-col gap-2.5 items-start z-20">
        <div className="flex items-center gap-2 bg-yellow-600 text-slate-950 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[8px] md:text-[9px] font-black tracking-tight shadow-xl border border-yellow-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 md:h-4 md:w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {province}
        </div>
        <div className="bg-slate-950/80 backdrop-blur-md text-yellow-500 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[8px] md:text-[9px] font-black tracking-tight border border-slate-800 shadow-lg">
            {type}
        </div>
    </div>

    <div className="absolute top-5 right-5 z-20">
        <button 
            onClick={(e) => { e.stopPropagation(); onAsk(title); }}
            className="p-3 md:p-4 bg-yellow-600 hover:bg-yellow-500 text-slate-950 rounded-2xl transition-all shadow-xl active:scale-90 border border-yellow-500"
            title={askText}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        </button>
    </div>

    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col justify-end">
        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-tight group-hover:text-yellow-400 transition-colors">
          {title}
        </h3>
        <div className="mt-4 md:mt-6 h-1 w-10 md:w-12 bg-yellow-600 rounded-full group-hover:w-16 md:group-hover:w-20 transition-all"></div>
    </div>
  </button>
);

const LearningView: React.FC = () => {
  const { t, locale } = useTranslation();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHistory, setActiveHistory] = useState<{key: string; title: string; history: string; imageUrl: string} | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const craftKeys = ['silk', 'ceramics', 'teak', 'silverware', 'wickerwork', 'durian_chips'];

  const categories = useMemo(() => {
    const types = new Set<string>();
    craftKeys.forEach(key => {
      const type = t(`learning.crafts.${key}.type`);
      if (type && type !== `learning.crafts.${key}.type`) {
        types.add(type);
      }
    });
    return Array.from(types).sort();
  }, [t, craftKeys]);

  useEffect(() => {
    setMessages([{ sender: 'ai', text: t('learning.initialMessage') }]);
    setChat(null);
  }, [locale, t]);

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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const filteredCrafts = useMemo(() => {
    let list = craftKeys;
    if (selectedType !== 'all') {
      list = list.filter(key => t(`learning.crafts.${key}.type`) === selectedType);
    }
    if (!searchQuery.trim()) return list;
    const lowerQuery = searchQuery.toLowerCase();
    return list.filter(key => {
      const province = t(`learning.crafts.${key}.province`).toLowerCase();
      const title = t(`learning.crafts.${key}.title`).toLowerCase();
      const type = t(`learning.crafts.${key}.type`).toLowerCase();
      return province.includes(lowerQuery) || title.includes(lowerQuery) || type.includes(lowerQuery);
    });
  }, [searchQuery, selectedType, t, craftKeys]);

  const handleSend = useCallback(async (textOverride?: string) => {
    const textToSend = textOverride || userInput;
    if (!textToSend.trim() || isLoading) return;

    let currentChat = chat || startLearningSession(locale);
    if (!chat) setChat(currentChat);

    const userMessage: ChatMessage = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    if (!textOverride) setUserInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, { sender: 'ai', text: '', sources: [] }]);

    try {
      const stream = await currentChat.sendMessageStream({ message: textToSend });
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        const chunkText = c.text;
        const groundingMetadata = c.candidates?.[0]?.groundingMetadata;
        const chunks: GroundingChunk[] = groundingMetadata?.groundingChunks || [];

        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.sender === 'ai') {
            lastMessage.text += chunkText;
            if (chunks.length > 0) {
              const currentSources = lastMessage.sources || [];
              const newSources = [...currentSources];
              chunks.forEach(chunk => {
                if (chunk.web && chunk.web.uri && !newSources.some(s => s.web?.uri === chunk.web?.uri)) {
                  newSources.push(chunk);
                }
              });
              lastMessage.sources = newSources;
            }
          }
          return newMessages;
        });
      }
    } catch (error: any) {
      console.error("Learning Chat error:", error);
      let errorText = "Error connecting to Kru Siam.";
      setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.sender === 'ai') {
              lastMessage.text = errorText;
          }
          return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [userInput, chat, isLoading, t, locale]);

  const handleQuickAsk = (productName: string) => {
    const question = locale === 'th' 
        ? `ช่วยอธิบายเกี่ยวกับ ${productName} ให้ฟังหน่อยครับ`
        : `Can you tell more about ${productName}?`;
    handleSend(question);
    const chatSection = document.getElementById('kru-siam-chat');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShowHistory = (key: string) => {
    const history = t(`learning.crafts.${key}.history`);
    setActiveHistory({
        key,
        title: t(`learning.crafts.${key}.title`),
        history: history === `learning.crafts.${key}.history` ? 'History details coming soon.' : history,
        imageUrl: (learningImages as any)[key]
    });
  };

  return (
    <div className={`${isFullScreen ? '' : 'animate-fade-in space-y-16 md:space-y-24 max-w-[1400px] mx-auto pb-32'}`}>
      {!isFullScreen && (
        <>
          <div className="text-center relative px-4 mt-6 md:mt-0">
            <h2 className="text-3xl md:text-8xl font-black text-yellow-500 mb-4 md:mb-6 tracking-tighter">{t('learning.title')}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-lg font-black tracking-tight">"{t('learning.subtitle')}"</p>
          </div>

          <div className="max-w-3xl mx-auto px-6">
            <div className="relative group">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('learning.searchPlaceholder')}
                    className="w-full pl-12 md:pl-14 pr-10 md:pr-12 py-4 md:py-6 bg-slate-900 border-2 border-slate-800 rounded-[2rem] md:rounded-[2.5rem] focus:border-yellow-600 focus:outline-none text-slate-100 placeholder-slate-600 transition-all shadow-xl font-black tracking-tight text-[13px] md:text-base"
                />
                <div className="absolute inset-y-0 left-5 md:left-6 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                
                <button 
                    onClick={() => setIsMenuOpen(true)}
                    className={`absolute inset-y-1.5 md:inset-y-2 right-1.5 md:right-2 px-4 md:px-6 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 transition-all ${selectedType !== 'all' ? 'bg-yellow-600 text-slate-950 font-black border-2 border-yellow-500' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    {selectedType !== 'all' && <span className="text-[9px] md:text-[10px] hidden sm:inline tracking-tight">{selectedType}</span>}
                </button>
            </div>
          </div>

          <section className="px-4">
            <div className="flex items-center gap-4 md:gap-6 mb-10 md:mb-12">
                <div className="h-1 md:h-1.5 w-12 md:w-16 bg-yellow-600 rounded-full"></div>
                <div>
                    <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight">{t('learning.galleryTitle')}</h3>
                    <p className="text-[9px] md:text-[10px] text-slate-600 font-black tracking-tight mt-1">{t('learning.portfolios', { count: filteredCrafts.length })}</p>
                </div>
            </div>
            
            {filteredCrafts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-fade-in">
                {filteredCrafts.map(key => (
                    <CraftCard 
                        key={key}
                        title={t(`learning.crafts.${key}.title`)} 
                        type={t(`learning.crafts.${key}.type`)}
                        province={t(`learning.crafts.${key}.province`)}
                        imageUrl={(learningImages as any)[key]}
                        onAsk={handleQuickAsk}
                        onMoreInfo={() => handleShowHistory(key)}
                        askText={t('learning.askKru')}
                    />
                ))}
                </div>
            ) : (
                <div className="py-24 md:py-32 text-center bg-slate-950/40 rounded-3xl border-2 border-slate-900">
                    <p className="text-slate-600 font-black text-xl md:text-2xl tracking-tight">{t('learning.noResults')}</p>
                    <button 
                      onClick={() => { setSelectedType('all'); setSearchQuery(''); }}
                      className="mt-8 md:mt-10 px-8 md:px-10 py-4 md:py-5 bg-yellow-600 text-slate-950 rounded-2xl text-[10px] md:text-xs font-black transition-all shadow-xl border-2 border-yellow-500 tracking-tight"
                    >
                        {locale === 'th' ? 'แสดงทั้งหมด' : 'Show all wisdom'}
                    </button>
                </div>
            )}
          </section>
        </>
      )}

      {isMenuOpen && !isFullScreen && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center p-0 md:p-6 bg-slate-950/95 backdrop-blur-xl animate-fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-slate-900 border-2 border-slate-800 rounded-t-[3rem] md:rounded-[3rem] p-8 md:p-10 pb-12 md:pb-16 relative shadow-2xl animate-fade-in-up"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 md:top-8 md:right-8 p-2.5 md:p-3 bg-slate-950 rounded-xl text-yellow-500 hover:text-white transition-all border-2 border-slate-800 shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-8 md:mb-10">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter">{t('learning.categoryTitle')}</h3>
                <p className="text-slate-600 text-[8px] md:text-[10px] font-black tracking-tight mt-2">{t('learning.categorySubtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3 md:gap-4">
              <button 
                onClick={() => { setSelectedType('all'); setIsMenuOpen(false); }}
                className={`flex items-center gap-4 md:gap-5 p-4 md:p-5 rounded-2xl border-2 transition-all group ${selectedType === 'all' ? 'bg-yellow-600 border-yellow-500 shadow-xl text-slate-950' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xl md:text-2xl transition-transform ${selectedType === 'all' ? 'bg-yellow-700' : 'bg-slate-900'}`}>
                    <CategoryIcon type="all" />
                </div>
                <div className="text-left">
                    <span className={`block text-[11px] md:text-xs font-black tracking-tight ${selectedType === 'all' ? 'text-slate-950' : 'text-slate-300'}`}>{t('learning.showEverything')}</span>
                </div>
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => { setSelectedType(cat); setIsMenuOpen(false); }}
                  className={`flex items-center gap-4 md:gap-5 p-4 md:p-5 rounded-2xl border-2 transition-all group ${selectedType === cat ? 'bg-yellow-600 border-yellow-500 shadow-xl text-slate-950' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xl md:text-2xl transition-transform ${selectedType === cat ? 'bg-yellow-700' : 'bg-slate-900'}`}>
                    <CategoryIcon type={cat} />
                  </div>
                  <div className="text-left">
                    <span className={`block text-[11px] md:text-xs font-black tracking-tight ${selectedType === cat ? 'text-slate-950' : 'text-slate-300'}`}>{cat}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <HistoryModal 
        isOpen={!!activeHistory} 
        onClose={() => setActiveHistory(null)} 
        title={activeHistory?.title || ''} 
        history={activeHistory?.history || ''} 
        imageUrl={activeHistory?.imageUrl || ''}
        t={t}
      />

      <section 
        id="kru-siam-chat" 
        className={`${isFullScreen ? 'fixed inset-0 z-[100] w-screen h-screen bg-slate-950 p-0 overflow-hidden flex flex-col' : 'bg-slate-900 border-2 border-slate-800 shadow-2xl flex flex-col rounded-[2rem] md:rounded-[2.5rem] overflow-hidden max-w-4xl mx-auto mt-12 md:mt-16'}`}
      >
        <div className="p-6 md:p-8 border-b-2 border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative">
                <KruAvatar />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-3.5 md:h-3.5 bg-yellow-500 border-2 md:border-4 border-slate-900 rounded-full"></div>
            </div>
            <div>
              <h3 className="text-xl md:text-3xl font-black text-white tracking-tight">Kru Siam</h3>
              {!isFullScreen && (
                <div className="flex items-center gap-2 mt-1 md:mt-1.5">
                    <div className="h-0.5 md:h-1 w-8 md:w-10 bg-yellow-600 rounded-full"></div>
                    <p className="text-[8px] md:text-[9px] text-yellow-600 tracking-tight font-black">{t('learning.specialist')}</p>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2.5 md:p-3 bg-slate-800 hover:bg-slate-700 text-yellow-500 hover:text-white rounded-xl transition-all border-2 border-slate-700 shadow-xl active:scale-90"
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

        <div 
          ref={chatContainerRef} 
          className={`${isFullScreen ? 'flex-1' : 'h-[350px] md:h-[400px]'} p-6 md:p-8 space-y-8 md:space-y-10 overflow-y-auto bg-slate-950/40 scrollbar-hide`}
        >
          {messages.map((msg, index) => (
            <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex items-start ${msg.sender === 'user' ? 'justify-end w-full' : 'justify-start w-full'}`}>
                <div
                  className={`max-w-[85%] p-5 md:p-6 rounded-2xl shadow-xl border-2 ${
                    msg.sender === 'user'
                      ? 'bg-yellow-600 border-yellow-500 text-slate-950 font-black tracking-tight'
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border-slate-700 font-black tracking-tight'
                  }`}
                >
                  {msg.text === '' && msg.sender === 'ai' ? (
                    <div className="flex gap-2 p-1">
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-yellow-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  ) : (
                    msg.sender === 'ai' ? (
                      <MarkdownRenderer text={msg.text} className="text-sm md:text-base leading-relaxed" />
                    ) : (
                      <p className="text-sm md:text-base leading-relaxed font-black">{msg.text}</p>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`p-6 md:p-8 border-t-2 border-slate-800 bg-slate-900 ${isFullScreen ? 'pb-12 md:pb-14' : ''}`}>
          <div className="flex gap-3 md:gap-4 items-center max-w-4xl mx-auto">
            <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('learning.chatPlaceholder')}
                className="flex-1 p-4 md:p-5 bg-slate-800 border-2 border-slate-700 rounded-2xl focus:border-yellow-600 outline-none text-white placeholder-slate-600 transition-all shadow-inner font-black tracking-tight text-[13px] md:text-sm"
                disabled={isLoading}
            />
            <button 
                onClick={() => handleSend()} 
                disabled={isLoading || !userInput.trim()} 
                className="w-14 h-14 md:w-16 md:h-16 bg-yellow-600 hover:bg-yellow-500 text-slate-950 rounded-2xl transition-all disabled:bg-slate-800 disabled:text-slate-600 shadow-xl active:scale-90 flex items-center justify-center border-2 border-yellow-500 shadow-yellow-500/20"
            >
                {isLoading ? <LoadingSpinner size={6} /> : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearningView;
