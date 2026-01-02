import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useCommunity } from '../contexts/CommunityContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import LoadingSpinner from './LoadingSpinner';
import { PROVINCES } from '../constants';

const CommunityMessageBubble: React.FC<{ 
  message: any; 
  isOwn: boolean; 
  t: (k: string, r?: any) => string;
  showProvince?: boolean;
}> = ({ message, isOwn, t, showProvince = false }) => {
  return (
    <div className={`flex flex-col mb-4 ${isOwn ? 'items-end' : 'items-start'}`}>
      <div className="flex items-center gap-2 mb-1 px-2">
        <span className={`text-xs font-bold ${isOwn ? 'text-pink-400' : 'text-purple-300'}`}>
          {message.senderName}
          {message.senderProvince && showProvince && (
            <span className="ml-1 opacity-60 font-normal text-[10px]">
               • {t('community.from')} {t(`provinces.${message.senderProvince}`)}
            </span>
          )}
        </span>
        <span className="text-[10px] text-slate-500">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <div 
        className={`max-w-[85%] px-4 py-2.5 rounded-2xl shadow-lg border ${
          isOwn 
            ? 'bg-gradient-to-br from-pink-600 to-purple-700 text-white rounded-tr-none border-white/10' 
            : 'bg-slate-800 text-slate-200 rounded-tl-none border-slate-700'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

const CommunityView: React.FC = () => {
  const { messages, sendMessage, isLoading } = useCommunity();
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [selectedHub, setSelectedHub] = useState<string>('all'); // 'all' or province name
  const [hubSearchQuery, setHubSearchQuery] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <LoadingSpinner size={12} />
      </div>
    );
  }

  const currentUserName = user?.username;

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] max-w-2xl mx-auto bg-slate-950/40 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 animate-fade-in">
      <div className="p-6 border-b border-slate-800 bg-slate-900/50">
        <h2 className="text-2xl font-black text-white">{t('community.title')}</h2>
        <p className="text-xs text-slate-400 font-medium mb-6">{t('community.subtitle')}</p>
        
        {/* Hub Search Bar */}
        <div className="relative mb-4">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
           </div>
           <input
             type="text"
             value={hubSearchQuery}
             onChange={(e) => setHubSearchQuery(e.target.value)}
             placeholder={t('community.searchHub')}
             className="w-full bg-slate-800/50 border border-slate-700 text-xs text-slate-200 pl-10 pr-10 py-2.5 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
           />
           {hubSearchQuery && (
             <button 
               onClick={() => setHubSearchQuery('')}
               className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
             >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
           )}
        </div>

        {/* Hub Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {!hubSearchQuery && (
            <button
              onClick={() => setSelectedHub('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                selectedHub === 'all'
                  ? 'bg-pink-600 text-white border-pink-500 shadow-lg shadow-pink-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
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
                setHubSearchQuery(''); // Optional: clear search on selection
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                selectedHub === p.name
                  ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
              } ${user?.province === p.name ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-slate-900' : ''}`}
            >
              {t(`provinces.${p.name}`)}
            </button>
          ))}
          {sortedHubs.length === 0 && hubSearchQuery && (
            <span className="text-[10px] text-slate-500 py-2 italic px-2">No hubs match "{hubSearchQuery}"</span>
          )}
        </div>
      </div>

      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth scrollbar-hide bg-slate-950/20"
      >
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center mb-6 text-slate-700 border border-slate-800">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
               </svg>
            </div>
            <p className="text-slate-400 font-medium max-w-xs">
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

      <div className="p-4 bg-slate-900/80 border-t border-slate-800">
        {!user ? (
          <div className="text-center p-2">
            <p className="text-sm text-yellow-500 font-bold">{t('community.loginRequired')}</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={selectedHub === 'all' 
                ? t('community.placeholder') 
                : t('community.placeholderProvince', { province: t(`provinces.${selectedHub}`) })}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-3 rounded-2xl disabled:opacity-30 disabled:grayscale transition-all hover:shadow-lg hover:shadow-pink-500/20 active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        )}
      </div>
      
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

export default CommunityView;