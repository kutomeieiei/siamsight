
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Shop } from '../types';
import { LOCAL_SHOPS } from '../constants';
import { useAuth } from './AuthContext';

// Define the full context type including modal state and shop manipulation methods
interface MarketplaceContextType {
    shops: Shop[];
    isModalOpen: boolean;
    shopToEdit: Shop | null;
    openModal: (shop?: Shop) => void;
    closeModal: () => void;
    addShop: (shopData: Omit<Shop, 'id' | 'province'>) => void;
    updateShop: (shopData: Omit<Shop, 'id' | 'province'>) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const SHOPS_STORAGE_KEY = 'siam-sight-shops';

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [shops, setShops] = useState<Shop[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shopToEdit, setShopToEdit] = useState<Shop | null>(null);
    const { user } = useAuth();

    // Load initial shop data from localStorage or fallback to constants
    useEffect(() => {
        try {
            const storedShops = localStorage.getItem(SHOPS_STORAGE_KEY);
            if (storedShops) {
                setShops(JSON.parse(storedShops));
            } else {
                // Seed with initial data if localStorage is empty
                setShops(LOCAL_SHOPS);
                localStorage.setItem(SHOPS_STORAGE_KEY, JSON.stringify(LOCAL_SHOPS));
            }
        } catch (error) {
            console.error("Could not access localStorage for shops:", error);
            setShops(LOCAL_SHOPS);
        }
    }, []);

    // Persist shop list to localStorage
    const saveShops = (updatedShops: Shop[]) => {
        setShops(updatedShops);
        localStorage.setItem(SHOPS_STORAGE_KEY, JSON.stringify(updatedShops));
    };

    // Open modal for adding (no shop passed) or editing (shop passed)
    const openModal = (shop?: Shop) => {
        setShopToEdit(shop || null);
        setIsModalOpen(true);
    };

    // Close modal and reset editing state
    const closeModal = () => {
        setIsModalOpen(false);
        setShopToEdit(null);
    };

    // Business logic for adding a new shop based on current authenticated business user
    const addShop = (shopData: Omit<Shop, 'id' | 'province'>) => {
        if (!user || user.accountType !== 'business') return;
        
        const newShop: Shop = {
            ...shopData,
            id: user.businessName || user.username, // Fallback to username if business name is missing
            province: user.province || '',
        };
        
        // Prevent multiple shops for the same business identifier in this mock
        if (shops.some(s => s.id === newShop.id)) {
            throw new Error('You already have a shop registered. Please edit your existing shop.');
        }

        saveShops([...shops, newShop]);
    };

    // Business logic for updating an existing shop's details
    const updateShop = (shopData: Omit<Shop, 'id' | 'province'>) => {
        if (!shopToEdit) return;
        
        const updatedShops = shops.map(s => 
            s.id === shopToEdit.id ? { ...s, ...shopData } : s
        );
        saveShops(updatedShops);
    };

    return (
        <MarketplaceContext.Provider value={{ 
            shops, 
            isModalOpen, 
            shopToEdit, 
            openModal, 
            closeModal, 
            addShop, 
            updateShop 
        }}>
            {children}
        </MarketplaceContext.Provider>
    );
};


export const useMarketplace = (): MarketplaceContextType => {
    const context = useContext(MarketplaceContext);
    if (context === undefined) {
        throw new Error('useMarketplace must be used within a MarketplaceProvider');
    }
    return context;
};
