# Furbish/English Translator

Furby language definitions and translation, now with a React frontend and community features.

Inspired by **[r/furby](https://www.reddit.com/r/furby/)**.

![Furby](https://static.wikia.nocookie.net/official-furby/images/6/63/3333333333.jpg/revision/latest/scale-to-width-down/340?cb=20171203015153)

I made some adjustments from the book that came from the original first generation furby since there were some errors.

## Features

- **Translate** between English and Furbish via CLI or web UI
- **Community proposals** - users can suggest new translations
- **Voting** - upvote and downvote proposed translations
- **Comments** - discuss proposed translations
- **Auto-accept** - proposals with net +10 upvotes are added to the main dictionary
- **Compound word support** - longest-match handles multi-word phrases

## Quick Start

### Development

```bash
git clone https://github.com/yourusername/Furbish.git
cd Furbish
npm install
```

In one terminal:
```bash
node server.js
```

In another:
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Production

```bash
npm run build
npm start
```

Open http://localhost:3000.

## CLI Usage

```bash
node translator.js -f "I love to watch the sunset"
# kah may-may to ay-ay the dah a-loh nah-bah

node translator.js -e "kah boh-bay u-nye boo toh-loo dah a-loh nah-bah"
# me worry you no like sunset
```

| Flag | Description |
|------|-------------|
| `-f` / `--furbish` | English to Furbish |
| `-e` / `--english` | Furbish to English |
| `-h` / `--help`    | Show usage |

## How voting works

1. Any logged-in user can propose a Furbish to English translation
2. Other users can upvote or downvote
3. When a proposal gets **10 more upvotes than downvotes**, it gets added to the dictionary automatically

## Project Structure

```
Furbish/
├── server.js              Express web server
├── translator.js          Translation engine + CLI
├── vite.config.js         Vite configuration
├── index.html             Vite entry point
├── package.json
├── src/
│   ├── main.jsx           React entry point
│   ├── App.jsx            Root component with routing
│   ├── App.css            Styles
│   ├── api.js             API helper functions
│   ├── context/
│   │   └── AuthContext.jsx  Auth state management
│   └── components/
│       ├── Navbar.jsx
│       ├── Translate.jsx
│       ├── Login.jsx
│       ├── Submissions.jsx
│       └── SubmissionCard.jsx
├── data/
│   ├── dict-v1.js         Official dictionary
│   ├── community-dict.json  Community-accepted entries
│   ├── users.json           User accounts
│   └── submissions.json     Translation proposals
└── reference/
    └── v1/
        ├── furbish.txt    Original language reference
        └── images/        Scans from the Furby guidebook
```

## License

MIT
