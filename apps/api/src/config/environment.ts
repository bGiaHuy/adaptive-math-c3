type Environment = Record<string, string | undefined>;

export function validateEnvironment(input: Environment) {
  const env = { ...input };
  const isProduction = env.NODE_ENV === 'production';

  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required.');
  }

  const sessionSecret = env.SESSION_SECRET || '';
  if (sessionSecret.length < 32) {
    throw new Error('SESSION_SECRET must contain at least 32 characters.');
  }

  if (isProduction) {
    if (sessionSecret.includes('adaptivemath_dev_')) {
      throw new Error('Development SESSION_SECRET cannot be used in production.');
    }
    if (!env.WEB_URL?.startsWith('https://')) {
      throw new Error('WEB_URL must use HTTPS in production.');
    }
    const cookieName = env.SESSION_COOKIE_NAME || '__Host-am_session';
    if (!cookieName.startsWith('__Host-')) {
      throw new Error('Production session cookie must use the __Host- prefix.');
    }
  }

  return env;
}
