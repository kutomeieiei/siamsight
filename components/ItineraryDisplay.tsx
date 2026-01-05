
import React from 'react';
import { ItineraryResult } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface ItineraryDisplayProps {
  result: ItineraryResult;
}

const DayMarkerIcon: React.FC<{ day: number }> = ({ day }) => (
  <div className="relative h-12 w-12 md:h-14 md:w-14">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 md:h-14 md:w-14 text-yellow-600">
      <path d="M12,2.25a1,1,0,0,0-1,1V5.62a8.5,8.5,0,0,0-4.23,3.2,1,1,0,0,0-.23,1.1,10.19,10.19,0,0,0,2.2,4.3,1,1,0,0,0,.9,.55H10a1,1,0,0,1,0,2H8.88A3,3,0,0,0,6,19.82a1,1,0,0,0,1,1.13,4.36,4.36,0,0,0,4-2.1,4.36,4.36,0,0,0,4-2.1,1,1,0,0,0,1-1.13A3,3,0,0,0,15.12,18H14a1,1,0,0,1,0-2h1.12a1,1,0,0,0,.9-.55,10.19,10.19,0,0,0,2.2-4.3,1,1,0,0,0-.23-1.1A8.5,8.5,0,0,0,13,5.62V3.25A1,1,0,0,0,12,2.25Z" />
    </svg>
    <span className="absolute inset-0 flex items-center justify-center text-slate-950 font-black text-xs md:text-sm -mt-1">
      {day}
    </span>
  </div>
);

