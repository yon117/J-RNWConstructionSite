function stripTrailingSlash(url) {
  return String(url || '').replace(/\/+$/, '');
}

function getConfiguredBaseUrl() {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');

  return configured ? stripTrailingSlash(configured) : '';
}

export function getBaseUrl(req) {
  const configured = getConfiguredBaseUrl();
  if (configured) return configured;

  const forwardedHost = req?.headers?.['x-forwarded-host'];
  const hostHeader = forwardedHost || req?.headers?.host || '';
  const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;
  if (host) {
    const forwardedProto = req?.headers?.['x-forwarded-proto'];
    const protoHeader = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto;
    const proto = protoHeader || (/^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(host) ? 'http' : 'https');
    return `${proto}://${host}`;
  }

  return 'http://localhost:3000';
}

export function getGoogleOAuthRedirectUri(req) {
  return `${getBaseUrl(req)}/api/auth/google-sc-callback`;
}

export function getSearchConsoleSiteUrl(req) {
  const configured = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL;
  if (configured) return configured;
  return `${getBaseUrl(req)}/`;
}
