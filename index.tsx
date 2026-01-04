import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CommunityProvider } from './contexts/CommunityContext';
import { BrandingProvider } from './contexts/BrandingContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <BrandingProvider>
        <AuthProvider>
          <CommunityProvider>
            <App />
          </CommunityProvider>
        </AuthProvider>
      </BrandingProvider>
    </LanguageProvider>
  </React.StrictMode>
);