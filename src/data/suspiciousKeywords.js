export const SUSPICIOUS_URL_KEYWORDS = [
  {
    keyword: 'login',
    points: 15,
    description: 'Login-related words are often used to imitate account pages.',
  },
  {
    keyword: 'verify',
    points: 16,
    description: 'Verification wording can create pressure to confirm an account.',
  },
  {
    keyword: 'secure',
    points: 14,
    description: 'Security-related wording can be used to make a link look trustworthy.',
  },
  {
    keyword: 'account',
    points: 15,
    description: 'Account-related wording may be used in fake sign-in pages.',
  },
  {
    keyword: 'update',
    points: 14,
    description: 'Update wording is commonly used in fake account warning messages.',
  },
  {
    keyword: 'free',
    points: 18,
    description: 'Free offers can be used as bait in phishing links.',
  },
  {
    keyword: 'gift',
    points: 18,
    description: 'Gift-related wording can be used to attract clicks.',
  },
  {
    keyword: 'bonus',
    points: 16,
    description: 'Bonus promises can be used in social engineering attempts.',
  },
  {
    keyword: 'urgent',
    points: 20,
    description: 'Urgency is a common phishing pressure technique.',
  },
  {
    keyword: 'bank',
    points: 20,
    description: 'Banking-related wording should be checked carefully.',
  },
  {
    keyword: 'wallet',
    points: 20,
    description: 'Wallet-related wording can target crypto or payment accounts.',
  },
];

export const PROMOTIONAL_URL_KEYWORDS = ['free', 'gift', 'bonus'];

export const BRAND_LIKE_TERMS = [
  'amazon',
  'google',
  'microsoft',
  'apple',
  'facebook',
  'instagram',
  'paypal',
  'netflix',
  'spotify',
  'binance',
];