export const QUIZ_QUESTIONS = [
  {
    id: 'url-amazon-freegift',
    type: 'url',
    title: 'Suspicious shopping link',
    scenario:
      'You receive a message saying: “Amazon selected you for a free gift. Claim it here: amazon.freegift.com”.',
    question: 'What is the safest interpretation of this link?',
    options: [
      {
        id: 'safe-because-amazon',
        text: 'It is safe because it contains the word Amazon.',
        isCorrect: false,
      },
      {
        id: 'risky-brand-subdomain',
        text: 'It is suspicious because Amazon appears before a different main domain.',
        isCorrect: true,
      },
      {
        id: 'safe-because-short',
        text: 'It is safe because the URL is short and easy to read.',
        isCorrect: false,
      },
    ],
    explanation:
      'Trusted brand names can be placed in subdomains to mislead users. In this example, the main domain is freegift.com, not amazon.com.',
  },
  {
    id: 'message-urgent-password',
    type: 'message',
    title: 'Urgent account warning',
    scenario:
      'A message says: “URGENT!!! Your account will be closed today. Verify your password immediately.”',
    question: 'Which warning sign is the strongest here?',
    options: [
      {
        id: 'friendly-tone',
        text: 'The message is friendly and helpful.',
        isCorrect: false,
      },
      {
        id: 'password-and-urgency',
        text: 'The message creates urgency and asks for a password.',
        isCorrect: true,
      },
      {
        id: 'short-message',
        text: 'The message is short, so it is probably safe.',
        isCorrect: false,
      },
    ],
    explanation:
      'Urgency combined with a password request is a strong phishing warning sign. Legitimate services should not ask for your password through a message.',
  },
  {
    id: 'https-myth',
    type: 'concept',
    title: 'HTTPS misunderstanding',
    scenario:
      'You see a login page using HTTPS with a lock icon in the browser.',
    question: 'What does HTTPS actually prove?',
    options: [
      {
        id: 'site-is-always-safe',
        text: 'The website is definitely safe.',
        isCorrect: false,
      },
      {
        id: 'connection-encrypted',
        text: 'The connection is encrypted, but the site can still be malicious.',
        isCorrect: true,
      },
      {
        id: 'official-company',
        text: 'The site is officially owned by the company it claims to be.',
        isCorrect: false,
      },
    ],
    explanation:
      'HTTPS protects the connection between your browser and the website. It does not guarantee that the website itself is trustworthy.',
  },
  {
    id: 'shortened-link',
    type: 'url',
    title: 'Shortened link',
    scenario:
      'You receive a message from an unknown sender: “Check your reward here: bit.ly/free-bonus”.',
    question: 'Why should this link be treated carefully?',
    options: [
      {
        id: 'shortener-hides-destination',
        text: 'A shortened link can hide the final destination.',
        isCorrect: true,
      },
      {
        id: 'bitly-always-dangerous',
        text: 'All shortened links are automatically phishing.',
        isCorrect: false,
      },
      {
        id: 'reward-means-safe',
        text: 'Reward messages are always safe because they help users.',
        isCorrect: false,
      },
    ],
    explanation:
      'Shortened links are not always malicious, but they hide the destination. Unknown sender + reward wording + shortened link should be handled carefully.',
  },
  {
    id: 'verification-code',
    type: 'message',
    title: 'Verification code request',
    scenario:
      'Someone claiming to be support asks you to send the verification code that arrived on your phone.',
    question: 'What should you do?',
    options: [
      {
        id: 'send-code-fast',
        text: 'Send the code quickly so your account is not blocked.',
        isCorrect: false,
      },
      {
        id: 'never-share-code',
        text: 'Do not share the code. Verification codes are sensitive.',
        isCorrect: true,
      },
      {
        id: 'share-if-polite',
        text: 'Share it only if the sender sounds polite.',
        isCorrect: false,
      },
    ],
    explanation:
      'Verification codes can give someone access to your account. You should never share them through messages or calls.',
  },
];