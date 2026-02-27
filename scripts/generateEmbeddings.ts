require('dotenv').config({ path: '.env.local' });
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Chunk, EmbeddedChunk } from '../lib/rag';

// We inline the portfolio reading logic here to avoid module resolution issues with Next.js aliases inside this simple Node script.
// Assuming this is run from the project root.
const portfolioPath = path.join(process.cwd(), 'lib', 'portfolio.json');
const portfolioData = JSON.parse(fs.readFileSync(portfolioPath, 'utf-8'));

function buildChunks(): Chunk[] {
    const chunks: Chunk[] = [];
    const p = portfolioData.personal;

    const add = (section: string, text: string) => {
        chunks.push({
            id: `chunk-${chunks.length}`,
            section,
            text,
        });
    };

    add(
        'Personal',
        `Name: ${p.name}. Title: ${p.title}. Location: ${p.location}. Email: ${p.email}. GitHub: ${p.github}. LinkedIn: ${p.linkedin}. Bio: ${p.bio}. Tagline: ${p.tagline}.`
    );

    for (const sg of portfolioData.skills) {
        add(
            `Skills – ${sg.category}`,
            `${sg.category} skills: ${sg.items.join(', ')}.`
        );
    }

    for (const proj of portfolioData.projects) {
        add(
            `Project: ${proj.title}`,
            `Project "${proj.title}" (${proj.category}): ${proj.description} Stack: ${proj.stack.join(', ')}. GitHub: ${proj.github ?? 'private'}. Demo: ${proj.demo ?? 'none'}.`
        );
    }

    for (const job of portfolioData.workExperience) {
        add(
            `Experience: ${job.role} at ${job.company}`,
            `${job.role} at ${job.company} (${job.duration}, ${job.location}). ${job.bullets.join(' ')}`
        );
    }

    if (portfolioData.photography && portfolioData.photography.length > 0) {
        const categories = Array.from(new Set(portfolioData.photography.map((p: any) => p.category))).join(', ');
        const locations = Array.from(new Set(portfolioData.photography.map((p: any) => p.location))).join(', ');
        add(
            'Photography Overview',
            `Srirama is passionate about photography. His photography skills cover various categories/types of photos including: ${categories}. He has shot photos in locations such as: ${locations}.`
        );
        for (const photo of portfolioData.photography) {
            add(
                `Photography: ${photo.title}`,
                `Photograph "${photo.title}" (Type/Category: ${photo.category}): Shot in ${photo.location} (${photo.year}).`
            );
        }
    }

    if (portfolioData.cooking && portfolioData.cooking.length > 0) {
        const tags = Array.from(new Set(portfolioData.cooking.flatMap((r: any) => r.tags))).join(', ');
        add(
            'Cooking Overview',
            `Srirama is passionate about cooking. He makes dishes with various styles/tags including: ${tags}.`
        );
        for (const recipe of portfolioData.cooking) {
            add(
                `Cooking: ${recipe.title}`,
                `Recipe "${recipe.title}": ${recipe.description} Tags: ${recipe.tags.join(', ')}.`
            );
        }
    }

    add(
        'Website Overview',
        `This portfolio website contains the following pages: Landing (Home), Skills, Projects, Work, Photography, Cooking, and a Mini Game.`
    );

    return chunks;
}

async function generateEmbeddings() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('Error: GEMINI_API_KEY environment variable not set.');
        process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Google recommended model for text embedding
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

    console.log('Building chunks...');
    const chunks = buildChunks();
    console.log(`Created ${chunks.length} chunks. Generating embeddings...`);

    const embeddedChunks: EmbeddedChunk[] = [];

    // Process in batches or one by one to avoid rate limits
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        console.log(`Processing chunk ${i + 1}/${chunks.length}: ${chunk.section}`);

        try {
            // We use embedContent
            const result = await model.embedContent(chunk.text);
            const embedding = result.embedding;

            embeddedChunks.push({
                ...chunk,
                embedding: embedding.values, // array of numbers
            });

            // Small delay to prevent 429 errors on free tier
            await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
            console.error(`Failed to embed chunk ${chunk.id}`, error);
            // Wait slightly longer and retry once
            await new Promise((resolve) => setTimeout(resolve, 2000));
            try {
                const result = await model.embedContent(chunk.text);
                const embedding = result.embedding;

                embeddedChunks.push({
                    ...chunk,
                    embedding: embedding.values,
                });
            } catch (retryError) {
                console.error(`Retry failed for chunk ${chunk.id}`, retryError);
            }
        }
    }

    const outPath = path.join(process.cwd(), 'lib', 'embeddings.json');
    fs.writeFileSync(outPath, JSON.stringify(embeddedChunks, null, 2), 'utf-8');
    console.log(`\nSuccessfully generated embeddings and saved to ${outPath}`);
}

generateEmbeddings().catch(console.error);
