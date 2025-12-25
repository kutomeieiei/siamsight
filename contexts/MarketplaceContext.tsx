
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Shop } from '../types';
import { LOCAL_SHOPS } from '../constants';
import { useAuth } from './AuthContext';

interface MarketplaceContextType {
    shops: Shop[];
    addShop: (shopData: Omit<Shop, 'id' | 'province'>) => void;
    updateShop: (shopData: Omit<Shop, 'id' | 'province'>) => void;
    isModalOpen: boolean;
    shopToEdit: Shop | null;
    openModalToAdd: () => void;
    openModalToEdit: (shop: Shop) => void;
    closeModal: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const SHOPS_STORAGE_KEY = 'siam-sight-shops';

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [shops, setShops] = useState<Shop[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shopToEdit, setShopToEdit] = useState<Shop | null>(null);
    const { user } = useAuth();

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

    const persistShops = (updatedShops: Shop[]) => {
        localStorage.setItem(SHOPS_STORAGE_KEY, JSON.stringify(updatedShops));
        setShops(updatedShops);
    };

    const addShop = (newShopData: Omit<Shop, 'id' | 'province'>) => {
        if (user?.accountType !== 'business') return;
        
        const newShop: Shop = {
            id: user.businessName, // Use businessName as stable unique ID
            province: user.province,
            ...newShopData
        };

        const updatedShops = [newShop, ...shops];
        persistShops(updatedShops);
    };

    const updateShop = (updatedShopData: Omit<Shop, 'id' | 'province'>) => {
        if (user?.accountType !== 'business') return;
        
        const updatedShops = shops.map(shop => 
            shop.id === user.businessName 
                ? { ...shop, ...updatedShopData } 
                : shop
        );
        persistShops(updatedShops);
    };

    const openModalToAdd = () => {
        setShopToEdit(null);
        setIsModalOpen(true);
    };

    const openModalToEdit = (shop: Shop) => {
        setShopToEdit(shop);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setShopToEdit(null);
    };

    return (
        <MarketplaceContext.Provider value={{ shops, addShop, updateShop, isModalOpen, shopToEdit, openModalToAdd, openModalToEdit, closeModal }}>
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
