export function getSessionCookieName(): string {
  const configured = process.env.SESSION_COOKIE_NAME;
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) return configured || '__Host-am_session';
  if (!configured || configured.startsWith('__Host-')) return 'am_session';
  return configured;
}
