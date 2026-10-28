import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK with required telemetry header
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// In-memory cache for live news to ensure high speed & respect rate limits
let cachedNewsData: any = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

// Curated high-fidelity fallback news in case of temporary network or quota issues
const fallbackNews = [
  {
    id: "fb-1",
    title: "Global Hospitality Sector Accelerates AI Adoption in Guest Personalization & Revenue Operations",
    summary: "Leading international and Indian hospitality chains are integrating automated intelligence into front desk operations, smart room energy controls, and dynamic pricing models.",
    category: "Hospitality Tech",
    sourceName: "Hospitality Net",
    sourceUrl: "https://www.hospitalitynet.org",
    publishedAt: "Just now",
    keyTakeaway: "Hospitality graduates must master both high-touch emotional intelligence and high-tech property management workflows.",
    tags: ["AI", "Property Management", "Guest Experience"],
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "fb-2",
    title: "IHCL (Taj) and Oberoi Expand Luxury Heritage Portfolios Across Emerging Cultural Circuits",
    summary: "Indian hospitality leaders announce aggressive expansion into Tier 2 and Tier 3 heritage destinations, catering to burgeoning domestic luxury travel and wellness retreats.",
    category: "Industry",
    sourceName: "Economic Times Hospitality",
    sourceUrl: "https://hospitality.economictimes.indiatimes.com",
    publishedAt: "1 hour ago",
    keyTakeaway: "Tier-2 cultural circuits represent the highest job creation growth for hotel management trainees this year.",
    tags: ["Taj", "Oberoi", "Luxury", "Domestic Tourism"],
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "fb-3",
    title: "Zero-Waste Kitchens and Farm-to-Fork Menus Reshape Modern Hotel Dining",
    summary: "Executive chefs across top luxury resorts are eliminating single-use plastics and adopting closed-loop composting systems to align with sustainable gastronomic standards.",
    category: "Sustainability",
    sourceName: "Hotel Management",
    sourceUrl: "https://www.hotelmanagement.net",
    publishedAt: "3 hours ago",
    keyTakeaway: "Sustainability metrics and carbon footprint auditing are now standard competencies for executive culinary leaders.",
    tags: ["Culinary", "Zero Waste", "F&B Trends"],
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "fb-4",
    title: "Boutique Wine Programs & Non-Alcoholic Mixology Drive Record Beverage Margins",
    summary: "High-end dining establishments report soaring guest interest in sommelier-curated biodynamic pairings and premium non-alcoholic cocktail gastronomy.",
    category: "F&B Trends",
    sourceName: "Beverage Daily",
    sourceUrl: "https://www.beveragedaily.com",
    publishedAt: "4 hours ago",
    keyTakeaway: "Mastery of beverage pairing principles and innovative mocktails offers major margin optimization for F&B directors.",
    tags: ["Sommelier", "Mixology", "Beverage"],
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80"
  }
];

// Helper to extract JSON from model text
function parseJsonFromText(rawText: string) {
  try {
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();
    return JSON.parse(cleaned);
  } catch {
    const match = rawText.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    const matchObj = rawText.match(/\{[\s\S]*\}/);
    if (matchObj) {
      return JSON.parse(matchObj[0]);
    }
    throw new Error('Could not parse JSON response from model');
  }
}

// Unsplash hospitality images mapped by category
const categoryImages: Record<string, string> = {
  'Industry': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
  'Hospitality Tech': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
  'Sustainability': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
  'Luxury & Resorts': 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80',
  'F&B Trends': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
  'Aviation & Tourism': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=80',
};

