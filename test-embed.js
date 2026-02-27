require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
async function run() {
    const key = process.env.GEMINI_API_KEY.trim();
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await res.json();
    fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
}
run();
