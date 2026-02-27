require('dotenv').config({ path: '.env.local' });
async function listModels() {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await res.json();
    if (data.models) {
        console.log("Models with embedding:", data.models.filter(m => m.name.includes("embed")).map(m => m.name));
    } else {
        console.error("Error fetching models:", data);
    }
}
listModels();
