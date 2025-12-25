
import React, { useState } from 'react';
import Header from './components/Header';
import FooterNav from './components/FooterNav';
import { View, Province, FeaturedAttraction } from './types';
import ItineraryPlanner from './components/ItineraryPlanner';
import ExploreView from './components/ExploreView';
import Chatbot from './components/Chatbot';
import AccountView from './components/AccountView';
import MarketplaceView from './components/MarketplaceView';
import AddEditShopModal from './components/AddEditShopModal';
import ProvinceDetailView from './components/ProvinceDetailView';
import AttractionDetailView from './components/AttractionDetailView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.EXPLORE);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedAttraction, setSelectedAttraction] = useState<FeaturedAttraction | null>(null);

  const handleSelectProvince = (province: Province) => {
    setSelectedProvince(province);
    setSelectedAttraction(null);
  };

  const handleSelectAttraction = (attraction: FeaturedAttraction) => {
    setSelectedAttraction(attraction);
    setSelectedProvince(null);
  };

  const handleBackToExplore = () => {
    setSelectedProvince(null);
    setSelectedAttraction(null);
  };

  const renderContent = () => {
    if (selectedAttraction) {
      return <AttractionDetailView attraction={selectedAttraction} onBack={handleBackToExplore} />;
    }
    if (selectedProvince) {
      return <ProvinceDetailView province={selectedProvince} onBack={handleBackToExplore} />;
    }

    switch (activeView) {
      case View.ITINERARY:
        return <ItineraryPlanner />;
      case View.CHAT:
        return <Chatbot />;
      case View.ACCOUNT:
        return <AccountView setActiveView={setActiveView} />;
      case View.MARKETPLACE:
        return <MarketplaceView setActiveView={setActiveView} />;
      case View.EXPLORE:
      default:
        return <ExploreView onSelectProvince={handleSelectProvince} onSelectAttraction={handleSelectAttraction} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ isolation: 'isolate' }}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 mb-24">
        {renderContent()}
      </main>
      <FooterNav activeView={activeView} setActiveView={setActiveView} />
      <AddEditShopModal />
    </div>
  );
};

export default App;