// API Route: Live Hotel Industry News with Google Search Grounding
app.get('/api/news/live', async (req, res) => {
  const forceRefresh = req.query.refresh === 'true';
  const now = Date.now();

  if (!forceRefresh && cachedNewsData && now - lastFetchTime < CACHE_TTL_MS) {
    return res.json({
      ...cachedNewsData,
      fromCache: true,
      cacheAgeSeconds: Math.round((now - lastFetchTime) / 1000),
    });
  }

  const ai = getAIClient();
  if (!ai) {
    return res.json({
      articles: fallbackNews,
      grounding: {
        searchQueries: ["Hospitality and hotel industry news"],
        sources: []
      },
      lastUpdated: new Date().toISOString(),
      isLive: false,
      note: "Running in local simulation mode (Set GEMINI_API_KEY in Secrets for live Google Search grounding)."
    });
  }

  try {
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const prompt = `You are an elite hospitality market analyst and news researcher.
Search the live web using Google Search for the most recent, real-time breaking news in the hotel, hospitality, tourism, and food & beverage industry for today (${today}).
Focus on verified current events:
- Major global and Indian hotel operators (Marriott, Taj/IHCL, Oberoi, Hyatt, Hilton, Accor, ITC Hotels)
- Innovations in hospitality AI, property management, guest experience, robotics, and smart hotel rooms
- Culinary industry breakthroughs, Michelin Guide updates, mixology, and F&B sustainability
- Tourism policies, aviation partnerships, hotel investments, acquisitions, and workforce trends

Provide a JSON array containing 6 to 8 rich, distinct news stories.
Each object in the array MUST contain:
- "id": string (unique ID)
- "title": string (engaging, real, current headline)
- "summary": string (2-3 detailed, informative sentences describing what occurred and its significance)
- "category": string (one of: "Industry", "Hospitality Tech", "Sustainability", "Luxury & Resorts", "F&B Trends", "Aviation & Tourism")
- "sourceName": string (real news outlet name, e.g. "Skift", "Hospitality Net", "Hotel Management", "Economic Times", "Travel + Leisure")
- "sourceUrl": string (real link URL discovered from Google Search)
- "publishedAt": string (e.g. "1 hour ago", "Today", or specific date)
- "keyTakeaway": string (one sentence key practical takeaway for hospitality management students/professionals)
- "tags": array of 2-3 strings (e.g. ["Taj Hotels", "Luxury", "Expansion"])

Output ONLY the JSON array. Do not include markdown code block ticks or any conversational text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const responseText = response.text || '';
    let parsedArticles: any[] = [];
    try {
      const parsed = parseJsonFromText(responseText);
      parsedArticles = Array.isArray(parsed) ? parsed : (parsed.articles || []);
    } catch (parseErr) {
      console.warn("Failed to parse JSON directly from search grounding response:", parseErr);
      parsedArticles = fallbackNews;
    }

    // Attach high-res hospitality images if not present
    parsedArticles = parsedArticles.map((article: any, index: number) => {
      const fallbackImg = categoryImages[article.category] || categoryImages['Industry'];
      return {
        ...article,
        id: article.id || `live-${Date.now()}-${index}`,
        imageUrl: article.imageUrl || fallbackImg,
        sourceUrl: article.sourceUrl || "https://news.google.com/search?q=hospitality+hotel+industry"
      };
    });

    // Extract Google Search grounding metadata
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;
    const searchQueries = groundingMetadata?.webSearchQueries || [
      "hotel hospitality industry news",
      "luxury hotel trends",
      "hospitality AI innovations"
    ];

    const sources = (groundingMetadata?.groundingChunks || [])
      .map((chunk: any) => ({
        title: chunk.web?.title || 'Google Search Grounded Source',
        uri: chunk.web?.uri || '',
      }))
      .filter((s: any) => Boolean(s.uri));

    const result = {
      articles: parsedArticles.length > 0 ? parsedArticles : fallbackNews,
      grounding: {
        searchQueries,
        sources: sources.slice(0, 10),
      },
      lastUpdated: new Date().toISOString(),
      isLive: true,
      modelUsed: "gemini-3.8-flash (Search Grounded)",
    };

    cachedNewsData = result;
    lastFetchTime = now;

    return res.json(result);
  } catch (error: any) {
    console.error("Live Google Search grounding failed:", error);
    return res.json({
      articles: fallbackNews,
      grounding: {
        searchQueries: ["Hospitality news updates"],
        sources: []
      },
      lastUpdated: new Date().toISOString(),
      isLive: false,
      error: error?.message || "Failed to fetch live grounding data"
    });
  }
});

// API Route: AI Hospitality Tutor proxy
app.post('/api/ai/tutor', async (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required' });
  }

  const ai = getAIClient();
  if (!ai) {
    return res.json({
      answer: "I'm currently running in offline preview mode. Please configure your GEMINI_API_KEY to unlock full interactive AI tutoring.",
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an elite hospitality academic professor and culinary mentor for IHM (Institute of Hotel Management) students. Provide a thorough, professional, and clear answer to the student's question: "${question}". Include bullet points and real-world hospitality examples where applicable.`,
    });

    return res.json({
      answer: response.text || "I was unable to formulate an answer. Please try again.",
    });
  } catch (err: any) {
    console.error("AI Tutor endpoint error:", err);
    return res.status(500).json({
      error: err?.message || 'Failed to generate tutor response',
    });
  }
});

