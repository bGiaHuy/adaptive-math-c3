// Public edge configuration only. No secret is sent to the browser.
export async function loadSecurityConfig(signal) {
  const response = await fetch('/api/security/config', {
    signal,
    cache: 'no-store',
    credentials: 'omit',
  });
  if (response.status === 404) return { enabled: false }; // Existing non-Cloudflare deployment.
  if (!response.ok) throw Error('Chưa tải được cấu hình xác minh. Vui lòng tải lại trang.');
  const config = (await response.json()).turnstile;
  if (!config?.enabled) return { enabled: false };
  if (typeof config.siteKey !== 'string' || !/^[A-Za-z0-9_-]{10,100}$/.test(config.siteKey))
    throw Error('Dịch vụ xác minh chưa sẵn sàng. Vui lòng thử lại sau.');
  return { enabled: true, siteKey: config.siteKey };
}

export function challengeRequestOptions(token) {
  return token ? { headers: { 'x-cf-turnstile-token': token } } : {};
}

// Retry only an explicit edge rejection that occurs before the auth operation.
// Never retry network failures, credentials errors or a consumed challenge token.
export async function runAuthChallenge(operation, obtainToken) {
  try {
    return await operation({});
  } catch (error) {
    if (error.status !== 403 || !['SECURITY_CHALLENGE_REQUIRED', 'TURNSTILE_REQUIRED', 'TURNSTILE_REJECTED'].includes(error.code)) throw error;
    const token = await obtainToken();
    if (!token) throw Error('Chưa hoàn tất xác minh bảo mật.');
    return operation(challengeRequestOptions(token));
  }
}

let scriptPromise;
export function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.turnstile) resolve(window.turnstile);
      else {
        script.remove();
        scriptPromise = undefined;
        reject(Error('Không tải được xác minh bảo mật.'));
      }
    };
    script.onerror = () => {
      script.remove();
      scriptPromise = undefined;
      reject(Error('Không kết nối được dịch vụ xác minh. Vui lòng thử lại.'));
    };
    document.head.append(script);
  });
  return scriptPromise;
}
