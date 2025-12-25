
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PROVINCES, BUSINESS_TYPE_KEYS } from '../constants';
import LoadingSpinner from './LoadingSpinner';
import { View } from '../types';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { useTranslation } from '../contexts/LanguageContext';

interface AccountViewProps {
  setActiveView: (view: View) => void;
}

const AccountView: React.FC<AccountViewProps> = ({ setActiveView }) => {
  const { user, login, signup, logout } = useAuth();
  const { shops, openModalToAdd, openModalToEdit } = useMarketplace();
  const { t } = useTranslation();

  const [isLoginView, setIsLoginView] = useState(true);
  const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [password, setPassword] = useState('');
  const [province, setProvince] = useState(PROVINCES[0]?.name || '');
  const [businessType, setBusinessType] = useState(BUSINESS_TYPE_KEYS[0] || '');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (isLoginView) {
        await login(identifier, password);
      } else {
        if (accountType === 'personal') {
          await signup({ username, password }, 'personal');
        } else {
          await signup({ businessName, password, province, businessType }, 'business');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    const isBusiness = user.accountType === 'business';
    const userShop = isBusiness ? shops.find(shop => shop.id === user.businessName) : null;

    return (
      <div className="max-w-xl mx-auto animate-fade-in-up">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Hero Section */}
          <div className={`p-8 bg-gradient-to-br ${isBusiness ? 'from-pink-600 to-purple-800' : 'from-purple-600 to-blue-800'} text-white`}>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold border border-white/30">
                {(isBusiness ? user.businessName : user.username)[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-3xl font-black">{isBusiness ? user.businessName : user.username}</h2>
                <p className="opacity-80 text-sm font-medium uppercase tracking-widest">{t(`account.${user.accountType}Type`)} Profile</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-tighter">Status</span>
                <p className="text-white font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Active Session
                </p>
              </div>
              {isBusiness && (
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-tighter">Location</span>
                  <p className="text-white font-semibold">{t(`provinces.${user.province}`)}</p>
                </div>
              )}
            </div>

            {/* Merchant Logic */}
            {isBusiness && (
              <div className={`p-6 rounded-2xl border-2 border-dashed ${userShop ? 'border-green-500/30 bg-green-500/5' : 'border-pink-500/30 bg-pink-500/5'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-xl font-bold mb-2 ${userShop ? 'text-green-400' : 'text-pink-400'}`}>
                      {userShop ? 'Marketplace Live' : 'Marketplace Pending'}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      {userShop 
                        ? 'Your shop is visible to all travelers. Keep your details fresh to attract more customers.' 
                        : 'You haven\'t listed your shop yet. Upload a photo and description to start selling.'}
                    </p>
                    <button 
                      onClick={() => userShop ? openModalToEdit(userShop) : openModalToAdd()}
                      className={`px-6 py-3 rounded-xl font-bold transition-all ${userShop ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-pink-600 text-white hover:bg-pink-500'}`}
                    >
                      {userShop ? t('account.editListingButton') : t('account.addListingButton')}
                    </button>
                  </div>
                  <div className={`p-4 rounded-xl ${userShop ? 'bg-green-500/20 text-green-400' : 'bg-pink-500/20 text-pink-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={logout}
              className="w-full bg-slate-800 text-slate-300 font-bold py-4 rounded-2xl hover:bg-red-500/10 hover:text-red-400 border border-slate-700 hover:border-red-500/50 transition-all"
            >
              {t('account.logoutButton')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <div className="bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white mb-2">
            {isLoginView ? t('account.loginTitle') : t('account.signupTitle')}
          </h2>
          <p className="text-slate-500">{isLoginView ? 'Welcome back to Siam Sight' : 'Join the community of travelers and merchants'}</p>
        </div>
        
        {!isLoginView && (
          <div className="flex bg-slate-800 p-1 rounded-2xl mb-8">
            <button 
              onClick={() => setAccountType('personal')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${accountType === 'personal' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              {t('account.personalType')}
            </button>
            <button 
              onClick={() => setAccountType('business')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${accountType === 'business' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              {t('account.businessType')}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isLoginView ? (
            <div>
              <input
                type="text" placeholder={t('account.identifierLabel')} value={identifier} onChange={(e) => setIdentifier(e.target.value)} required
                className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-slate-500"
              />
            </div>
          ) : accountType === 'personal' ? (
            <input
              type="text" placeholder={t('account.usernameLabel')} value={username} onChange={(e) => setUsername(e.target.value)} required
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-slate-500"
            />
          ) : (
            <>
              <input
                type="text" placeholder={t('account.businessNameLabel')} value={businessName} onChange={(e) => setBusinessName(e.target.value)} required
                className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-white placeholder-slate-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={province} onChange={(e) => setProvince(e.target.value)} required
                  className="p-4 bg-slate-800 border border-slate-700 rounded-2xl text-slate-300 focus:outline-none"
                >
                  {PROVINCES.map(p => <option key={p.name} value={p.name}>{t(`provinces.${p.name}`)}</option>)}
                </select>
                <select
                  value={businessType} onChange={(e) => setBusinessType(e.target.value)} required
                  className="p-4 bg-slate-800 border border-slate-700 rounded-2xl text-slate-300 focus:outline-none"
                >
                  {BUSINESS_TYPE_KEYS.map(type => <option key={type} value={type}>{t(`businessTypes.${type}`)}</option>)}
                </select>
              </div>
            </>
          )}
          
          <input
            type="password" placeholder={t('account.passwordLabel')} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
            className={`w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:outline-none text-white placeholder-slate-500 ${isLoginView ? 'focus:ring-purple-500' : accountType === 'business' ? 'focus:ring-pink-500' : 'focus:ring-purple-500'}`}
          />

          {error && <p className="text-red-400 text-sm text-center bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</p>}
          
          <button
            type="submit" disabled={isLoading}
            className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-xl disabled:opacity-50 ${isLoginView ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20' : accountType === 'business' ? 'bg-pink-600 hover:bg-pink-500 shadow-pink-600/20' : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'}`}
          >
            {isLoading ? <LoadingSpinner size={6} /> : (isLoginView ? t('account.loginButton') : t('account.signupButton'))}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={handleToggleView} className="text-slate-400 hover:text-white font-medium transition-colors">
            {isLoginView ? t('account.askSignup') + ' ' + t('account.signupLink') : t('account.askLogin') + ' ' + t('account.loginLink')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountView;
