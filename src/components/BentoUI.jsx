import React from 'react';
import { ArrowUpRight } from 'lucide-react';
export function BentoCard({ tone = 'white', className = '', children, ...props }) {
  return <section className={`bento-card bento-${tone} ${className}`} {...props}>{children}</section>;
}
export function RoundButton({ label, onClick, disabled = false, children }) {
  return <button type="button" className="bento-round" aria-label={label} title={label} disabled={disabled} onClick={onClick}>{children || <ArrowUpRight size={20} aria-hidden="true" />}</button>;
}
export function BentoStat({ label, value, note, tone = 'mint', icon: Icon }) {
  return <BentoCard tone={tone} className="bento-stat"><div><span>{label}</span>{Icon && <Icon size={20} aria-hidden="true" />}</div><strong>{value}</strong><small>{note}</small></BentoCard>;
}
export function BankNotice() {
  return <div className="bento-bank-notice" role="status"><span className="bento-status-dot" aria-hidden="true" /><div><strong>Đề tham khảo THPT đã có trong mục Học liệu</strong><p>Đọc đề gốc và đối chiếu đáp án tại <a href="#/teacher-bank">Học liệu THPT</a>. Kho câu hỏi dùng chấm tự động chưa mở trong đợt rà soát này. Bạn vẫn có thể soạn câu hoặc tạo đề từ tài liệu.</p></div></div>;
}
