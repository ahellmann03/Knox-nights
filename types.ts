export enum TargetAudience {
  STUDENTS = 'Students',
  PROFESSIONALS = 'Young Professionals',
  BEER_LOVERS = 'Beer Enthusiasts',
  COCKTAIL_FANS = 'Cocktail Aficionados',
  SPORTS_FANS = 'Sports Fans'
}

export type BarVibe = 'Chill' | 'Live Music' | 'Packed' | 'Romantic' | 'Sports' | 'Upscale';

export interface Bar {
  id: string;
  name: string;
  address: string;
  image: string;
  rating: number;
  description: string;
  tags: string[];
  vibe: BarVibe;
}

export interface Deal {
  id: string;
  barId: string;
  barName: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  startTime: string;
  endTime: string;
  tags: string[];
}

export interface Coupon {
  id: string;
  barId: string;
  barName: string;
  title: string;
  description: string;
  code: string;
  discountAmount: string;
  targetAudience: TargetAudience;
  expiry: string;
}

export interface UserProfile {
  id: string;
  name: string;
  preferences: TargetAudience[];
}