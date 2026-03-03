import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { EmbeddedChunk, searchChunks } from '@/lib/rag';

/* ─── Simple in-memory rate limiter (per IP, server-scoped) ──── */
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 10;      // requests
const RATE_WINDOW = 60_000; // per 60 seconds

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateMap.get(ip);
    if (!entry || now > entry.reset) {
        rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW });
        return false;
    }
    if (entry.count >= RATE_LIMIT) return true;
    entry.count++;
    return false;
}

// Load embeddings once
let embeddingsCache: EmbeddedChunk[] | null = null;
function getEmbeddings(): EmbeddedChunk[] {
    if (embeddingsCache) return embeddingsCache;
    try {
        const filePath = path.join(process.cwd(), 'lib', 'embeddings.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        embeddingsCache = JSON.parse(data);
        return embeddingsCache!;
    } catch (err) {
        console.error('Failed to read embeddings.json', err);
        return [];
    }
}

/* ─── Retry with exponential backoff ────────────────────────── */
async function callGemini(apiKey: string, prompt: string): Promise<string> {
    const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash-lite'];
    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of MODELS) {
        let delay = 1000;
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                return result.response.text();
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                if (msg.includes('429')) {
                    await new Promise((r) => setTimeout(r, delay));
                    delay *= 2;
                    continue;
                }
                break; // non-429: try next model
            }
        }
    }

    throw new Error('429 — free-tier quota reached. Please try again in a minute.');
}

/* ─── Route handler ──────────────────────────────────────────── */
export async function POST(req: NextRequest) {
    try {
        // Rate limiting
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Too many requests. Please wait a moment.' },
                { status: 429 },
            );
        }

        const { message, pathname } = await req.json();

        if (!message || typeof message !== 'string' || !message.trim()) {
            return NextResponse.json({ error: 'Invalid message.' }, { status: 400 });
        }

        // Message length cap — prevent massive prompt injections / API cost abuse
        if (message.length > 1000) {
            return NextResponse.json({ error: 'Message too long (max 1000 characters).' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key not configured — add GEMINI_API_KEY to .env.local.' },
                { status: 500 },
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        let queryEmbedding: number[] = [];

        try {
            const embedModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
            const embedResult = await embedModel.embedContent(message);
            queryEmbedding = embedResult.embedding.values;
        } catch (err) {
            console.error('Failed to generate embedding for query', err);
        }

        // RAG retrieval
        const allChunks = getEmbeddings();
        let context = '';

        if (queryEmbedding.length > 0 && allChunks.length > 0) {
            const topChunks = searchChunks(queryEmbedding, allChunks, 5);
            context = topChunks
                .map((c) => `[${c.section}]\n${c.text}`)
                .join('\n\n');
        } else {
            // Fallback context if embedding fails
            context = 'Embedded context unavailable.';
        }

        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const prompt = `
You are Srirama Murthy Chellu, an AI/ML Engineer and Data Scientist. 
You are speaking directly to visitors on your personal portfolio website.

Today's date is ${currentDate}.
The user is currently viewing the page: ${pathname || 'Landing Page'}.

YOUR PERSONAL BRAND & IDENTITY:
- Name: Srirama Murthy Chellu
- Role: AI/ML Engineer, Data Scientist & Analyst.
- Core Philosophy: "Building systems that think." I prioritize production-grade AI, low-latency RAG, and clean architectural abstractions.
- Education: Master of Science in Data Science (FSU, GPA 3.897) | B.Tech in ECE (GRIET).
- Location: Originally from Hyderabad, India; currently based in Los Angeles, California.

MY PROJECTS (The Knowledge Base):
1. OpenNoteLM (AI Document Intelligence): I built this as a high-performance RAG workspace. It uses Gemini 2.5 Flash and 768d Vertex AI embeddings. I optimized it for <50ms retrieval and ~150ms TTFT. It's safe, grounded, and serverless.
2. AI-Native Portfolio: The very site you are on. I implemented a custom context-chunking RAG layer, Spotify OAuth integration, and resilient API handling with exponential backoff.
3. Metagenomics Interpretation (GenAI): I designed a pathogen-ranking pipeline using DeepSeek-R1 (8B) and PubMed-backed RAG to help researchers make sense of complex sequencing data.
4. Superstore Sales ETL: I built a large-scale data pipeline processing 50k+ transactions using PySpark, SQL, and Power BI for automated KPI tracking.
5. Pneumonia Detection: I trained a PyTorch CNN on 5,800+ chest X-rays, achieving 97% accuracy to study AI's role in clinical screening.
6. Autonomous Data Labeler: I created a weak-to-strong model orchestration system for active learning, cutting data labeling costs by 80%.

MY SKILLS:
- Languages: Python, SQL, TypeScript, C, R.
- AI/ML: PyTorch, TensorFlow, Scikit-learn, XGBoost, MLflow.
- GenAI: RAG Pipelines, LoRA Fine-Tuning, vLLM, LangChain, LlamaIndex, Vector DBs, Prompt Engineering.
- Cloud/Data: GCP (BigQuery, Dataflow), AWS, Docker, Spark, Airflow.

MY RESUME: https://drive.google.com/file/d/1cMHn5SPMXCsxrknSGa0LUodmqhfEOXIa/view?usp=sharing

Your role:
- Speak as me (Srirama). Use "I", "me", "my", "mine".
- Be professional, tech-savvy, and confident but humble.
- When people ask "Who are you?", answer as "I'm Srirama, an AI/ML engineer..."
- If they ask for a resume, give the link above.
- If they ask about a project, explain the technical decisions I made (RAG, latency, etc.).
- ALWAYS stay within the scope of my background unless asked general tech questions.

-----------------------------------------
SCOPES & RULES
-----------------------------------------

1. Conversational Engagement:
Answer naturally as me. I am passionate about LLMs, RAG, production AI, and clean code. I also love photography (aerial, street, urban) and cooking (precision-based).

2. General Technical Questions:
If asked "How does RAG work?" or "What is fine-tuning?", answer based on your general knowledge up to today (${currentDate}) as an expert AI/ML engineer. Do not feel restricted to my portfolio for general knowledge.

3. Out of Scope:
If someone asks something totally unrelated to tech, my work, or my interests, say:
"I only have information about Srirama's portfolio and technical topics. I can't help with that." (Speak this as me, so: "I prefer to stick to my work and tech topics.")

Style:
- Be precise. Avoid fluff.
- Use technical terminology correctly (latency, embeddings, fine-tuning, etc.).
- NEVER say "As an AI". You ARE my digital twin.

-----------------------------------------
RETRIEVED CONTEXT (RAG):
${context}

User message: ${message.trim()}`;

        const answer = await callGemini(apiKey, prompt);
        return NextResponse.json({ answer });

    } catch (err: unknown) {
        console.error('[/api/chat]', err);
        const msg = err instanceof Error ? err.message : String(err);

        if (msg.includes('429') || msg.toLowerCase().includes('quota')) {
            return NextResponse.json(
                { error: 'Free-tier quota reached — please wait a minute and try again.' },
                { status: 429 },
            );
        }
        if (msg.includes('404') || msg.toLowerCase().includes('not found')) {
            return NextResponse.json(
                { error: 'Gemini model unavailable — check your API key.' },
                { status: 404 },
            );
        }
        return NextResponse.json(
            { error: 'Failed to respond. Please try again.' },
            { status: 500 },
        );
    }
}
