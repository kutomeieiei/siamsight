
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { View } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { PROVINCES } from '../constants';

interface AccountViewProps {
  setActiveView: (view: View) => void;
}

const AccountView: React.FC<AccountViewProps> = ({ setActiveView }) => {
  const { user, login, signup, logout, updateUser } = useAuth();
  const { t } = useTranslation();

  const [isLoginView, setIsLoginView] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [province, setProvince] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const usersStr = localStorage.getItem('siam-sight-v1-users');
    if (usersStr) {
      setUserCount(Object.keys(JSON.parse(usersStr)).length);
    }
  }, [user]);

  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (user) {
      updateUser({ province: e.target.value });
    } else {
      setProvince(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (isLoginView) {
        await login(identifier, password);
      } else {
        await signup({ username, password, province });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedProvinces = [...PROVINCES].sort((a, b) => 
    t(`provinces.${a.name}`).localeCompare(t(`provinces.${b.name}`))
  );

  if (user) {
    return (
      <div className="max-w-xl mx-auto animate-fade-in-up">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mb-8">
          <div className="p-8 bg-gradient-to-br from-purple-600 to-blue-800 text-white">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold border border-white/30">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-3xl font-black">{user.username}</h2>
                <p className="opacity-80 text-sm font-medium uppercase tracking-widest">Traveler Profile</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-4">
               <div>
                  <label className="block text-slate-500 text-xs font-bold uppercase tracking-tighter mb-2">{t('account.provinceLabel')}</label>
                  <select 
                    value={user.province || ''} 
                    onChange={handleProvinceChange}
                    className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-white appearance-none cursor-pointer"
                  >
                    <option value="">{t('account.selectProvince')}</option>
                    {sortedProvinces.map(p => (
                        <option key={p.name} value={p.name}>{t(`provinces.${p.name}`)}</option>
                    ))}
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-tighter">Database Status</span>
                <p className="text-white font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Local Server Online
                </p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-tighter">Registered Users</span>
                <p className="text-white font-semibold">{userCount} Active Accounts</p>
              </div>
            </div>

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
          <p className="text-slate-500">{isLoginView ? 'Welcome back to Siam Sight' : 'Join the community of travelers'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text" 
            placeholder={t('account.usernameLabel')} 
            value={isLoginView ? identifier : username} 
            onChange={(e) => isLoginView ? setIdentifier(e.target.value) : setUsername(e.target.value)} 
            required
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-slate-500 transition-all"
          />
          
          <input
            type="password" 
            placeholder={t('account.passwordLabel')} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required minLength={6}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-slate-500 transition-all"
          />

          {!isLoginView && (
            <div className="space-y-2">
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest pl-2">{t('account.provinceLabel')}</label>
              <select 
                value={province} 
                onChange={(e) => setProvince(e.target.value)}
                required={!isLoginView}
                className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-white appearance-none cursor-pointer transition-all"
              >
                <option value="">{t('account.selectProvince')}</option>
                {sortedProvinces.map(p => (
                    <option key={p.name} value={p.name}>{t(`provinces.${p.name}`)}</option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="text-red-400 text-sm text-center bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</p>}
          
          <button
            type="submit" disabled={isLoading}
            className="w-full py-4 rounded-2xl font-black text-lg transition-all shadow-xl disabled:opacity-50 bg-purple-600 hover:bg-purple-500 shadow-purple-600/20 active:scale-95"
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
