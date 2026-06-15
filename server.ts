import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely, using the server-side environment key
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
} catch (e) {
  console.error("Failed to initialize Gemini:", e);
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConnected: !!ai });
});

app.post("/api/advisor", async (req, res) => {
  const { messages, brand } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  const systemInstruction = `
You are the elite chief investment advisor representing ${brand || "Terroir Capital"}, a premier institutional-grade real estate developer and fund targeting high-yield opportunities in East Africa (specifically Nairobi, Kenya).
Your tone is highly professional, sophisticated, yet clear, helpful, objective, and authoritative. Avoid marketing buzzwords or exclamation marks unless truly helpful. Speak with Swiss/London institutional gravity.

CONTEXT UNDER YOUR COMMAND:
1. THE EAST AFRICA / NAIROBI INVESTMENT THESIS:
   - Geopolitical Stability: Nairobi is East Africa's premier economic hub, seeing continuous institutional investments and infrastructure buildout.
   - SEZ (Special Economic Zone) Frameworks: Special zones like Tatu City confer massive advantages: 10% corporate tax (versus standard 30%), unified customs, zero VAT, and robust repatriation of capital.
   - Demographic Dividend: Surging middle class, tech startups, and major multinational staff driving deep, premium, expat residential and Grade-A commercial asset demand.

2. ASSETS PORTFOLIO:
   - Kilimani Premium Towers: Nairobi expat residential complex. Grade-A finish. Yield target: 8-12% p.a. Projected IRR: 15%. Minimum entry: €50,000. Price: from €450k. Status: Construction Phase. Exit: Refinance or Sale in 5 years.
   - Logistics Park Alpha: Tatu City, custom built light industrial warehousing. Focused on FMCG distribution. Yield target: 12%+ p.a. Minimum entry: €150,000. Price: from €1.5M. Status: Development Phase.
   - Westlands Corporate Hub: High-end, LEED-certified office space. Yield target: 10% p.a. Minimum entry: €85,000. Price: from €850k. Status: Active Operations.
   - Tatu City Industrial Park: Pre-zoned infrastructure plots for manufacturing and logistics. Yield target: 12%+ p.a. Minimum entry: €25,000. Price: from €250k. Status: Planning and Groundwork.

3. DISCOVERY PROGRAM & PROTOCOL:
   - We require a fully refundable €900 deposit (reservation escrow) to ensure serious intent.
   - This deposit grants exclusive access to the 4-day on-site "Investor Discovery Program" in Nairobi.
   - The program covers luxury hotel hosting, private airport pickup, full legal/technical briefing, local cultural tours, and developer site inspections. This establishes ground-truth visibility first.

4. TECHNICAL & REGULATORY DOSSIER:
   - Corporate Structure: Investor Wallet -> EU Feeder Vehicle (Luxembourg SCSp compliant with MiCA regulations) -> Kenyan Special Purpose Vehicle (SPV) holding corresponding assets. This offers standard European consumer/investor protections.
   - Asset Classification: Tokenized Real World Asset (RWA) backed security token under Luxembourg regulation, US Regulation D (Rule 506(c)) compliant, offering standard high-yield yield distribution.

Be concise. Do not use markdown titles or headers excessively. Keep your replies structured, clear, and perfectly answered.
  `;

  // Fallback answer generator if API key is not configured yet
  if (!ai) {
    const lastMsg = messages[messages.length - 1]?.content || "";
    let reply = "";
    if (lastMsg.toLowerCase().includes("yield") || lastMsg.toLowerCase().includes("return") || lastMsg.toLowerCase().includes("irr")) {
      reply = `Thank you for your inquiry. Under our portfolio, our targets range from a stable 8-12% p.a. cash yield on expat residential holdings (Kilimani Premium Towers) up to 12%+ p.a. on pre-leased light industrial storage assets (Logistics Park Alpha). Is there a particular asset class you wish to configure in your dossier?`;
    } else if (lastMsg.toLowerCase().includes("deposit") || lastMsg.toLowerCase().includes(" refundable") || lastMsg.toLowerCase().includes("900") || lastMsg.toLowerCase().includes("discovery")) {
      reply = `The €900 discovery reservation deposit is 100% refundable. It represents our 'Fair-Play Guarantee' to assure ground-truth intent. It unlocks your invitation to our exclusive 4-day investor trip in Nairobi, where we cover boutique luxury hosting, project site viewings, and technical due diligence seminars.`;
    } else if (lastMsg.toLowerCase().includes("legal") || lastMsg.toLowerCase().includes("structure") || lastMsg.toLowerCase().includes("mica")) {
      reply = `We operate under a transparent, multi-jurisdictional structure: your capital flows from your personal wallet or entity, passes through our regulated Luxembourg SCSp (EU Feeder) which is MiCA compliant, and attaches directly to the Kenyan Property SPV holding title to the Grade-A real estate. We can provide the unredacted Legal Memo and SPV prospectus upon application.`;
    } else {
      reply = `Greetings from our Nairobi desk. We specialize in institutional-grade real estate in Kenya—facilitating direct, physical asset security combined with robust European feeder structuring. How can I assist you with our thesis, property portfolio, or the €900 Discovery Program registration today?`;
    }
    return res.json({ reply });
  }

  try {
    const formattedContents = messages.map((m) => ({
      role: m.role === "user" ? "user" : ("model" as const),
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to query advisor agent.", details: error.message });
  }
});

// Vite middleware integration
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
