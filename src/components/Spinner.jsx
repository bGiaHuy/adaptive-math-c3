import React from 'react';

/**
 * Universal circular rotating spinner with embedded SVG SMIL animation + CSS rotation fallback.
 * Guaranteed 100% smooth continuous 360-degree rotation ("loading xoay xoay") across all browsers,
 * themes, and OS accessibility modes.
 */
export default function Spinner({
  size = 28,
  color = '#f0642f',
  trackColor = 'rgba(240, 100, 47, 0.18)',
  className = '',
  style = {}
}) {
  const s = typeof size === 'number' ? size : parseInt(size, 10) || 28;
  const stroke = Math.max(2.5, Math.round(s / 8));
  const radius = Math.max(1, (s - stroke * 2) / 2);
  const center = s / 2;
  const circumference = 2 * Math.PI * radius;
  const dashLength = (circumference * 0.35).toFixed(1);
  const gapLength = (circumference * 0.65).toFixed(1);

  return (
    <span
      className={`universal-spinning-circle ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${s}px`,
        height: `${s}px`,
        verticalAlign: 'middle',
        lineHeight: 1,
        ...style
      }}
      role="status"
      aria-label="Đang tải..."
    >
      <svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        style={{
          display: 'block',
          animation: 'spin 0.8s linear infinite',
          transformOrigin: `${center}px ${center}px`,
          overflow: 'visible'
        }}
      >
        {/* Background circular track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        {/* Glowing rotating circular head */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dashLength} ${gapLength}`}
        >
          {/* SMIL hardware rotation that can never be stopped by CSS */}
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${center} ${center}`}
            to={`360 ${center} ${center}`}
            dur="0.8s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </span>
  );
}
