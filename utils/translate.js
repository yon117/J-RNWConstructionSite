const cache = {};

async function translateChunk(text, targetLang) {
    if (!text || targetLang === 'en') return text;
    const key = `${targetLang}:${text}`;
    if (cache[key]) return cache[key];
    try {
        const res = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
        );
        const data = await res.json();
        const translated = data.responseData?.translatedText || text;
        if (translated && translated.toUpperCase().includes('MYMEMORY WARNING')) return text;
        cache[key] = translated;
        return translated;
    } catch { return text; }
}

export async function translateText(text, targetLang) {
    if (!text || targetLang === 'en') return text;
    if (text.length <= 450) return translateChunk(text, targetLang);
    // Split into sentences and translate in chunks of max 450 chars
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let chunks = [], current = '';
    for (const s of sentences) {
        if ((current + s).length > 450) {
            if (current) chunks.push(current.trim());
            current = s;
        } else {
            current += s;
        }
    }
    if (current.trim()) chunks.push(current.trim());
    const translated = await Promise.all(chunks.map(c => translateChunk(c, targetLang)));
    return translated.join(' ');
}

export async function translateArray(texts, targetLang) {
    if (targetLang === 'en') return texts;
    return Promise.all(texts.map(t => translateText(t, targetLang)));
}
