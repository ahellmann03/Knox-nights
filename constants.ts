import { Bar, Deal, Coupon, UserProfile, TargetAudience } from './types';

export const MOCK_BARS: Bar[] = [
  {
    id: 'b1',
    name: 'Preservation Pub',
    address: '28 Market Square, Knoxville',
    image: 'https://picsum.photos/seed/prespub/400/300',
    rating: 4.8,
    description: 'A historic, multi-level bar featuring a rooftop garden and nightly live music.',
    tags: ['Rooftop', 'Live Music', 'Beer'],
    vibe: 'Live Music'
  },
  {
    id: 'b2',
    name: 'Suttree\'s High Gravity Tavern',
    address: '409 S Gay St, Knoxville',
    image: 'https://picsum.photos/seed/suttrees/400/300',
    rating: 4.9,
    description: 'Specializing in high-gravity beers and ramen in a cozy, vintage atmosphere.',
    tags: ['Craft Beer', 'Arcade', 'Ramen'],
    vibe: 'Chill'
  },
  {
    id: 'b3',
    name: 'Downtown Grill & Brewery',
    address: '424 S Gay St, Knoxville',
    image: 'https://picsum.photos/seed/brewery/400/300',
    rating: 4.5,
    description: 'Knoxville’s oldest brewery offering classic pub fare and house-brewed ales.',
    tags: ['Brewery', 'Food', 'Groups'],
    vibe: 'Sports'
  },
  {
    id: 'b4',
    name: 'Bernadette\'s Crystal Gardens',
    address: '26 Market Square, Knoxville',
    image: 'https://picsum.photos/seed/crystal/400/300',
    rating: 4.7,
    description: 'A stunning 3-story crystal bar with a gemstone cave and rooftop seating.',
    tags: ['Cocktails', 'Rooftop', 'Unique'],
    vibe: 'Upscale'
  },
  {
    id: 'b5',
    name: 'Pour Taproom',
    address: '207 W Jackson Ave, Knoxville',
    image: 'https://picsum.photos/seed/pour/400/300',
    rating: 4.6,
    description: 'Pay-by-the-ounce taproom featuring a massive selection of beer and wine.',
    tags: ['Self-Serve', 'Variety', 'Patio'],
    vibe: 'Packed'
  },
  {
    id: 'b6',
    name: 'Tern Club',
    address: '135 S Gay St, Knoxville',
    image: 'https://picsum.photos/seed/tern/400/300',
    rating: 4.8,
    description: 'Tropical-inspired cocktail bar with a mid-century modern aesthetic.',
    tags: ['Tiki', 'Cocktails', 'Intimate'],
    vibe: 'Romantic'
  }
];

export const MOCK_DEALS: Deal[] = [
  {
    id: 'd1',
    barId: 'b1',
    barName: 'Preservation Pub',
    title: 'Magic Hat Happy Hour',
    description: '$3 Magic Hat #9 pints on the rooftop garden.',
    price: '$3.00',
    imageUrl: 'https://picsum.photos/seed/beer1/400/300',
    startTime: '16:00',
    endTime: '19:00',
    tags: ['Beer', 'Rooftop']
  },
  {
    id: 'd2',
    barId: 'b2',
    barName: 'Suttree\'s High Gravity Tavern',
    title: 'Ramen & High Gravity',
    description: '$2 off any high gravity pour with a ramen bowl purchase.',
    price: '-$2.00',
    imageUrl: 'https://picsum.photos/seed/ramen/400/300',
    startTime: '17:00',
    endTime: '22:00',
    tags: ['Food', 'Craft Beer']
  },
  {
    id: 'd3',
    barId: 'b6',
    barName: 'Tern Club',
    title: 'Tiki Tuesday',
    description: 'Half price Mai Tais all night long.',
    price: '$6.00',
    imageUrl: 'https://picsum.photos/seed/tiki/400/300',
    startTime: '17:00',
    endTime: '23:00',
    tags: ['Cocktails', 'Tropical']
  }
];

export const MOCK_COUPONS: Coupon[] = [
  {
    id: 'c1',
    barId: 'b3',
    barName: 'Downtown Grill & Brewery',
    title: 'Free Pretzel Appetizer',
    description: 'Get a free pretzel with purchase of any two flights.',
    code: 'PRETZEL24',
    discountAmount: 'FREE',
    targetAudience: TargetAudience.BEER_LOVERS,
    expiry: 'Expires in 2 days'
  },
  {
    id: 'c2',
    barId: 'b4',
    barName: 'Bernadette\'s Crystal Gardens',
    title: '2-for-1 Gemstone Cocktails',
    description: 'Buy one signature cocktail, get one free on the rooftop.',
    code: 'GEMSTONE24',
    discountAmount: 'BOGO',
    targetAudience: TargetAudience.COCKTAIL_FANS,
    expiry: 'Expires tonight'
  }
];

export const MOCK_USER: UserProfile = {
  id: 'u1',
  name: 'Alex',
  preferences: [TargetAudience.BEER_LOVERS, TargetAudience.STUDENTS, TargetAudience.COCKTAIL_FANS]
};