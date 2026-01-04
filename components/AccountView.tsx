
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { View } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { PROVINCES } from '../constants';
import { useBranding } from '../contexts/BrandingContext';

interface AccountViewProps {
  setActiveView: (view: View) => void;
}

const AccountView: React.FC<AccountViewProps> = ({ setActiveView }) => {
  const { user, login, signup, logout, updateUser } = useAuth();
  const { t } = useTranslation();
  const { logoUrl, updateLogo, resetLogo } = useBranding();

  const [isLoginView, setIsLoginView] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [province, setProvince] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      <div className="max-w-xl mx-auto animate-fade-in-up pb-20">
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl mb-10">
          <div className="p-10 bg-yellow-600 text-slate-950 border-b-2 border-yellow-700">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-slate-950 flex items-center justify-center text-3xl md:text-4xl font-black border-2 border-yellow-500 shadow-inner text-yellow-500">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-none mb-2">{user.username}</h2>
                <p className="text-yellow-900 text-xs font-black tracking-widest">{t('account.authorizedExplorer')}</p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 space-y-10 md:space-y-12">
            <div className="space-y-6">
              <h3 className="text-white font-black text-lg md:text-xl flex items-center gap-3 tracking-tight">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                {t('account.settings')}
              </h3>
              <div className="bg-slate-800 p-6 md:p-8 rounded-3xl border-2 border-slate-700 shadow-inner">
                <div className="flex flex-col items-center gap-6">
                  <p className="text-[10px] text-slate-500 font-black tracking-widest w-full text-center">{t('account.customizeBranding')}</p>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-600 flex items-center justify-center cursor-pointer hover:border-yellow-500 transition-all overflow-hidden group shadow-2xl"
                  >
                    <img src={logoUrl} alt="Logo Preview" className="max-w-[70%] max-h-[70%] object-contain" />
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] md:text-xs font-black tracking-widest text-yellow-500 hover:text-yellow-400 transition-colors"
                    >
                      {t('account.importLogo')}
                    </button>
                    <span className="text-slate-700">|</span>
                    <button 
                      onClick={resetLogo}
                      className="text-[10px] md:text-xs font-black tracking-widest text-slate-600 hover:text-red-500 transition-colors"
                    >
                      {t('account.resetDefault')}
                    </button>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <div className="bg-slate-800 p-6 md:p-8 rounded-3xl border-2 border-slate-700">
                  <label className="block text-slate-500 text-[10px] font-black tracking-widest mb-4">{t('account.provinceLabel')}</label>
                  <select 
                    value={user.province || ''} 
                    onChange={handleProvinceChange}
                    className="w-full p-4 md:p-5 bg-slate-900 border-2 border-slate-700 rounded-2xl focus:border-yellow-600 focus:outline-none text-white appearance-none cursor-pointer font-black shadow-xl text-sm md:text-base"
                  >
                    <option value="">{t('account.selectProvince')}</option>
                    {sortedProvinces.map(p => (
                        <option key={p.name} value={p.name}>{t(`provinces.${p.name}`)}</option>
                    ))}
                  </select>
               </div>
            </div>

            <button
              onClick={logout}
              className="w-full bg-slate-900 text-slate-400 font-black py-4 md:py-5 rounded-2xl hover:text-yellow-500 border-2 border-slate-800 hover:border-yellow-900/50 transition-all tracking-widest text-[10px] md:text-xs shadow-2xl active:scale-95"
            >
              {t('account.logoutButton')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in pt-6 md:pt-10">
      <div className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border-2 border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-yellow-600"></div>
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-3 tracking-tighter">
            {isLoginView ? t('account.loginTitle') : t('account.signupTitle')}
          </h2>
          <p className="text-slate-600 font-black text-xs md:text-sm tracking-widest">{isLoginView ? t('account.siamIdentification') : t('account.registerNew')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text" 
            placeholder={t('account.usernameLabel')} 
            value={isLoginView ? identifier : username} 
            onChange={(e) => isLoginView ? setIdentifier(e.target.value) : setUsername(e.target.value)} 
            required
            className="w-full p-4 md:p-5 bg-slate-800 border-2 border-slate-700 rounded-2xl focus:border-yellow-600 focus:outline-none text-white placeholder-slate-600 transition-all font-black tracking-tight text-sm md:text-base"
          />
          
          <input
            type="password" 
            placeholder={t('account.passwordLabel')} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required minLength={6}
            className="w-full p-4 md:p-5 bg-slate-800 border-2 border-slate-700 rounded-2xl focus:border-yellow-600 focus:outline-none text-white placeholder-slate-600 transition-all font-black tracking-tight text-sm md:text-base"
          />

          {error && <p className="text-red-500 text-sm text-center font-black bg-red-950/20 p-4 rounded-xl border-2 border-red-900">{error}</p>}
          
          <button
            type="submit" disabled={isLoading}
            className="w-full py-4 md:py-5 rounded-2xl font-black text-[10px] md:text-xs tracking-widest transition-all shadow-2xl disabled:bg-slate-800 bg-yellow-600 text-slate-950 hover:bg-yellow-500 active:scale-95 mt-4"
          >
            {isLoading ? <LoadingSpinner size={6} /> : (isLoginView ? t('account.loginButton') : t('account.signupButton'))}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button onClick={handleToggleView} className="text-slate-500 hover:text-yellow-500 font-black text-[9px] md:text-[10px] tracking-widest transition-colors">
            {isLoginView ? t('account.askSignup') + ' ' + t('account.signupLink') : t('account.askLogin') + ' ' + t('account.loginLink')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountView;
