import portfolioData from '@/lib/portfolio.json';

// Mapping exact icon filenames (without extension) in /public/skills/ to skill names
const customSlugMap: Record<string, string> = {
    'PyTorch': 'PyTorch',
    'TensorFlow': 'TensorFlow',
    'Scikit-learn': 'scikit-learn',
    'NumPy': 'NumPy',
    'Pandas': 'Pandas',
    'OpenCV': 'OpenCV',
    'Matplotlib': 'Matplotlib',
    'Jupyter Notebook': 'Jupyter',

    'OpenAI API': 'openai',
    'Google Gemini API': 'gemini-color',
    'Anthropic Claude': 'anthropic',
    'LangChain': 'langchain',
    'LlamaIndex': 'llamaindex-color',
    'Ollama': 'ollama',
    'DeepSeek-R1 8B': 'deepseek-color',
    'vLLM': 'vllm-color',
    'Convex': 'convex',

    'Apache Spark': 'Apache Spark',
    'Apache Airflow': 'Apache Airflow',
    'Apache Beam': 'beam-logo-full-color-name-bottom',
    'Power BI': 'New_Power_BI_Logo',
    'Tableau': 'tableau',
    'Microsoft Excel': 'microsoft-excel',
    'Microsoft 365': 'Microsoft_365_(2022)',

    'Antigravity': 'Antigravity',
    'Cursor AI': 'cursor',
    'Clawbot': 'openclaw-color',
    'Claude Code': 'claude-color',
    'GitHub Copilot': 'githubcopilot',
    'ChatGPT': 'openai',
    'Perplexity Pro': 'perplexity-color',
    'VS Code': 'Visual Studio Code (VS Code)',
    'Vercel': 'Vercel',
    'Google Colab': 'colab-color',

    'Python': 'Python',
    'C': 'C',
    'R': 'R',
    'JavaScript': 'JavaScript',
    'TypeScript': 'TypeScript',

    'MySQL': 'MySQL',
    'PostgreSQL': 'PostgresSQL',
    'Supabase': 'supabase-logo-icon',
    'BigQuery': 'Google Cloud',
    'AWS': 'aws-color',
    'Codex by OpenAI': 'codex by OpenAI',

    'React': 'React',
    'FastAPI': 'FastAPI',
    'Tailwind CSS': 'Tailwind CSS',
    'Next.js': 'nextjs',

    'Google Cloud Platform (GCS, BigQuery, Dataflow)': 'Google Cloud',
    'Docker': 'Docker',
    'GitHub Actions': 'github',

    'Git': 'Git',
    'GitHub': 'github',
    'PyTest': 'pytest',

    'Figma': 'figma-color',
    'Adobe Photoshop': 'Adobe Photoshop',
    'Adobe Premiere Pro': 'Adobe Premiere Pro',
    'Canva': 'Canva',
    'Adobe After Effects': 'After Effects',
};

const validIcons = new Set([
    'Adobe Photoshop', 'Adobe Premiere Pro', 'After Effects', 'Antigravity', 'Apache Airflow',
    'Apache Spark', 'Bash', 'C', 'Canva', 'Docker', 'FastAPI', 'Git', 'Google Cloud',
    'JSON', 'JavaScript', 'Jupyter', 'Matplotlib', 'Microsoft_365_(2022)', 'MySQL',
    'New_Power_BI_Logo', 'Node.js', 'NumPy', 'OpenCV', 'Pandas', 'PostgresSQL', 'PyTorch',
    'Python', 'R', 'React', 'Tailwind CSS', 'TensorFlow', 'TypeScript', 'Vercel',
    'Visual Studio Code (VS Code)', 'aistudio', 'anthropic', 'aws-color',
    'beam-logo-full-color-name-bottom', 'claude-color', 'colab-color', 'cursor', 'deepai',
    'deepseek-color', 'excel-svgrepo-com', 'figma-color', 'gemini-color', 'github',
    'githubcopilot', 'googlecloud-color', 'huggingface-color', 'langchain',
    'llamaindex-color', 'microsoft copilot-color', 'microsoft-excel', 'ollama', 'openai',
    'openclaw-color', 'perplexity-color (1)', 'perplexity-color', 'pytest', 'scikit-learn',
    'supabase-logo-icon', 'tableau', 'vllm-color', 'nextjs', 'convex', 'codex by OpenAI'
]);

const categoryDescriptions: Record<string, string> = {
    'Machine Learning':
        'Turning data into decisions through models that learn, adapt, and improve.',

    'Gen & Agentic AI':
        'Building intelligent agents that think, reason, and act with context.',

    'Data Engineering, Analytics & BI':
        'Transforming raw data into systems that power insight and strategy.',

    'Vibe Coding':
        'Using AI-assisted tools to move faster from idea to execution.',

    'Programming Languages':
        'Writing clean, scalable logic that brings systems to life.',

    'Database Management':
        'Designing reliable data foundations that everything else depends on.',

    'Full Stack & UI':
        'Bridging intelligent systems with intuitive user experiences.',

    'Cloud & Deployment':
        'Shipping systems that scale, stay resilient, and run in the real world.',

    'Version Control & Collaboration, Testing':
        'Building with discipline, collaboration, and confidence in every release.',

    'Design & Video Editing':
        'Crafting visuals that communicate ideas with clarity and impact.',

    'Core Computer Science Concepts':
        'Grounded in fundamentals that make complex systems possible.',

    'Personal Development':
        'Growing as an engineer, leader, and lifelong learner.',
};

// Map each skill string to an object { name, slug: string | null }
export const ALL_SKILLS = portfolioData.skills.map((group) => {
    return {
        label: group.category,
        desc: categoryDescriptions[group.category] || 'Specialized skills and domains.',
        items: group.items.map((skillName) => {
            const explicitSlug = customSlugMap[skillName];
            const autoSlug = skillName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const finalSlug = explicitSlug || autoSlug;
            return {
                name: skillName,
                slug: validIcons.has(finalSlug) ? finalSlug : null,
            };
        }),
    };
});

// The homepage only shows the core top 5 categories
export const CORE_SKILLS = ALL_SKILLS.slice(0, 7);
