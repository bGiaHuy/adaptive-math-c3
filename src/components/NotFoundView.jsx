import React from 'react';
import { Compass, ArrowLeft, Home, BookOpen } from 'lucide-react';

export default function NotFoundView({ onNavigateHome, onNavigateDashboard, isLoggedIn = false }) {
  return (
    <div
      className="not-found-container animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '32px 16px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#e6dff4',
          border: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          color: '#2f574c'
        }}
      >
        <Compass size={36} />
      </div>

      <div
        style={{
          fontFamily: 'var(--font-family)',
          fontSize: '3.5rem',
          fontWeight: 700,
          color: '#1a1f2c',
          lineHeight: 1,
          marginBottom: '8px'
        }}
      >
        404
      </div>

      <h1
        style={{
          fontSize: '1.4rem',
          fontWeight: 600,
          color: '#0f172a',
          marginBottom: '12px'
        }}
      >
        Không tìm thấy trang yêu cầu
      </h1>

      <p
        style={{
          maxWidth: '460px',
          fontSize: '0.95rem',
          color: '#64748b',
          lineHeight: 1.6,
          marginBottom: '28px'
        }}
      >
        Đường dẫn bạn truy cập có thể đã đổi tên, bị xóa hoặc không tồn tại trong sơ đồ môn học Toán THCS.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {isLoggedIn ? (
          <button
            type="button"
            onClick={onNavigateDashboard}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#2f574c',
              color: '#ffffff',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            <Home size={16} />
            <span>Về Bảng điều khiển</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onNavigateHome}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#2f574c',
              color: '#ffffff',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            <ArrowLeft size={16} />
            <span>Về Trang chủ</span>
          </button>
        )}
      </div>
    </div>
  );
}
