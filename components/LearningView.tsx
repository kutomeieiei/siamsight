
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Chat, GenerateContentResponse } from '@google/genai';
import { ChatMessage, GroundingChunk } from '../types';
import { startLearningSession } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../contexts/LanguageContext';
import { learningImages } from '../image_assets';

const KruAvatar = () => (
  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-yellow-500 border border-yellow-500/30">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2z" />
      <path d="M3.8 10.7l7.7 3.5 7.7-3.5v5.5c0 1.5-1.5 3.3-4.2 4.3C13.5 21 12 21 12 21s-1.5 0-3-.5c-2.7-1-4.2-2.8-4.2-4.3v-5.5z" />
    </svg>
  </div>
);

const CraftCard: React.FC<{ 
  title: string; 
  desc: string; 
  province: string;
  imageUrl: string;
  onAsk: (title: string) => void;
  askText: string;
}> = ({ title, desc, province, imageUrl, onAsk, askText }) => (
  <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden hover:border-yellow-500/40 transition-all duration-300 group flex flex-col h-full">
    <div className="h-52 w-full overflow-hidden relative">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
      
      {/* Province Tag */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-yellow-500 text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border border-yellow-400/20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        {province}
      </div>
    </div>
    
    <div className="p-6 flex flex-col flex-1">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">{desc}</p>
      
      <button 
        onClick={() => onAsk(title)}
        className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-600/10 hover:bg-yellow-600 text-yellow-500 hover:text-white rounded-2xl text-sm font-bold transition-all border border-yellow-500/20 active:scale-95 shadow-lg shadow-yellow-600/5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        {askText}
      </button>
    </div>
  </div>
);

const LearningView: React.FC = () => {
  const { t, locale } = useTranslation();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // List of craft keys available in translations
  const craftKeys = ['silk', 'ceramics', 'teak', 'silverware', 'wickerwork'];

  useEffect(() => {
    setMessages([{ sender: 'ai', text: t('learning.initialMessage') }]);
    setChat(startLearningSession(locale));
  }, [locale, t]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const filteredCrafts = useMemo(() => {
    if (!searchQuery.trim()) return craftKeys;
    const lowerQuery = searchQuery.toLowerCase();
    return craftKeys.filter(key => {
      const province = t(`learning.crafts.${key}.province`).toLowerCase();
      const title = t(`learning.crafts.${key}.title`).toLowerCase();
      return province.includes(lowerQuery) || title.includes(lowerQuery);
    });
  }, [searchQuery, t, craftKeys]);

  const handleSend = useCallback(async (textOverride?: string) => {
    const textToSend = textOverride || userInput;
    if (!textToSend.trim() || !chat || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    if (!textOverride) setUserInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, { sender: 'ai', text: '', sources: [] }]);

    try {
      const stream = await chat.sendMessageStream({ message: textToSend });
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
    } catch (error) {
      console.error("Learning Chat error:", error);
      setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.sender === 'ai') {
              lastMessage.text = "Error connecting to Kru Siam. Please try again.";
          }
          return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [userInput, chat, isLoading]);

  const handleQuickAsk = (productName: string) => {
    const question = locale === 'th' 
        ? `ช่วยอธิบายเกี่ยวกับ ${productName} ให้ฟังหน่อยครับ`
        : `Can you tell me more about ${productName}?`;
    handleSend(question);
    
    // Scroll to chat section
    const chatSection = document.getElementById('kru-siam-chat');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in space-y-12 max-w-6xl mx-auto pb-20">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-2">{t('learning.title')}</h2>
        <div className="h-1.5 w-24 bg-yellow-500 mx-auto rounded-full mb-6 shadow-lg shadow-yellow-500/20"></div>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">{t('learning.subtitle')}</p>
      </div>

      {/* Craft Search Bar */}
      <div className="max-w-2xl mx-auto relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-slate-500 group-focus-within:text-yellow-500 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('learning.searchPlaceholder')}
          className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border-2 border-slate-700 rounded-2xl focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 focus:outline-none text-slate-100 placeholder-slate-500 transition-all shadow-xl"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Craft Gallery Section */}
      <section>
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          {t('learning.galleryTitle')}
        </h3>
        
        {filteredCrafts.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-800 animate-fade-in">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <p className="text-slate-400 font-medium">{t('learning.noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {filteredCrafts.map(key => (
              <CraftCard 
                key={key}
                title={t(`learning.crafts.${key}.title`)} 
                desc={t(`learning.crafts.${key}.desc`)}
                province={t(`learning.crafts.${key}.province`)}
                imageUrl={(learningImages as any)[key]}
                onAsk={handleQuickAsk}
                askText={t('learning.askKru')}
              />
            ))}
          </div>
        )}
      </section>

      {/* Kru Siam Chat Section */}
      <section id="kru-siam-chat" className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 scroll-mt-24 transition-all hover:border-yellow-500/10">
        <div className="p-6 border-b border-slate-800 bg-slate-800/20">
          <div className="flex items-center gap-4">
            <KruAvatar />
            <div>
              <h3 className="text-xl font-bold text-white">{t('learning.chatTitle')}</h3>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-black">{t('learning.chatSubtitle')}</p>
            </div>
          </div>
        </div>

        <div 
          ref={chatContainerRef} 
          className="h-[450px] p-6 space-y-6 overflow-y-auto bg-slate-950/20 scrollbar-hide"
        >
          {messages.map((msg, index) => (
            <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.sender === 'ai' && <KruAvatar />}
                <div
                  className={`max-w-[80%] p-4 rounded-3xl ${
                    msg.sender === 'user'
                      ? 'bg-yellow-600 text-white rounded-tr-none shadow-lg shadow-yellow-600/10'
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                  }`}
                >
                  {msg.text === '' ? (
                    <div className="flex gap-1.5 p-1">
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
              </div>
              {msg.sender === 'ai' && msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 ml-14 space-y-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('itineraryDisplay.sources')}:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((source, idx) => (
                      source.web && source.web.uri && (
                        <a 
                          key={idx}
                          href={source.web.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-yellow-400 hover:underline bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700 truncate max-w-[150px]"
                          title={source.web.title || source.web.uri}
                        >
                          {source.web.title || source.web.uri}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('learning.chatPlaceholder')}
              className="flex-1 p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 focus:outline-none text-slate-100 placeholder-slate-600 transition-all"
              disabled={isLoading}
            />
            <button 
              onClick={() => handleSend()} 
              disabled={isLoading || !userInput.trim()} 
              className="bg-yellow-600 hover:bg-yellow-500 text-white p-4 rounded-2xl transition-all disabled:opacity-50 shadow-xl shadow-yellow-600/20 active:scale-90"
            >
              {isLoading ? <LoadingSpinner size={5} /> : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </section>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default LearningView;