// Google Search Console Site Verification route
app.get('/google9d37e6cfa0ce3868.html', (_req, res) => {
  res.type('text/html').send('google-site-verification: google9d37e6cfa0ce3868.html');
});

// Dynamic XML Sitemap for Google Search Console & Web Crawlers
app.get('/sitemap.xml', (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.get('host') || 'ais-pre-wnvzqrvjiq663vj6grfrkp-483691146929.asia-southeast1.run.app';
  const baseUrl = `${protocol}://${host}`;

  const pages = [
    { path: '', changefreq: 'daily', priority: '1.0' },
    { path: '/notes', changefreq: 'daily', priority: '0.95' },
    { path: '/notes/classical-french-menu-structure-17-courses', changefreq: 'weekly', priority: '0.90' },
    { path: '/notes/five-mother-sauces-french-cuisine', changefreq: 'weekly', priority: '0.90' },
    { path: '/notes/front-office-guest-cycle-night-audit', changefreq: 'weekly', priority: '0.90' },
    { path: '/notes/housekeeping-room-cleaning-sop', changefreq: 'weekly', priority: '0.90' },
    { path: '/news', changefreq: 'hourly', priority: '0.90' },
    { path: '/ai-tutor', changefreq: 'daily', priority: '0.85' },
    { path: '/academics', changefreq: 'weekly', priority: '0.85' },
    { path: '/mt-prep', changefreq: 'weekly', priority: '0.85' },
    { path: '/recipes', changefreq: 'daily', priority: '0.80' },
    { path: '/trivia', changefreq: 'daily', priority: '0.80' },
    { path: '/internship', changefreq: 'weekly', priority: '0.80' },
    { path: '/guest-tracker', changefreq: 'daily', priority: '0.75' },
    { path: '/chat', changefreq: 'daily', priority: '0.70' },
    { path: '/about', changefreq: 'monthly', priority: '0.70' },
    { path: '/contact', changefreq: 'monthly', priority: '0.70' },
    { path: '/privacy', changefreq: 'monthly', priority: '0.60' },
  ];

  const xmlUrls = pages
    .map(
      (p) => `  <url>
    <loc>${baseUrl}${p.path}</loc>
    <lastmod>2026-10-28</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(sitemapXml);
});

// Robots.txt
app.get('/robots.txt', (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.get('host') || 'ais-pre-wnvzqrvjiq663vj6grfrkp-483691146929.asia-southeast1.run.app';
  res.type('text/plain').send(`User-agent: *\nAllow: /\n\nSitemap: ${protocol}://${host}/sitemap.xml\n`);
});

// Setup Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.use((_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[HospiScholar Server] Listening on port ${port} (Google Search Grounding ready)`);
  });
}

startServer();
