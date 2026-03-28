# 📚 ReadNook

**AI-powered book discovery. Describe a mood, pick a genre, get 9 reads curated just for you.**

ReadNook uses Claude AI to match readers with books based on mood, genre, and personal taste. No algorithms, no bestseller lists — just thoughtful recommendations tailored to you.

---

## Built With

- **[Claude AI / Anthropic](https://anthropic.com)** — book recommendations powered by `claude-haiku-4-5`
- **Node.js + Express** — lightweight backend server
- **[Open Library API](https://openlibrary.org/developers/api)** — free book cover images
- **Vanilla HTML / CSS / JS** — no frontend framework, no build step

---

## How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/pretichowdhury/readnook.git
cd readnook

# 2. Install dependencies
npm install

# 3. Add your Anthropic API key
echo "ANTHROPIC_API_KEY=your_key_here" > .env

# 4. Start the server
npm start

# 5. Open in browser
open http://localhost:3000
```

---

## Features

- 🔍 Search by genre, mood, author, or theme
- ✨ "Feeling Lucky" — randomly picks a genre + mood and searches
- 📚 9 AI-curated recommendations per search
- 🖼️ Book covers from Open Library
- 📋 Copy your reading list to clipboard
- 🗓️ Monthly staff picks that rotate automatically
- 🌗 Dark mode design

---

Built by [Preti Chowdhury](https://pretichowdhury.netlify.app)
