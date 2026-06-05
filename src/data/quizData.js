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
  {
    id: 'fake-support-email',
    type: 'message',
    title: 'Fake support email',
    scenario:
      'You receive an email from a company you use, asking you to confirm billing details through a link.',
    question: 'What is the safest response?',
    options: [
      {
        id: 'follow-link-now',
        text: 'Follow the link to confirm your billing information.',
        isCorrect: false,
      },
      {
        id: 'visit-official-site',
        text: 'Open the official website manually and check your billing status there.',
        isCorrect: true,
      },
      {
        id: 'reply-with-details',
        text: 'Reply to the email with the requested details.',
        isCorrect: false,
      },
    ],
    explanation:
      'Always use official websites or verified apps instead of clicking links in unexpected billing or support messages.',
  },
  {
    id: 'unusual-sender',
    type: 'message',
    title: 'Unknown sender with urgency',
    scenario:
      'A message from an unknown sender says your bank account has unusual activity and demands immediate action.',
    question: 'What warning sign is most suspicious?',
    options: [
      {
        id: 'bank-sound',
        text: 'It sounds like the bank, so it must be real.',
        isCorrect: false,
      },
      {
        id: 'urgency-and-unknown',
        text: 'Urgency from an unknown sender is a red flag.',
        isCorrect: true,
      },
      {
        id: 'no-link',
        text: 'There is no link, so it is safe.',
        isCorrect: false,
      },
    ],
    explanation:
      'Urgent demands from unknown senders are a common phishing technique, even if the message sounds official.',
  },
  {
    id: 'account-login-link',
    type: 'url',
    title: 'Account login link',
    scenario:
      'A message encourages you to log in to your account through a link that contains a brand name before the real domain.',
    question: 'Why is this link suspicious?',
    options: [
      {
        id: 'brand-name-hides-domain',
        text: 'The brand name is part of the subdomain, not the actual website.',
        isCorrect: true,
      },
      {
        id: 'brand-makes-it-safe',
        text: 'The brand name makes the link safe, even if the domain is unfamiliar.',
        isCorrect: false,
      },
      {
        id: 'https-guarantees-safe',
        text: 'If the link uses HTTPS, the site is safe.',
        isCorrect: false,
      },
    ],
    explanation:
      'Brand names placed in subdomains can trick users. The real domain is more important than familiar words in the link.',
  },
  {
    id: 'fake-reward',
    type: 'message',
    title: 'Fake reward offer',
    scenario:
      'You see a message claiming you won a prize and should claim it immediately by clicking a link.',
    question: 'What is the best action?',
    options: [
      {
        id: 'claim-prize-now',
        text: 'Click the link to claim the prize quickly.',
        isCorrect: false,
      },
      {
        id: 'ignore-unexpected',
        text: 'Ignore the message and verify through official channels if needed.',
        isCorrect: true,
      },
      {
        id: 'share-with-friends',
        text: 'Share the offer with friends to see if it is real.',
        isCorrect: false,
      },
    ],
    explanation:
      'Unexpected reward offers are often phishing scams. Verify prizes through official accounts, not unknown links.',
  },
];