const BudgetBreakdown: React.FC<{ label: string; amount: number; color: string; currency: string }> = ({ label, amount, color, currency }) => (
    <div className="flex items-center justify-between py-3 md:py-4 border-b-2 border-slate-800 last:border-0">
        <div className="flex items-center gap-3 md:gap-4">
            <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${color}`}></div>
            <span className="text-[9px] md:text-[10px] text-slate-500 font-black tracking-tight">{label}</span>
        </div>
        <span className="text-xs md:text-sm text-white font-black">{amount.toLocaleString()} {currency}</span>
    </div>
);

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ result }) => {
  const { t } = useTranslation();
  const { itinerary, sources, total_estimated_cost, currency, cost_breakdown, feasibility_warning } = result;

  const icons: { [key: string]: React.ReactNode } = {
    Morning: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Afternoon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    Evening: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>,
    Food: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M21 15.25v2.25c0 1.49-1.21 2.75-2.75 2.75h-10.5c-1.54 0-2.75-1.26-2.75-2.75v-2.25m16-4.5V4.75c0-1.49-1.21-2.75-2.75-2.75h-10.5C6.21 2 5 3.26 5 4.75v5.025m16 0h-16" /></svg>
  };

  const ActivityCard: React.FC<{ title: string; activity: string; description: string; icon: React.ReactNode }> = ({ title, activity, description, icon }) => (
    <div className="flex items-start space-x-4 md:space-x-6">
      <div className="flex-shrink-0 bg-slate-950 rounded-2xl p-3 md:p-4 text-yellow-500 border-2 border-slate-800 shadow-xl">{icon}</div>
      <div>
        <h4 className="font-black text-white text-lg md:text-xl leading-relaxed mb-1 tracking-tight">{title}: <span className="text-yellow-400">{activity}</span></h4>
        {description && <p className="text-[9px] md:text-[10px] text-slate-500 leading-relaxed font-black tracking-tight">{description}</p>}
      </div>
    </div>
  );
  
  return (
    <div className="mt-12 md:mt-20 max-w-4xl mx-auto animate-fade-in-up space-y-12 md:space-y-16 pb-32 px-4 md:px-0">
      
      {feasibility_warning && (
          <div className="bg-red-950/20 border-l-4 border-yellow-600 p-8 md:p-10 rounded-r-3xl shadow-2xl">
              <div className="flex items-center gap-4 md:gap-5 mb-3 md:mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 14c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h4 className="text-yellow-500 font-black tracking-tight text-[10px] md:text-xs">{t('itineraryDisplay.aiWarning')}</h4>
              </div>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed italic font-black tracking-tight">"{feasibility_warning}"</p>
          </div>
      )}

      <div className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 md:p-10">
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 pb-6 md:pb-8 border-b-2 border-slate-800 gap-4 md:gap-0">
              <div>
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">{t('itineraryDisplay.budgetTitle')}</h3>
                  <p className="text-[9px] md:text-[10px] text-slate-600 font-black tracking-tight mt-2">{t('itineraryDisplay.perPerson')}</p>
              </div>
              <div className="md:text-right">
                  <span className="text-4xl md:text-5xl font-black text-yellow-500 tracking-tighter">{total_estimated_cost.toLocaleString()}</span>
                  <span className="ml-3 md:ml-4 text-[10px] md:text-xs font-black text-slate-600 tracking-tight">{currency}</span>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-20">
                <BudgetBreakdown label={t('itineraryDisplay.accommodation')} amount={cost_breakdown.accommodation} color="bg-yellow-700" currency={currency} />
                <BudgetBreakdown label={t('itineraryDisplay.food')} amount={cost_breakdown.food} color="bg-yellow-600" currency={currency} />
                <BudgetBreakdown label={t('itineraryDisplay.transport')} amount={cost_breakdown.transport} color="bg-yellow-500" currency={currency} />
                <BudgetBreakdown label={t('itineraryDisplay.activities')} amount={cost_breakdown.activities} color="bg-yellow-400" currency={currency} />
           </div>
        </div>
      </div>

      <h3 className="text-3xl md:text-5xl font-black text-center mb-12 md:mb-16 text-white tracking-tighter">{t('itineraryDisplay.title')}</h3>
      <div className="relative space-y-12 md:space-y-16 pl-6 md:pl-10 before:absolute before:inset-y-0 before:w-1 before:bg-slate-800 before:left-[43px] md:before:left-[51px]">
        {itinerary.map((day) => (
          <div key={day.day} className="relative">
            <div className="absolute top-0 -left-1">
              <DayMarkerIcon day={day.day} />
            </div>
            <div className="bg-slate-900 rounded-[2rem] p-6 md:p-10 ml-16 md:ml-20 shadow-2xl border-2 border-slate-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-3 md:gap-0">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter">{t('itineraryDisplay.day')} {day.day}</h3>
                <span className="inline-block bg-yellow-900/40 text-yellow-500 text-[8px] md:text-[10px] font-black tracking-tight px-4 md:px-5 py-2 md:py-2.5 rounded-xl border-2 border-yellow-900/50 self-start md:self-auto">{day.location}</span>
              </div>
              <div className="space-y-8 md:space-y-10">
                  <ActivityCard title={t('itineraryDisplay.morning')} activity={day.morning.activity} description={day.morning.description} icon={icons.Morning} />
                  <ActivityCard title={t('itineraryDisplay.afternoon')} activity={day.afternoon.activity} description={day.afternoon.description} icon={icons.Afternoon} />
                  <ActivityCard title={t('itineraryDisplay.evening')} activity={day.evening.activity} description={day.evening.description} icon={icons.Evening} />
                  <div className="border-t-2 border-slate-800 my-4 md:my-6"></div>
                  <ActivityCard title={t('itineraryDisplay.foodSuggestion')} activity={day.food_suggestion} description="" icon={icons.Food} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {sources && sources.length > 0 && (
        <div className="mt-16 md:mt-20 bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl border-2 border-slate-800">
            <h4 className="text-[9px] md:text-[10px] font-black text-slate-600 tracking-tight mb-6 md:mb-8">{t('itineraryDisplay.sources')}</h4>
            <ul className="space-y-5 md:space-y-6">
                {sources.map((source, index) => (
                    source.web && source.web.uri && (
                        <li key={index} className="truncate">
                            <a 
                                href={source.web.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-yellow-500 hover:text-yellow-400 inline-flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-black tracking-tight transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
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
