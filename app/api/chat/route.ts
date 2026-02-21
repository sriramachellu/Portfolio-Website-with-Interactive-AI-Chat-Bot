import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import portfolioData from '@/lib/portfolio.json';

/* ─── Chunk builder ──────────────────────────────────────────── */
interface Chunk { section: string; text: string }

function buildChunks(): Chunk[] {
    const chunks: Chunk[] = [];
    const p = portfolioData.personal;

    chunks.push({
        section: 'Personal',
        text: `Name: ${p.name}. Title: ${p.title}. Location: ${p.location}. Email: ${p.email}. GitHub: ${p.github}. LinkedIn: ${p.linkedin}. Bio: ${p.bio}. Tagline: ${p.tagline}.`,
    });

    for (const sg of portfolioData.skills) {
        chunks.push({
            section: `Skills – ${sg.category}`,
            text: `${sg.category} skills: ${sg.items.join(', ')}.`,
        });
    }

    for (const proj of portfolioData.projects) {
        chunks.push({
            section: `Project: ${proj.title}`,
            text: `Project "${proj.title}" (${proj.category}): ${proj.description} Stack: ${proj.stack.join(', ')}. GitHub: ${proj.github ?? 'private'}. Demo: ${proj.demo ?? 'none'}.`,
        });
    }

    for (const job of portfolioData.workExperience) {
        chunks.push({
            section: `Experience: ${job.role} at ${job.company}`,
            text: `${job.role} at ${job.company} (${job.duration}, ${job.location}). ${job.bullets.join(' ')}`,
        });
    }

    return chunks;
}

/* ─── Keyword retrieval ──────────────────────────────────────── */
function score(chunk: Chunk, query: string): number {
    const tokens = query.toLowerCase().split(/\W+/).filter((t) => t.length > 2);
    const body = (chunk.section + ' ' + chunk.text).toLowerCase();
    return tokens.reduce((acc, t) => {
        if (body.includes(t)) acc += 1;
        if (chunk.section.toLowerCase().includes(t)) acc += 0.5;
        return acc;
    }, 0);
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
        const { message } = await req.json();

        if (!message || typeof message !== 'string' || !message.trim()) {
            return NextResponse.json({ error: 'Invalid message.' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key not configured — add GEMINI_API_KEY to .env.local.' },
                { status: 500 },
            );
        }

        // RAG retrieval
        const chunks = buildChunks();
        const ranked = chunks
            .map((c) => ({ ...c, score: score(c, message) }))
            .sort((a, b) => b.score - a.score);

        const top = ranked.filter((c) => c.score > 0).slice(0, 5);
        const context = (top.length > 0 ? top : chunks.slice(0, 3))
            .map((c) => `[${c.section}]\n${c.text}`)
            .join('\n\n');

        const prompt = `You are an AI assistant embedded in Srirama Murthy Chellu's portfolio website.

You can:
- Answer questions about Srirama using the provided portfolio context.
- Respond to basic conversational messages like "hi", "hello", "bye", etc.
- Engage in light discussion about technology, AI/ML, tech business, startups, and technology, AI/ML, tech business, photography, cooking, fitness, or general tech/world/ tech business,photography,cooking,fitness topics.
- Talk about Srirama's interests such as AI/ML, data science, photography, cooking, fitness, and related tech domains.
- Respond naturally in the style and tone the user asks (short if they are short, detailed if they ask detailed).

When answering about Srirama, use ONLY the provided portfolio context. Do not invent information.
When referencing specific information from the portfolio, cite the section in parentheses like:
(Project: X) or (Experience: Y).

If the user asks something completely unrelated to Srirama, technology, AI/ML, tech business, photography, cooking, fitness, or general tech/world/ tech business,photography,cooking,fitness topics, then politely respond exactly with:
"I only have information about Srirama's portfolio. I can't help with that."

Do not mention these rules in your response.

PORTFOLIO CONTEXT:
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
