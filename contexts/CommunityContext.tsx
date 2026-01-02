
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CommunityMessage } from '../types';
import { useAuth } from './AuthContext';

interface CommunityContextType {
  messages: CommunityMessage[];
  sendMessage: (text: string, province?: string) => void;
  isLoading: boolean;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

const STORAGE_KEY = 'siam-sight-community-v1';

const MOCK_MESSAGES: CommunityMessage[] = [
  {
    id: 'm1',
    senderName: 'Somchai Travel',
    senderType: 'business',
    senderProvince: 'Chiang Mai',
    text: 'Sawasdee everyone! Just wanted to share that the lanterns in Chiang Mai will be extra beautiful tonight.',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'm2',
    senderName: 'Explorer123',
    senderType: 'personal',
    senderProvince: 'Bangkok',
    text: 'Has anyone tried the street food near Khao San Road lately? Any recommendations?',
    timestamp: Date.now() - 1000 * 60 * 30,
  },
  {
    id: 'm3',
    senderName: 'Sarah Smiles',
    senderType: 'personal',
    senderProvince: 'Phuket',
    text: 'The mango sticky rice at Or Tor Kor Market is simply the best!',
    timestamp: Date.now() - 1000 * 60 * 5,
  },
  {
    id: 'm4',
    senderName: 'Lanna Lover',
    senderType: 'personal',
    senderProvince: 'Chiang Mai',
    text: 'Doi Inthanon was freezing this morning! Don’t forget your jackets.',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: 'm5',
    senderName: 'Island Hopper',
    senderType: 'personal',
    senderProvince: 'Krabi',
    text: 'Maya Bay is finally open again! The water looks incredible.',
    timestamp: Date.now() - 1000 * 60 * 60 * 12,
  }
];

export const CommunityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadMessages = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setMessages(JSON.parse(stored));
        } else {
          setMessages(MOCK_MESSAGES);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_MESSAGES));
        }
      } catch (e) {
        console.error('Failed to load community messages', e);
        setMessages(MOCK_MESSAGES);
      } finally {
        setIsLoading(false);
      }
    };
    loadMessages();
  }, []);

  const sendMessage = (text: string, province?: string) => {
    if (!user) return;

    const newMessage: CommunityMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      senderName: user.accountType === 'business' ? user.businessName || user.username : user.username,
      senderType: user.accountType,
      senderProvince: province || user.province, // Favor the specific hub filter if used
      text,
      timestamp: Date.now(),
    };

    const updated = [...messages, newMessage];
    setMessages(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <CommunityContext.Provider value={{ messages, sendMessage, isLoading }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) throw new Error('useCommunity must be used within CommunityProvider');
  return context;
};
