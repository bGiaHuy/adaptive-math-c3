import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(';').forEach((c) => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backgroundColor: 'var(--bg-primary, #fbf9f4)'
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              backgroundColor: '#fffdf7',
              border: '2px solid #131a2a',
              borderRadius: '10px',
              padding: '32px',
              boxShadow: '8px 8px 0 rgba(19, 26, 42, 0.15)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '16px'
              }}
            >
              ⚠️
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Đã xảy ra sự cố hiển thị giao diện
            </h2>

            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>
              Hệ thống đã tự động ngăn chặn tình trạng màn hình trắng. Bạn có thể thử tải lại trang hoặc đặt lại phiên đăng nhập để khắc phục.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#0f766e',
                  color: '#ffffff',
                  border: '2px solid #0f766e',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                🔄 Tải lại trang (F5)
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  padding: '10px 18px',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  border: '2px solid #cbd5e1',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Trở về trang chủ
              </button>
            </div>

            {this.state.error && (
              <details style={{ textAlign: 'left', marginTop: '16px', fontSize: '0.78rem', color: '#94a3b8' }}>
                <summary style={{ cursor: 'pointer', color: '#64748b' }}>Chi tiết kỹ thuật</summary>
                <pre
                  style={{
                    marginTop: '8px',
                    padding: '10px',
                    backgroundColor: '#0f172a',
                    color: '#f87171',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    fontSize: '0.74rem'
                  }}
                >
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
