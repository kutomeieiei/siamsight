import React, { useState } from 'react';
import { ItineraryDay, GroundingChunk } from '../types';
import { INTEREST_KEYS } from '../constants';
import { generateItinerary } from '../services/geminiService';
import ItineraryDisplay from './ItineraryDisplay';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../contexts/LanguageContext';

const ItineraryPlanner: React.FC = () => {
  const [duration, setDuration] = useState<number>(7);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t, locale } = useTranslation();

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (selectedInterests.length === 0) {
      setError(t('itineraryPlanner.errorSelectInterest'));
      return;
    }
    setError(null);
    setIsLoading(true);
    setItinerary(null);
    setSources([]);

    try {
      const translatedInterests = selectedInterests.map(key => t(`interests.${key}`));
      const { itinerary: result, sources: newSources } = await generateItinerary(duration, translatedInterests, locale);
      setItinerary(result);
      setSources(newSources);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-pink-300 to-yellow-300 text-transparent bg-clip-text">{t('itineraryPlanner.title')}</h2>
        <p className="text-slate-400 mb-8">{t('itineraryPlanner.subtitle')}</p>
      </div>
      
      <div className="max-w-2xl mx-auto bg-slate-900/50 p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-800">
        {/* Duration */}
        <div className="mb-8">
          <label htmlFor="duration" className="block text-slate-300 font-medium mb-3">
            {t('itineraryPlanner.durationLabel')}: <span className="text-yellow-400 font-bold text-lg">{t('itineraryPlanner.days', { count: duration })}</span>
          </label>
          <input
            id="duration"
            type="range"
            min="3"
            max="21"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
        </div>

        {/* Interests */}
        <div className="mb-8">
          <h3 className="block text-slate-300 font-medium mb-3">{t('itineraryPlanner.interestsLabel')}</h3>
          <div className="flex flex-wrap gap-3">
            {INTEREST_KEYS.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`px-4 py-2 text-sm rounded-full transition-all duration-200 border-2 ${
                  selectedInterests.includes(interest)
                    ? 'bg-purple-600 text-white font-bold border-purple-600'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-yellow-500 hover:text-white'
                }`}
              >
                {t(`interests.${interest}`)}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-3.5 rounded-lg hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center text-lg transform hover:scale-105 disabled:transform-none"
        >
          {isLoading ? <LoadingSpinner /> : t('itineraryPlanner.generateButton')}
        </button>
      </div>
      
      {isLoading && (
         <div className="text-center mt-8 animate-fade-in">
            <p className="text-slate-300 text-lg">{t('itineraryPlanner.loadingMessage')}</p>
            <p className="text-slate-400 text-sm">{t('itineraryPlanner.loadingSubMessage')}</p>
         </div>
      )}

      {itinerary && <ItineraryDisplay itinerary={itinerary} sources={sources} />}
    </div>
  );
};

export default ItineraryPlanner;