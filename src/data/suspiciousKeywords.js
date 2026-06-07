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


export const TEXT_RISK_PATTERNS = [
  {
    id: 'urgency-pressure',
    title: 'Urgency pressure detected',
    points: 20,
    keywords: [
      'urgent',
      'immediately',
      'right now',
      'today',
      'within 24 hours',
      'act now',
      'last chance',
      'limited time',
      'acil',
      'hemen',
      'bugün',
      'son şans',
      '24 saat',
    ],
    description:
      'The message creates time pressure. Phishing messages often push users to act quickly without thinking.',
  },
  {
    id: 'reward-or-money',
    title: 'Reward or money-related wording detected',
    points: 18,
    keywords: [
      'free',
      'gift',
      'prize',
      'reward',
      'bonus',
      'winner',
      'won',
      'cash',
      'money',
      'refund',
      'ücretsiz',
      'hediye',
      'ödül',
      'kazandınız',
      'para',
      'iade',
      'bonus',
    ],
    description:
      'Reward or money promises can be used as bait to make users click links or share information.',
  },
  {
    id: 'account-threat',
    title: 'Account threat wording detected',
    points: 22,
    keywords: [
      'account will be closed',
      'account suspended',
      'account locked',
      'verify your account',
      'security alert',
      'unusual activity',
      'hesabınız kapatılacak',
      'hesabınız askıya alındı',
      'hesabınızı doğrulayın',
      'güvenlik uyarısı',
      'olağandışı hareket',
    ],
    description:
      'Account threats are common in phishing messages because they create fear of losing access.',
  },
  {
    id: 'sensitive-data-request',
    title: 'Sensitive information request detected',
    points: 28,
    keywords: [
      'password',
      'credit card',
      'card number',
      'verification code',
      'security code',
      'cvv',
      'pin',
      'one-time code',
      'otp',
      'şifre',
      'kart numarası',
      'doğrulama kodu',
      'güvenlik kodu',
      'tek kullanımlık kod',
    ],
    description:
      'Requests for passwords, card details, or verification codes are strong warning signs.',
  },
  {
    id: 'personal-info-request',
    title: 'Personal information request detected',
    points: 18,
    keywords: [
      'identity number',
      'social security',
      'date of birth',
      'address',
      'phone number',
      'personal information',
      'kimlik numarası',
      'tc kimlik',
      'doğum tarihi',
      'adres',
      'telefon numarası',
      'kişisel bilgi',
    ],
    description:
      'Messages asking for personal information should be verified through official channels.',
  },
];