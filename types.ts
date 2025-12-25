
export enum View {
  EXPLORE = 'EXPLORE',
  ITINERARY = 'ITINERARY',
  CHAT = 'CHAT',
  ACCOUNT = 'ACCOUNT',
  MARKETPLACE = 'MARKETPLACE',
}

export type Locale = 'en' | 'th';

export interface PersonalUser {
  accountType: 'personal';
  username: string;
}

export interface BusinessUser {
  accountType: 'business';
  businessName: string;
  province: string;
  businessType: string;
}

export type User = PersonalUser | BusinessUser;


export interface Province {
  name: string;
  description: string;
  imageUrl: string;
  region: 'North' | 'Northeast' | 'Central' | 'West' | 'East' | 'South';
  lat: number;
  lng: number;
}

export interface FeaturedAttraction {
  key: string;
  name: string;
  province: string;
  description: string;
  imageUrl: string;
  lat: number;
  lng: number;
}

export interface ItineraryActivity {
  activity: string;
  description: string;
}

export interface ItineraryDay {
  day: number;
  location: string;
  morning: ItineraryActivity;
  afternoon: ItineraryActivity;
  evening: ItineraryActivity;
  food_suggestion: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface GroundingSource {
  uri?: string;
  title?: string;
}

export interface GroundingChunk {
  web?: GroundingSource;
}

export interface Shop {
  id: string; // Unique ID (e.g. owner's business name)
  name: string; // Display name of the shop
  province: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

export interface UserUpload {
  imageUrl: string;
  title: string;
  province: string;
  description: string;
}
