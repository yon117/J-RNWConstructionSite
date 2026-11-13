// Server-only configuration for the OPS CRM delivery. Never import this from client code.
// Disabled unless JRNW_OPS_CRM_ENABLED is exactly "true" AND URL/token are valid.
// Return values never include the token in `reason`; only the `token` field of an enabled config does.

const MIN_TOKEN_LENGTH = 32; // same floor OPS enforces for JRNW_OPS_PUBLIC_LEAD_TOKEN

export function readCrmDeliveryConfig(env = process.env) {
    if (env.JRNW_OPS_CRM_ENABLED !== 'true') return { enabled: false, reason: 'disabled' };

    let url;
    try {
        url = new URL(env.JRNW_OPS_CRM_LEADS_URL || '');
    } catch {
        return { enabled: false, reason: 'invalid_url' };
    }
    if (url.protocol !== 'https:' || url.username || url.password) {
        return { enabled: false, reason: 'invalid_url' };
    }

    const token = env.JRNW_OPS_CRM_TOKEN || '';
    if (token.length < MIN_TOKEN_LENGTH || /\s/.test(token)) {
        return { enabled: false, reason: 'invalid_token' };
    }

    return { enabled: true, url: url.toString(), token };
}
