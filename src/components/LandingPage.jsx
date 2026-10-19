import React from 'react';
import { ArrowRight, BookOpen, CalendarDays, Shapes, GraduationCap } from 'lucide-react';
import Navbar from './Navbar';
import { BentoCard } from './BentoUI';

export default function LandingPage({ onStartRegistration, onLogin, onOpenLegal }) {
  return <div className="landing-page-root pastel-landing">
    <Navbar showFullNav onOpenLegal={onOpenLegal} onNavigate={(view, params) => params?.mode === 'login' ? onLogin() : onStartRegistration()} />
    <main className="pastel-landing-main">
      <div className="pastel-landing-hero">
        <BentoCard tone="mint" className="pastel-landing-intro"><span className="bento-eyebrow">TOÁN THPT · KẾT NỐI TRI THỨC</span><h1>Học từng chút.<br />Vững từng ngày.</h1><p>Một không gian nhẹ nhàng để sắp xếp việc học Toán, khám phá chuyên đề và kết nối với lớp của bạn.</p><div className="pastel-landing-actions"><button className="bento-button bento-button-dark" onClick={onStartRegistration}>Tạo tài khoản<ArrowRight size={18} aria-hidden="true" /></button><button className="bento-button" onClick={onLogin}>Đăng nhập</button></div><span className="pastel-landing-caption">Lớp 10 · 11 · 12 / Chương trình GDPT 2018</span></BentoCard>
        <div className="pastel-landing-preview" aria-label="Giới thiệu chương trình học">
          <BentoCard tone="lavender" className="pastel-landing-book"><div className="pastel-preview-heading"><GraduationCap size={24} aria-hidden="true" /><span>KHÔNG GIAN CỦA BẠN</span></div><h2>Mỗi kiến thức,<br />một mảnh ghép.</h2><div className="pastel-grade-row"><span>Lớp 10</span><span>Lớp 11</span><span>Lớp 12</span></div><p>Đại số & giải tích<br />Hình học<br />Thống kê & xác suất</p><Shapes size={64} className="pastel-book-shapes" aria-hidden="true" /></BentoCard>
          <BentoCard tone="yellow" className="pastel-landing-mini"><BookOpen size={24} aria-hidden="true" /><strong>24</strong><span>chương SGK</span></BentoCard>
          <BentoCard tone="pink" className="pastel-landing-mini"><CalendarDays size={24} aria-hidden="true" /><strong>Nhịp riêng</strong><span>Chọn thời gian phù hợp</span></BentoCard>
        </div>
      </div>
      <section className="pastel-landing-features" aria-labelledby="landing-features-title"><header><span className="bento-eyebrow">BẮT ĐẦU THẬT NHẸ NHÀNG</span><h2 id="landing-features-title">Có chỗ cho từng bước tiến.</h2></header><div className="pastel-feature-grid"><BentoCard><span className="pastel-feature-icon bento-mint"><BookOpen size={22} aria-hidden="true" /></span><h3>Biết mình sẽ học gì</h3><p>Khám phá chương trình lớp 10–12, tìm chuyên đề và phân biệt nội dung SGK với chuyên đề lựa chọn.</p></BentoCard><BentoCard tone="pink"><span className="pastel-feature-icon"><CalendarDays size={22} aria-hidden="true" /></span><h3>Giữ một nhịp học vừa sức</h3><p>Chọn mục tiêu thời gian mỗi ngày và theo dõi lịch sử học trong tài khoản của bạn.</p></BentoCard><BentoCard tone="yellow"><span className="pastel-feature-icon"><GraduationCap size={22} aria-hidden="true" /></span><h3>Học cùng lớp của bạn</h3><p>Tham gia lớp bằng mã mời, nhận bài giáo viên giao và xem kết quả theo thiết lập của lớp.</p></BentoCard></div></section>
      <div className="pastel-landing-status"><span className="bento-status-dot" aria-hidden="true" /><p>Kho câu hỏi THPT đang được chuẩn bị. Bài luyện và kiểm tra tự động sẽ mở sau khi học liệu được kiểm duyệt.</p></div>
      <BentoCard tone="lavender" className="pastel-landing-cta"><div><span className="bento-eyebrow">MỘT KHỞI ĐẦU MỚI</span><h2>Sẵn sàng cho hành trình của bạn?</h2></div><button className="bento-button bento-button-dark" onClick={onStartRegistration}>Bắt đầu từ hồ sơ<ArrowRight size={18} aria-hidden="true" /></button></BentoCard>
    </main>
    <footer className="pastel-landing-footer"><p>AdaptiveMath · Toán THPT theo Kết nối tri thức với cuộc sống</p><button onClick={onOpenLegal}>Bảo mật & điều khoản (dự thảo)</button></footer>
  </div>;
}
