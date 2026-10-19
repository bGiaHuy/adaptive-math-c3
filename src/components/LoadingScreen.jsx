import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onFinished, duration = 1400 }) {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentPct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(currentPct);

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(onFinished, 120);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [onFinished, duration]);

  const getSubText = () => {
    if (progress < 35) return 'Đang kết nối cơ sở tri thức Toán GDPT 2018...';
    if (progress < 75) return 'Đồng bộ hóa dữ liệu và khởi tạo lộ trình thích ứng...';
    if (progress < 95) return 'Tối ưu hóa các điểm nút năng lực cá nhân...';
    return 'Sẵn sàng khởi động không gian học tập!';
  };

  return (
    <div className="loading-screen-backdrop">
      <div className="loading-dialog-card animate-fade-in" role="status" aria-live="polite">
        {/* Dynamic Circular Rotating Spinner ("loading xoay xoay") */}
        <div className="spinning-loader-box" aria-hidden="true" style={{ margin: '0 auto 24px' }}>
          <svg
            className="main-spinning-circle"
            width="80"
            height="80"
            viewBox="0 0 80 80"
            style={{ display: 'block', margin: '0 auto', filter: 'drop-shadow(0 0 16px rgba(240, 100, 47, 0.45))' }}
          >
            {/* Background Circular Track */}
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="rgba(240, 100, 47, 0.16)"
              strokeWidth="5"
            />
            {/* Outer Rotating Arc (Clockwise, 0.8s) */}
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="#f0642f"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="50 151"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 40 40"
                to="360 40 40"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Inner Counter-Rotating Arc (Counter-Clockwise, 1.1s) */}
            <circle
              cx="40"
              cy="40"
              r="22"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="35 103"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 40 40"
                to="0 40 40"
                dur="1.1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        <h2 className="loading-main-text">Đang chuẩn bị không gian học tập</h2>
        <p className="loading-sub-text">{getSubText()}</p>
        <div className="loading-progress-track" aria-hidden="true">
          <div className="loading-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="loading-percent-badge">{progress}%</div>
      </div>
    </div>
  );
}
