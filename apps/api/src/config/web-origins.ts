export function webOrigins(env: Record<string, string | undefined> = process.env): string[] {
  const values = [env.WEB_URL || 'http://localhost:3000', ...(env.WEB_ALLOWED_ORIGINS || '').split(',')];
  if (env.NODE_ENV !== 'production') values.push('http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000');
  return [...new Set(values.filter(value => value.trim()).map(value => {
    const url = new URL(value.trim());
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash ||
        (env.NODE_ENV === 'production' && url.protocol !== 'https:')) throw new Error('Invalid web origin configuration.');
    return url.origin;
  }))];
}

export function trustedRequestOrigin(origin: string | undefined, referer: string | undefined, allowed: string[]) {
  if (origin) return allowed.includes(origin);
  try { return Boolean(referer && allowed.includes(new URL(referer).origin)); } catch { return false; }
}
