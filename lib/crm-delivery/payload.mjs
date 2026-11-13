// Maps a landing form submission to the OPS POST /api/crm/leads contract.
// Never truncates: anything outside OPS limits is reported as a violation so the
// message can be reviewed by a person instead of silently losing text.

export const OPS_LIMITS = Object.freeze({
    submissionId: 100,
    name: 200,
    email: 254,
    phone: 50,
    title: 200,
    message: 5000,
    bodyBytes: 32768
});

const SUBMISSION_ID_PATTERN = /^[a-zA-Z0-9._:-]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function buildOpsPayload({ submissionId, name, email, phone, serviceType, message }) {
    const clean = (value) => String(value ?? '').trim();
    const payload = {
        submission_id: clean(submissionId),
        client_name: clean(name),
        client_email: clean(email).toLowerCase(),
        client_phone: clean(phone),
        title: clean(serviceType),
        message: clean(message),
        lead_source: 'website'
    };
    // OPS ignores empty optional fields; do not send empty strings it would treat as absent anyway.
    if (!payload.client_email) delete payload.client_email;
    if (!payload.client_phone) delete payload.client_phone;
    if (!payload.title) delete payload.title;

    const violations = [];
    const tooLong = (field, value, limit) => {
        if (value && value.length > limit) violations.push({ field, limit });
    };

    if (!payload.submission_id || payload.submission_id.length > OPS_LIMITS.submissionId
        || !SUBMISSION_ID_PATTERN.test(payload.submission_id)) {
        violations.push({ field: 'submission_id', limit: OPS_LIMITS.submissionId });
    }
    if (!payload.client_name) violations.push({ field: 'client_name', limit: 0 });
    tooLong('client_name', payload.client_name, OPS_LIMITS.name);
    if (!payload.message) violations.push({ field: 'message', limit: 0 });
    tooLong('message', payload.message, OPS_LIMITS.message);
    tooLong('title', payload.title, OPS_LIMITS.title);
    tooLong('client_phone', payload.client_phone, OPS_LIMITS.phone);
    tooLong('client_email', payload.client_email, OPS_LIMITS.email);
    if (!payload.client_email && !payload.client_phone) violations.push({ field: 'contact', limit: 0 });
    if (payload.client_email && !EMAIL_PATTERN.test(payload.client_email)) {
        violations.push({ field: 'client_email', limit: 0 });
    }

    const json = JSON.stringify(payload);
    if (Buffer.byteLength(json, 'utf8') > OPS_LIMITS.bodyBytes) {
        violations.push({ field: 'body_bytes', limit: OPS_LIMITS.bodyBytes });
    }

    if (violations.length) {
        return { ok: false, reason: 'payload_exceeds_ops_limits', violations, json };
    }
    return { ok: true, payload, json };
}
