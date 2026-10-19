import React from 'react';

export default function BrandLogo({ size = 36, showText = true, subtitle = null, isDark = false, className = '' }) {
  return (
    <div className={`brand-logo-wrapper ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div 
        className="brand-logo-icon-container" 
        style={{ 
          width: size, 
          height: size, 
          borderRadius: Math.round(size * 0.28),
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: 'linear-gradient(135deg, #090d16 0%, #062b25 100%)',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
          border: '1px solid rgba(52, 211, 153, 0.35)'
        }}
      >
        <svg viewBox="0 0 64 64" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399"/>
              <stop offset="50%" stopColor="#06b6d4"/>
              <stop offset="100%" stopColor="#3b82f6"/>
            </linearGradient>
            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <line x1="8" y1="32" x2="56" y2="32" stroke="#10b981" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 3"/>
          <line x1="32" y1="8" x2="32" y2="56" stroke="#10b981" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 3"/>
          <path 
            d="M12 36 L17 45 L26 18 L52 18" 
            stroke="url(#logoAccentGrad)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            filter="url(#logoGlow)"
          />
          <path 
            d="M34 30 L44 44 M44 30 L34 44" 
            stroke="#ffffff" 
            strokeWidth="4" 
            strokeLinecap="round"
          />
          <circle cx="52" cy="18" r="4" fill="#38bdf8" filter="url(#logoGlow)"/ >
          <circle cx="52" cy="18" r="2" fill="#ffffff"/>
        </svg>
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="brand-logo-text" style={{ 
            fontWeight: 800, 
            fontSize: size >= 36 ? '1.25rem' : '1.05rem', 
            letterSpacing: '-0.02em', 
            color: isDark ? '#ffffff' : '#0f172a',
            fontFamily: "'Manrope', -apple-system, sans-serif",
            lineHeight: 1.15
          }}>
            Adaptive<span style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #38bdf8 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>Math</span>
          </span>
          {subtitle && (
            <span style={{ 
              fontSize: '0.68rem', 
              fontWeight: 600, 
              color: isDark ? '#6ee7b7' : '#64748b', 
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginTop: '1px'
            }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
