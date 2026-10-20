import React from 'react';

export default function BrandLogo({ size = 36, showText = true, subtitle = null, isDark = false, className = '' }) {
  return <div className={`brand-logo-wrapper ${className}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div className="brand-logo-icon-container" style={{ width: size, height: size, borderRadius: Math.round(size * 0.25), flexShrink: 0, overflow: 'hidden', background: '#234d3c' }}>
      <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Đồ thị hàm số — Toán THPT">
        <path d="M9 35H40M15 40V9" stroke="#a4bca8" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M10 14Q24 55 38 14" stroke="#f5f2df" strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="34.5" r="3" fill="#e6b75f" />
      </svg>
    </div>
    {showText && <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span className="brand-logo-text" style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, fontSize: size >= 36 ? '1.25rem' : '1.05rem', letterSpacing: '-0.035em', color: isDark ? '#f8faf7' : '#21392d', lineHeight: 1.15 }}>
        Adaptive<span style={{ color: isDark ? '#b9d1bf' : '#35664e' }}>Math</span>
      </span>
      {subtitle && <span style={{ fontSize: '0.68rem', fontWeight: 600, color: isDark ? '#b9d1bf' : '#65746a', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 3 }}>{subtitle}</span>}
    </div>}
  </div>;
}
