
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Shop } from '../types';
import { INITIAL_SHOPS } from '../marketplace_config';
import { useAuth } from './AuthContext';

// Define the full context type including modal state and shop manipulation methods
interface MarketplaceContextType {
    shops: Shop[];
    isModalOpen: boolean;
    shopToEdit: Shop | null;
    openModal: (shop?: Shop) => void;
    closeModal: () => void;
    addShop: (shopData: Omit<Shop, 'id' | 'province' | 'likeCount'>) => void;
    updateShop: (shopData: Omit<Shop, 'id' | 'province' | 'likeCount'>) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const SHOPS_STORAGE_KEY = 'siam-sight-shops-v2';

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [shops, setShops] = useState<Shop[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shopToEdit, setShopToEdit] = useState<Shop | null>(null);
    const { user } = useAuth();

    // Sync hardcoded INITIAL_SHOPS with localStorage
    useEffect(() => {
        try {
            const storedShopsStr = localStorage.getItem(SHOPS_STORAGE_KEY);
            let finalShops: Shop[] = [];

            if (storedShopsStr) {
                const storedShops: Shop[] = JSON.parse(storedShopsStr);
                const storedIds = new Set(storedShops.map(s => s.id));
                
                // Identify which hardcoded shops are missing from storage
                const newInitialShops = INITIAL_SHOPS.filter(s => !storedIds.has(s.id));
                
                // Also update existing hardcoded shops in case descriptions/images changed
                const updatedStoredShops = storedShops.map(s => {
                    const hardcodedMatch = INITIAL_SHOPS.find(h => h.id === s.id);
                    // Only update if it's a system shop (one that exists in INITIAL_SHOPS)
                    return hardcodedMatch ? { ...hardcodedMatch, ...s, 
                        // We prioritize hardcoded values for core info but keep user likeCounts if they existed
                        nameEn: hardcodedMatch.nameEn,
                        nameTh: hardcodedMatch.nameTh,
                        descriptionEn: hardcodedMatch.descriptionEn,
                        descriptionTh: hardcodedMatch.descriptionTh,
                        imageUrl: hardcodedMatch.imageUrl,
                        province: hardcodedMatch.province,
                        tags: hardcodedMatch.tags,
                        products: hardcodedMatch.products || s.products
                    } : s;
                });

                finalShops = [...updatedStoredShops, ...newInitialShops];
            } else {
                finalShops = INITIAL_SHOPS;
            }

            setShops(finalShops);
            localStorage.setItem(SHOPS_STORAGE_KEY, JSON.stringify(finalShops));
        } catch (error) {
            console.error("Could not sync marketplace data:", error);
            setShops(INITIAL_SHOPS);
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
    const addShop = (shopData: Omit<Shop, 'id' | 'province' | 'likeCount'>) => {
        if (!user || user.accountType !== 'business') return;
        
        const newShop: Shop = {
            ...shopData,
            id: user.businessName || user.username, // Fallback to username if business name is missing
            province: user.province || '',
            likeCount: 0,
        };
        
        if (shops.some(s => s.id === newShop.id)) {
            throw new Error('You already have a shop registered. Please edit your existing shop.');
        }

        saveShops([...shops, newShop]);
    };

    // Business logic for updating an existing shop's details
    const updateShop = (shopData: Omit<Shop, 'id' | 'province' | 'likeCount'>) => {
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
