import { CommunityMessage } from '../types';
import { useAuth } from './AuthContext';
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface CommunityContextType {
  messages: CommunityMessage[];
  sendMessage: (text: string, province?: string) => void;
  clearMessages: () => void;
  isLoading: boolean;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

const STORAGE_KEY = 'siam-sight-community-v1';

const MOCK_MESSAGES: CommunityMessage[] = [
  {
    id: 'm1',
    senderName: 'somchai222',
    senderType: 'personal',
    senderProvince: 'Khon Kaen',
    text: 'มาขอนเเก่นต้องไปไหว้พระธาตุขามเเก่นครับ',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'm2',
    senderName: 'boyKK',
    senderType: 'personal',
    senderProvince: 'Sakon Nakhon',
    text: 'จริงครับตรงนั้นดีจริง',
    timestamp: Date.now() - 1000 * 60 * 30,
  },
  {
    id: 'm3',
    senderName: 'kritsana',
    senderType: 'personal',
    senderProvince: 'Khon Kaen',
    text: 'ใช่ครับไปที่นั้นเเล้ว มีร้านไก่ย่างอร่อยมาก',
    timestamp: Date.now() - 1000 * 60 * 5,
  },
  {
    id: 'm4',
    senderName: 'Atomlnwza007',
    senderType: 'personal',
    senderProvince: 'Chiang Mai',
    text: 'เชียงใหม่ก็มีไก่น้ำเงี้ยว อร่อยมากครับ',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: 'm5',
    senderName: 'lewis johnson',
    senderType: 'personal',
    senderProvince: 'Bangkok',
    text: 'Hey ,I’m looking forward to go to Phuwiang Museum because my kids really loves dinosaur , Anyone got any advice?',
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

  const clearMessages = () => {
    setMessages(MOCK_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_MESSAGES));
  };

  return (
    <CommunityContext.Provider value={{ messages, sendMessage, clearMessages, isLoading }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) throw new Error('useCommunity must be used within CommunityProvider');
  return context;
};
