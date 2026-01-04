
export enum View {
  EXPLORE = 'EXPLORE',
  ITINERARY = 'ITINERARY',
  CHAT = 'CHAT',
  COMMUNITY = 'COMMUNITY',
  MARKETPLACE = 'MARKETPLACE',
  ACCOUNT = 'ACCOUNT',
  LEARNING = 'LEARNING',
}

export type Locale = 'en' | 'th';

export interface User {
  accountType: 'personal' | 'business';
  username: string;
  businessName?: string;
  province?: string;
}

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

export interface ItineraryCostBreakdown {
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
}

export interface ItineraryResult {
  itinerary: ItineraryDay[];
  total_estimated_cost: number;
  currency: string;
  cost_breakdown: ItineraryCostBreakdown;
  sources: GroundingChunk[];
  feasibility_warning?: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  sources?: GroundingChunk[];
}

export interface CommunityMessage {
  id: string;
  senderName: string;
  senderType: 'personal' | 'business';
  senderProvince?: string;
  text: string;
  timestamp: number;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface Product {
  name: string;
  price?: string;
  description?: string;
  imageUrl: string;
  likeCount?: number;
}

export interface Shop {
  id: string;
  name: string;
  province: string;
  description: string;
  imageUrl: string;
  tags: string[];
  likeCount: number;
  contact?: {
    facebook?: string;
    whatsapp?: string;
    phone?: string;
    website?: string;
  };
  products?: Product[];
}

export interface UserUpload {
  imageUrl: string;
  title: string;
  province: string;
  description: string;
}
