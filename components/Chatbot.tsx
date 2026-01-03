
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat, GenerateContentResponse } from '@google/genai';
import { ChatMessage, GroundingChunk } from '../types';
import { startChatSession } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../contexts/LanguageContext';

const AiAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center flex-shrink-0 text-pink-300">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12,2.25a1,1,0,0,0-1,1V5.62a8.5,8.5,0,0,0-4.23,3.2,1,1,0,0,0-.23,1.1,10.19,10.19,0,0,0,2.2,4.3,1,1,0,0,0,.9,.55H10a1,1,0,0,1,0,2H8.88A3,3,0,0,0,6,19.82a1,1,0,0,0,1,1.13,4.36,4.36,0,0,0,4-2.1,4.36,4.36,0,0,0,4,2.1,1,1,0,0,0,1-1.13A3,3,0,0,0,15.12,18H14a1,1,0,0,1,0-2h1.12a1,1,0,0,0,.9,.55,10.19,10.19,0,0,0,2.2-4.3,1,1,0,0,0-.23-1.1A8.5,8.5,0,0,0,13,5.62V3.25A1,1,0,0,0,12,2.25Z" />
    </svg>
  </div>
);

const Chatbot: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { t, locale } = useTranslation();

  // Re-initialize chat when locale changes
  useEffect(() => {
    setMessages([{ sender: 'ai', text: t('chatbot.initialMessage') }]);
    setChat(startChatSession(locale));
  }, [locale, t]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!userInput.trim() || !chat || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    // Add a placeholder for the AI response
    setMessages(prev => [...prev, { sender: 'ai', text: '', sources: [] }]);

    try {
      const stream = await chat.sendMessageStream({ message: userInput });

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
      console.error("Chat error:", error);
      setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.sender === 'ai') {
              lastMessage.text = "Sorry, I'm having trouble connecting right now. Please try again later.";
          }
          return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [userInput, chat, isLoading]);
  
  return (
    <div className="flex flex-col h-[calc(100vh-240px)] max-w-2xl mx-auto bg-slate-900/50 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 animate-fade-in">
      <h2 className="text-xl font-bold text-center p-4 text-purple-300 border-b border-slate-800 flex-shrink-0">{t('chatbot.title')}</h2>
      <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && <AiAvatar />}
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-br-lg'
                    : 'bg-slate-800 text-slate-200 rounded-bl-lg'
                }`}
              >
                {msg.text === '' ? (
                  <div className="animate-pulse flex gap-1.5 p-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </div>
            {msg.sender === 'ai' && msg.sources && msg.sources.length > 0 && (
              <div className="mt-2 ml-10 space-y-1">
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
      <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chatbot.placeholder')}
            className="flex-1 p-3 bg-slate-800 border-2 border-slate-700 rounded-full focus:ring-4 focus:ring-yellow-500/50 focus:border-yellow-500 focus:outline-none text-slate-100 transition-all duration-300"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || !userInput.trim()} className="p-3 w-12 h-12 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full text-white hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0">
            {isLoading ? <LoadingSpinner size={5} /> : 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
