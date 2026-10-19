import React from 'react';
import Spinner from './Spinner';

export default function ModernLoadingState({ 
  message = 'Đang tải dữ liệu...', 
  subMessage = 'Vui lòng chờ trong giây lát',
  compact = false,
  color = '#78658f'
}) {
  return (
    <div className="modern-loading-box" role="status" aria-live="polite" style={{ padding: compact ? '24px 16px' : '48px 24px' }}>
      <div style={{ marginBottom: compact ? '10px' : '16px' }}>
        <Spinner size={compact ? 32 : 44} color={color} />
      </div>
      <div style={{ fontSize: compact ? '0.9rem' : '1.05rem', fontWeight: 600, color: '#252a32', display: 'flex', alignItems: 'center' }}>
        <span>{message}</span>
        <span className="modern-loading-dots">
          <span />
          <span />
          <span />
        </span>
      </div>
      {subMessage && (
        <div style={{ fontSize: '0.82rem', color: '#535966', marginTop: '6px' }}>
          {subMessage}
        </div>
      )}
    </div>
  );
}
