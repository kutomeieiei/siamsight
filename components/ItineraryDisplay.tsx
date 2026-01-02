import React from 'react';
import { ItineraryResult } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface ItineraryDisplayProps {
  result: ItineraryResult;
}

const DayMarkerIcon: React.FC<{ day: number }> = ({ day }) => (
  <div className="relative h-14 w-14">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-14 w-14 text-purple-600 drop-shadow-lg">
      <path d="M12,2.25a1,1,0,0,0-1,1V5.62a8.5,8.5,0,0,0-4.23,3.2,1,1,0,0,0-.23,1.1,10.19,10.19,0,0,0,2.2,4.3,1,1,0,0,0,.9,.55H10a1,1,0,0,1,0,2H8.88A3,3,0,0,0,6,19.82a1,1,0,0,0,1,1.13,4.36,4.36,0,0,0,4-2.1,4.36,4.36,0,0,0,4-2.1,1,1,0,0,0,1-1.13A3,3,0,0,0,15.12,18H14a1,1,0,0,1,0-2h1.12a1,1,0,0,0,.9-.55,10.19,10.19,0,0,0,2.2-4.3,1,1,0,0,0-.23-1.1A8.5,8.5,0,0,0,13,5.62V3.25A1,1,0,0,0,12,2.25Z" />
    </svg>
    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm -mt-1 drop-shadow-sm">
      {day}
    </span>
  </div>
);

const BudgetBreakdown: React.FC<{ label: string; amount: number; color: string; currency: string }> = ({ label, amount, color, currency }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${color}`}></div>
            <span className="text-sm text-slate-400 font-medium">{label}</span>
        </div>
        <span className="text-sm text-white font-bold">{amount.toLocaleString()} {currency}</span>
    </div>
);

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ result }) => {
  const { t } = useTranslation();
  const { itinerary, sources, total_estimated_cost, currency, cost_breakdown, feasibility_warning } = result;

  const icons: { [key: string]: React.ReactNode } = {
    Morning: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Afternoon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    Evening: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>,
    Food: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 15.25v2.25c0 1.49-1.21 2.75-2.75 2.75h-10.5c-1.54 0-2.75-1.26-2.75-2.75v-2.25m16-4.5V4.75c0-1.49-1.21-2.75-2.75-2.75h-10.5C6.21 2 5 3.26 5 4.75v5.025m16 0h-16" /></svg>
  };

  const ActivityCard: React.FC<{ title: string; activity: string; description: string; icon: React.ReactNode }> = ({ title, activity, description, icon }) => (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 bg-purple-900/50 rounded-full p-3 text-yellow-400">{icon}</div>
      <div>
        <h4 className="font-semibold text-slate-100">{title}: <span className="font-normal text-slate-200">{activity}</span></h4>
        {description && <p className="text-sm text-slate-400">{description}</p>}
      </div>
    </div>
  );
  
  return (
    <div className="mt-12 max-w-4xl mx-auto animate-fade-in-up space-y-8 pb-10">
      
      {/* Feasibility Warning from AI */}
      {feasibility_warning && (
          <div className="bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-3xl shadow-xl animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 14c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h4 className="text-red-400 font-bold uppercase tracking-widest text-sm">{t('itineraryDisplay.aiWarning')}</h4>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed italic">"{feasibility_warning}"</p>
          </div>
      )}

      {/* Budget Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-6 bg-gradient-to-r from-yellow-600/20 to-transparent border-b border-slate-800">
           <div className="flex items-center justify-between mb-4">
              <div>
                  <h3 className="text-2xl font-black text-white">{t('itineraryDisplay.budgetTitle')}</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{t('itineraryDisplay.perPerson')}</p>
              </div>
              <div className="text-right">
                  <span className="text-3xl font-black text-yellow-400">{total_estimated_cost.toLocaleString()}</span>
                  <span className="ml-2 text-sm font-bold text-slate-500">{currency}</span>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                <BudgetBreakdown label={t('itineraryDisplay.accommodation')} amount={cost_breakdown.accommodation} color="bg-blue-500" currency={currency} />
                <BudgetBreakdown label={t('itineraryDisplay.food')} amount={cost_breakdown.food} color="bg-green-500" currency={currency} />
                <BudgetBreakdown label={t('itineraryDisplay.transport')} amount={cost_breakdown.transport} color="bg-amber-500" currency={currency} />
                <BudgetBreakdown label={t('itineraryDisplay.activities')} amount={cost_breakdown.activities} color="bg-purple-500" currency={currency} />
           </div>
        </div>
      </div>

      <h3 className="text-3xl font-bold text-center mb-8 text-white">{t('itineraryDisplay.title')}</h3>
      <div className="relative space-y-8 pl-8 before:absolute before:inset-y-0 before:w-0.5 before:bg-slate-700/80 before:left-12">
        {itinerary.map((day) => (
          <div key={day.day} className="relative">
            <div className="absolute top-0 -left-1">
              <DayMarkerIcon day={day.day} />
            </div>
            <div className="bg-slate-800/80 rounded-xl p-6 ml-16 shadow-lg border border-slate-700/50">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-white">{t('itineraryDisplay.day')} {day.day}</h3>
                <span className="bg-yellow-900/50 text-yellow-300 text-sm font-medium px-3 py-1 rounded-full border border-yellow-800">{day.location}</span>
              </div>
              <div className="space-y-5">
                  <ActivityCard title={t('itineraryDisplay.morning')} activity={day.morning.activity} description={day.morning.description} icon={icons.Morning} />
                  <ActivityCard title={t('itineraryDisplay.afternoon')} activity={day.afternoon.activity} description={day.afternoon.description} icon={icons.Afternoon} />
                  <ActivityCard title={t('itineraryDisplay.evening')} activity={day.evening.activity} description={day.evening.description} icon={icons.Evening} />
                  <div className="border-t border-slate-700/50 my-4"></div>
                  <ActivityCard title={t('itineraryDisplay.foodSuggestion')} activity={day.food_suggestion} description="" icon={icons.Food} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {sources && sources.length > 0 && (
        <div className="mt-12 bg-slate-800/80 rounded-xl p-6 shadow-lg border border-slate-700/50">
            <h4 className="text-lg font-bold text-white mb-3">{t('itineraryDisplay.sources')}</h4>
            <ul className="space-y-2">
                {sources.map((source, index) => (
                    source.web && source.web.uri && (
                        <li key={index} className="text-slate-400 truncate">
                            <a 
                                href={source.web.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-yellow-400 hover:underline inline-flex items-center gap-1 text-sm"
                                title={source.web.title || source.web.uri}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                              <span>{source.web.title || source.web.uri}</span>
                            </a>
                        </li>
                    )
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};

export default ItineraryDisplay;