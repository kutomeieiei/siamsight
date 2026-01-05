
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

// Standard views get internal padding
const ViewContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="container mx-auto px-4 py-8">{children}</div>
);

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
    if (selectedProvince) {
      return (
        <ProvinceDetailView 
          province={selectedProvince} 
          onBack={handleBackToExplore} 
          onSelectAttraction={handleSelectAttraction}
        />
      );
    }
    if (selectedAttraction) {
      return <AttractionDetailView attraction={selectedAttraction} onBack={handleBackToExplore} />;
    }
    if (selectedShop) {
      return (
        <ShopDetailView 
          shop={selectedShop} 
          onBack={() => setSelectedShop(null)} 
          setActiveView={setActiveView}
        />
      );
    }

    switch (activeView) {
      case View.EXPLORE:
        return (
          <ViewContainer>
            <ExploreView 
              onSelectProvince={handleSelectProvince} 
              onSelectAttraction={handleSelectAttraction} 
            />
          </ViewContainer>
        );
      case View.ITINERARY:
        return <ViewContainer><ItineraryPlanner /></ViewContainer>;
      case View.MARKETPLACE:
        return <ViewContainer><MarketplaceView onSelectShop={handleSelectShop} setActiveView={setActiveView} /></ViewContainer>;
      case View.LEARNING:
        return <ViewContainer><LearningView /></ViewContainer>;
      case View.COMMUNITY:
        return <CommunityView setActiveView={setActiveView} />;
      case View.CHAT:
        return <Chatbot />;
      case View.ACCOUNT:
        return <ViewContainer><AccountView setActiveView={setActiveView} /></ViewContainer>;
      default:
        return (
          <ViewContainer>
            <ExploreView onSelectProvince={handleSelectProvince} onSelectAttraction={handleSelectAttraction} />
          </ViewContainer>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-24">
      <Header />
      <main className="flex-1">
        {renderContent()}
      </main>
      <FooterNav 
        activeView={activeView} 
        setActiveView={(view) => {
          setActiveView(view);
          setSelectedProvince(null);
          setSelectedAttraction(null);
          setSelectedShop(null);
        }} 
      />
    </div>
  );
};

export default App;
