const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://127.0.0.1:5678/webhook/formulario-contacto';
const N8N_TIMEOUT_MS = 5000;

export async function notifyN8n(payload) {
    try {
        const res = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(N8N_TIMEOUT_MS)
        });
        if (!res.ok) console.error('n8n webhook responded with status', res.status);
    } catch (error) {
        console.error('n8n webhook failed:', error.message);
    }
}
