import React, { useEffect, useState } from 'react';
import { authApi } from '../lib/apiClient';

export default function GoogleSignInButton({
  role = 'student',
  linking = false,
  disabled = false,
}) {
  const [ready, setReady] = useState(false);
  const [linked, setLinked] = useState(false);
  useEffect(() => {
    let disposed = false;
    const controller = new AbortController();
    (async () => {
      try {
        const config = await authApi.googleConfig({ signal: controller.signal, timeoutMs: 10000 });
        if (!config.enabled || config.origin !== window.location.origin) return;
        if (linking) {
          const status = await authApi.googleStatus({
            signal: controller.signal,
            timeoutMs: 10000,
          });
          if (!disposed) setLinked(status.linked);
        }
        if (!disposed) setReady(true);
      } catch {
        /* Existing password auth remains usable when Google is not configured. */
      }
    })();
    return () => {
      disposed = true;
      controller.abort();
    };
  }, [linking]);
  if (!ready) return null;
  return (
    <div style={{ margin: '14px 0' }}>
      <button
        type="button"
        className="auth-link-btn"
        disabled={disabled || linked}
        onClick={() => window.location.assign(authApi.googleStartUrl(role, linking))}
        style={{
          width: '100%',
          padding: '12px',
          border: '1px solid #b9bec4',
          borderRadius: '8px',
          background: '#fff',
          color: '#202124',
        }}
      >
        {linked
          ? 'Đã liên kết Google'
          : linking
            ? 'Liên kết tài khoản Google'
            : 'Tiếp tục với Google'}
      </button>
    </div>
  );
}
