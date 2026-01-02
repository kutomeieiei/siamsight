
import React, { useState } from 'react';
import Header from './components/Header';
import FooterNav from './components/FooterNav';
import { View, Province, FeaturedAttraction, Shop } from './types';
import ItineraryPlanner from './components/ItineraryPlanner';
import ExploreView from './components/ExploreView';
import Chatbot from './components/Chatbot';
import CommunityView from './components/CommunityView';
import AccountView from './components/AccountView';
import MarketplaceView from './components/MarketplaceView';
import LearningView from './components/LearningView';
import ProvinceDetailView from './components/ProvinceDetailView';
import AttractionDetailView from './components/AttractionDetailView';
import ShopDetailView from './components/ShopDetailView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.EXPLORE);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedAttraction, setSelectedAttraction] = useState<FeaturedAttraction | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  const handleSelectProvince = (province: Province) => {
    setSelectedProvince(province);
    setSelectedAttraction(null);
    setSelectedShop(null);
  };

  const handleSelectAttraction = (attraction: FeaturedAttraction) => {
    setSelectedAttraction(attraction);
    setSelectedProvince(null);
    setSelectedShop(null);
  };

  const handleSelectShop = (shop: Shop) => {
    setSelectedShop(shop);
    setSelectedProvince(null);
    setSelectedAttraction(null);
  };

  const handleBackToExplore = () => {
    setSelectedProvince(null);
    setSelectedAttraction(null);
    setSelectedShop(null);
  };

  const renderContent = () => {
    // Detail views take precedence over the main navigation views
    if (selectedProvince) {
      return <ProvinceDetailView province={selectedProvince} onBack={handleBackToExplore} />;
    }
    if (selectedAttraction) {
      return <AttractionDetailView attraction={selectedAttraction} onBack={handleBackToExplore} />;
    }
    if (selectedShop) {
      return <ShopDetailView shop={selectedShop} onBack={() => setSelectedShop(null)} />;
    }

    switch (activeView) {
      case View.EXPLORE:
        return (
          <ExploreView 
            onSelectProvince={handleSelectProvince} 
            onSelectAttraction={handleSelectAttraction} 
          />
        );
      case View.ITINERARY:
        return <ItineraryPlanner />;
      case View.MARKETPLACE:
        return <MarketplaceView onSelectShop={handleSelectShop} />;
      case View.LEARNING:
        return <LearningView />;
      case View.COMMUNITY:
        return <CommunityView />;
      case View.CHAT:
        return <Chatbot />;
      case View.ACCOUNT:
        return <AccountView setActiveView={setActiveView} />;
      default:
        return <ExploreView onSelectProvince={handleSelectProvince} onSelectAttraction={handleSelectAttraction} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        {renderContent()}
      </main>
      <FooterNav 
        activeView={activeView} 
        setActiveView={(view) => {
          setActiveView(view);
          // Reset detail views when switching main tabs
          setSelectedProvince(null);
          setSelectedAttraction(null);
          setSelectedShop(null);
        }} 
      />
    </div>
  );
};

export default App;
