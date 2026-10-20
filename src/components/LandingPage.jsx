import React from 'react';
import { ArrowRight, BookOpen, CalendarDays, GraduationCap } from 'lucide-react';
import Navbar from './Navbar';
import { BentoCard } from './BentoUI';

export default function LandingPage({ onStartRegistration, onLogin, onOpenLegal }) {
  return <div className="landing-page-root pastel-landing">
    <Navbar showFullNav onNavigate={(view, params) => params?.mode === 'login' ? onLogin() : onStartRegistration()} />
    <main className="pastel-landing-main">
      <div className="pastel-landing-hero">
        <BentoCard tone="mint" className="pastel-landing-intro">
          <h1>Chưa hiểu bài?<br />Ôn lại ở đây.</h1>
          <p>Làm bài đánh giá để biết phần cần ôn, luyện theo chuyên đề và hỏi lại những bước giải chưa rõ.</p>
          <div className="pastel-landing-actions">
            <button className="bento-button bento-button-dark" onClick={onStartRegistration}>Tạo tài khoản<ArrowRight size={18} aria-hidden="true" /></button>
            <button className="bento-button" onClick={onLogin}>Đăng nhập</button>
          </div>
          <span className="pastel-landing-caption">Dành cho học sinh lớp 10, 11 và 12.</span>
        </BentoCard>
        <div className="pastel-landing-preview" aria-label="Giới thiệu chương trình học">
          <BentoCard tone="lavender" className="pastel-landing-book">
            <div className="pastel-preview-heading"><GraduationCap size={24} aria-hidden="true" /><span>CHƯƠNG TRÌNH HỌC</span></div>
            <h2>Nội dung theo<br />lớp đang học.</h2>
            <div className="pastel-grade-row"><span>Lớp 10</span><span>Lớp 11</span><span>Lớp 12</span></div>
            <p>Đại số & giải tích<br />Hình học<br />Thống kê & xác suất</p>
            <svg className="pastel-book-shapes" width="64" height="64" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M8 36H41M14 41V8" stroke="currentColor" strokeWidth="1.5" /><path d="M9 13Q24 57 39 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
          </BentoCard>
          <BentoCard tone="yellow" className="pastel-landing-mini"><BookOpen size={24} aria-hidden="true" /><strong>24</strong><span>chương SGK</span></BentoCard>
          <BentoCard tone="pink" className="pastel-landing-mini"><CalendarDays size={24} aria-hidden="true" /><strong>Lịch học</strong><span>Theo dõi từng ngày</span></BentoCard>
        </div>
      </div>
      <section className="pastel-landing-features" aria-labelledby="landing-features-title">
        <header><h2 id="landing-features-title">Bạn có thể làm gì ở đây?</h2></header>
        <div className="pastel-feature-grid">
          <BentoCard><span className="pastel-feature-icon bento-mint"><BookOpen size={22} aria-hidden="true" /></span><h3>Ôn theo chuyên đề</h3><p>Chọn chương và bài học trong chương trình lớp 10–12 để luyện phần đang cần ôn.</p></BentoCard>
          <BentoCard tone="pink"><span className="pastel-feature-icon"><CalendarDays size={22} aria-hidden="true" /></span><h3>Theo dõi việc học</h3><p>Xem lịch học, kết quả từng lần làm bài và các câu cần ôn lại.</p></BentoCard>
          <BentoCard tone="yellow"><span className="pastel-feature-icon"><GraduationCap size={22} aria-hidden="true" /></span><h3>Nhận bài từ giáo viên</h3><p>Vào lớp bằng mã mời, làm bài được giao và xem kết quả theo cài đặt của bài giao.</p></BentoCard>
        </div>
      </section>
      <BentoCard tone="lavender" className="pastel-landing-cta"><div><h2>Bắt đầu bằng một bài đánh giá.</h2><p>Chọn lớp và mục tiêu học trước khi làm bài.</p></div><button className="bento-button bento-button-dark" onClick={onStartRegistration}>Tạo hồ sơ học tập<ArrowRight size={18} aria-hidden="true" /></button></BentoCard>
    </main>
    <footer className="pastel-landing-footer"><p>AdaptiveMath · Toán lớp 10, 11 và 12.</p><button onClick={onOpenLegal}>Bảo mật & điều khoản</button></footer>
  </div>;
}
