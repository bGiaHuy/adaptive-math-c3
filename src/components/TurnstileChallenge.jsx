import React, { useEffect, useRef, useState } from 'react';
import { loadSecurityConfig, loadTurnstile } from '../lib/securityChallenge';

export default function TurnstileChallenge({ action, resetSignal, onToken, onReady }) {
  const host = useRef(null);
  const [config, setConfig] = useState(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let disposed = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    onReady(false);
    loadSecurityConfig(controller.signal)
      .then((value) => {
        if (disposed) return;
        setConfig(value);
        if (!value.enabled) onReady(true);
      })
      .catch(() => {
        if (!disposed) setError('Chưa tải được xác minh bảo mật. Vui lòng tải lại trang.');
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      disposed = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [onReady, retry]);

  useEffect(() => {
    if (!config?.enabled || !host.current) return;
    let disposed = false,
      widget;
    onReady(false);
    onToken('');
    setError('');
    loadTurnstile()
      .then((turnstile) => {
        if (disposed) return;
        widget = turnstile.render(host.current, {
          sitekey: config.siteKey,
          action,
          theme: 'light',
          size: 'flexible',
          callback: (token) => {
            if (!disposed) {
              onToken(token);
              onReady(true);
              setError('');
            }
          },
          'expired-callback': () => {
            if (!disposed) {
              onToken('');
              onReady(false);
            }
          },
          'error-callback': (code) => {
            if (!disposed) {
              onToken('');
              onReady(false);
              const suffix = /^\d{6}$/.test(String(code)) ? ` (mã ${code})` : '';
              setError('Không xác minh được' + suffix + '. Vui lòng thử lại hoặc mở trang bằng trình duyệt thông thường.');
            }
          },
        });
      })
      .catch((e) => {
        if (!disposed) setError(e.message);
      });
    return () => {
      disposed = true;
      if (widget !== undefined) window.turnstile?.remove(widget);
      onToken('');
    };
  }, [config, action, resetSignal, retry, onToken, onReady]);

  if (config && !config.enabled) return null;
  return (
    <div className="auth-security-challenge" aria-live="polite">
      <div ref={host} />
      {error && (
        <div role="alert" style={{ color: '#9f2020', fontSize: '0.875rem', margin: '8px 0' }}>
          {error}
          <button type="button" onClick={() => setRetry((value) => value + 1)}>Thử xác minh lại</button>
        </div>
      )}
    </div>
  );
}
