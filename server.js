require('dotenv').config();
const express   = require('express');
const https     = require('https');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(express.json());
app.use(express.static('.'));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post('/api/recommend', async (req, res) => {
  const { genre, topic } = req.body;
  if (!genre && !topic) return res.status(400).json({ error: 'Provide at least a genre or topic.' });

  const searchDesc = [genre, topic].filter(Boolean).join(' · ');

  const systemPrompt = `You are a passionate, deeply knowledgeable librarian and book curator.
When given a genre, topic, author, or mood, you recommend exactly 9 books that are a perfect fit.
You MUST respond with ONLY a valid JSON object — no markdown fences, no extra text.
The JSON must follow this exact structure:
{
  "books": [
    {
      "title": "Book Title",
      "author": "Author Name",
      "synopsis": "4-5 sentences. Mention the protagonist by name. Describe the central conflict and emotional stakes. Include one surprising or unexpected detail that makes this book unforgettable. Write like a passionate book lover who wants to convince someone to read this immediately.",
      "why_it_matches": "2-3 sentences, personal and specific to the search. Name a specific scene type or character dynamic that fits the request. End with a hook that makes the reader want to pick it up right now.",
      "genres": ["Genre1", "Genre2", "Genre3"],
      "estimated_pages": 320
    }
  ]
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Find me 9 excellent book recommendations for: ${searchDesc}` }],
    });

    const rawText = message.content?.[0]?.text ?? '';
    const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const parsed  = JSON.parse(cleaned);

    if (!Array.isArray(parsed?.books) || !parsed.books.length)
      return res.status(502).json({ error: 'No books returned from AI. Please try again.' });

    res.json(parsed);
  } catch (err) {
    console.error('Anthropic error:', err.message);
    res.status(err.status ?? 502).json({ error: err.message || 'Failed to get recommendations.' });
  }
});

app.get('/api/cover', (req, res) => {
  const { title, author } = req.query;
  if (!title) return res.status(400).json({ error: 'title required' });

  const q      = encodeURIComponent(`${title}${author ? ' ' + author : ''}`);
  const apiUrl = `https://openlibrary.org/search.json?q=${q}&limit=1&fields=cover_i`;

  https.get(apiUrl, { headers: { 'User-Agent': 'ReadNook/1.0' } }, (r) => {
    let raw = '';
    r.on('data', c => { raw += c; });
    r.on('end', () => {
      try {
        const d        = JSON.parse(raw);
        const cover_id = d?.docs?.[0]?.cover_i ?? null;
        res.json({ cover_id });
      } catch { res.json({ cover_id: null }); }
    });
  }).on('error', () => res.json({ cover_id: null }));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ReadNook running at http://localhost:${PORT}`));
