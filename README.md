# Phishing Analyst

A frontend-only cybersecurity awareness application developed as a Web Technologies course project.

The application helps users analyze suspicious URLs and suspicious messages/emails directly in their browser. It performs rule-based risk analysis without visiting URLs, contacting external services, or sending user data to any server.

The goal of the project is not to provide guaranteed phishing detection, but to increase cybersecurity awareness and help users recognize common phishing indicators.

## Project Objectives

- Build a practical solution rather than a simple website
- Improve user awareness about phishing attacks
- Demonstrate HTML, CSS and JavaScript skills
- Apply clean code and modular architecture principles
- Create a responsive and user-friendly interface
- Perform all analysis on the client side

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Vite
- LocalStorage
- GitHub

## Key Features

### URL Analysis

The application analyzes suspicious URLs using rule-based checks such as:

- Missing HTTPS protocol
- Excessive URL length
- IP-based domains
- URL shorteners
- Suspicious keywords
- Promotional keywords
- Excessive subdomains
- Special characters and unusual patterns
- Brand impersonation indicators

The application never visits the submitted URL.

### Message / Email Analysis

Users can paste suspicious messages or email content. The system evaluates:

- Urgency and pressure tactics
- Account-related threats
- Requests for sensitive information
- Verification requests
- Suspicious links
- Generic greetings
- Authority impersonation attempts
- Excessive capitalization
- Unusual formatting patterns
- Social engineering indicators

### Risk Scoring System

Every analysis produces a risk score between 0 and 100.

| Score Range | Risk Level |
| --- | --- |
| 0 - 30 | Low Risk |
| 31 - 65 | Medium Risk |
| 66 - 100 | High Risk |

The application also explains why a specific score was generated.

### Analysis History

Using LocalStorage, users can:

- View previous analyses
- Filter results by risk level
- Review risk summaries
- Clear saved history

All data remains inside the user's browser.

### Learning Center

The Learning Center contains educational content about:

- What phishing is
- URL inspection techniques
- Social engineering attacks
- Safe browsing habits
- Common phishing tactics

### Scenario Quiz

Users can practice identifying phishing attempts through realistic scenarios and receive explanations after answering.

### Theme System

The application supports:

- Dark theme
- Light theme

Theme preferences are stored locally.

## Project Structure

```
phishing-analyst/
│
├── public/
├── src/
│   ├── analyzer/
│   ├── data/
│   ├── storage/
│   ├── styles/
│   ├── ui/
│   └── utils/
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Installation

Clone the repository:

```bash
git clone https://github.com/EnesBayraker/Phishing-Analyst
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## User Experience Considerations

The application was designed with the following UX principles:

- Clear primary actions
- Immediate feedback
- Educational explanations
- Accessible navigation
- Responsive design
- Mobile compatibility
- Awareness-focused results

Every user interaction was designed to have a clear purpose.

## Security Disclaimer

Phishing Analyst is an educational awareness project. The application:

- Does not guarantee that a URL or message is safe
- Does not guarantee that a URL or message is malicious
- Does not visit submitted URLs
- Does not use external security APIs
- Does not send user data to any server

Users should always verify suspicious content through official sources.

## Future Improvements

Potential future enhancements include:

- More phishing detection rules
- Improved scoring algorithms
- Additional quiz scenarios
- Exportable analysis reports
- Multi-language support
- Advanced educational content
