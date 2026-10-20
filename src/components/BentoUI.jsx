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
  return <div className="bento-bank-notice" role="status"><span className="bento-status-dot" aria-hidden="true" /><div><strong>Học liệu và đánh giá Toán THPT</strong><p>Bài đánh giá chỉ sử dụng câu hỏi đã duyệt của đúng khối lớp. Chuyên đề chưa đủ câu hỏi sẽ được thông báo để bổ sung; bản nháp cần rà soát tiếp trước khi dùng chấm tự động.</p></div></div>;
}
