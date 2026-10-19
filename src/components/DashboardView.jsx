import React from 'react';
import { ArrowRight, BookOpen, Clock3, GraduationCap, Shapes } from 'lucide-react';
import PracticeCalendar from './PracticeCalendar';
import CurriculumExplorer from './CurriculumExplorer';
import { BentoCard, BentoStat, BankNotice, RoundButton } from './BentoUI';

export default function DashboardView({ userProfile, onStartSetup, onNavigatePath }) {
  const configured = [10, 11, 12].includes(Number(userProfile?.grade));
  return <div className="pastel-dashboard">
    <header className="bento-welcome"><div><span className="bento-eyebrow">KHÔNG GIAN HỌC TOÁN CỦA BẠN</span><h1>Một khởi đầu nhỏ.<br />Một bước tiến mới.</h1><p>Học Toán THPT theo nhịp của riêng bạn.</p></div><span className="bento-book-label"><GraduationCap size={20} aria-hidden="true" />Kết nối tri thức<span>Lớp 10 · 11 · 12</span></span></header>
    <div className="bento-dashboard-grid"><div className="bento-dashboard-main">
      <BentoCard tone="mint" className="bento-hero"><div><span className="bento-eyebrow">BƯỚC TIẾP THEO</span><h2>{configured ? 'Sẵn sàng cho hành trình mới?' : 'Bắt đầu từ điều phù hợp với bạn.'}</h2><p>{configured ? `Khám phá chương trình lớp ${userProfile.grade}, chọn chuyên đề và chuẩn bị mục tiêu học tập.` : 'Chọn lớp, mục tiêu và thời gian học. Chúng mình sẽ bắt đầu từ đó.'}</p><button type="button" className="bento-button bento-button-dark" onClick={configured ? onNavigatePath : onStartSetup}>{configured ? 'Khám phá chuyên đề' : 'Thiết lập hồ sơ'}<ArrowRight size={18} aria-hidden="true" /></button></div><div className="bento-math-art" aria-hidden="true"><span>ƒ(x)</span><svg viewBox="0 0 160 100"><path d="M10 85H150M30 95V10" /><path className="bento-curve" d="M35 23Q80 140 140 15" /><circle cx="88" cy="70" r="6" /></svg><small>từng bước, vững hơn</small></div></BentoCard>
      <div className="bento-stats"><BentoStat icon={GraduationCap} label="Khối lớp" value={configured ? userProfile.grade : '10–12'} note={configured ? 'Hồ sơ học tập của bạn' : 'Chương trình THPT'} /><BentoStat icon={Clock3} tone="yellow" label="Nhịp học mỗi ngày" value={`${userProfile?.dailyMinutes || 45}′`} note="Mục tiêu thời gian học" /><BentoStat icon={BookOpen} tone="lavender" label="Chương trình" value="24" note="Chương SGK · 3 khối lớp" /></div>
      <BentoCard tone="pink" className="bento-explore-callout"><Shapes size={32} aria-hidden="true" /><div><h2>Toán học, từng mảnh ghép.</h2><p>Đại số & giải tích · Hình học · Thống kê & xác suất</p></div><RoundButton label="Xem danh mục chuyên đề" onClick={onNavigatePath} /></BentoCard>
      <BankNotice />
    </div><aside className="bento-dashboard-aside"><div className="bento-aside-heading"><h2>Lịch học của bạn</h2><span className="bento-chip">Từng ngày một</span></div><PracticeCalendar userProfile={userProfile} /><BentoCard tone="yellow" className="bento-study-note"><span className="bento-eyebrow">MỘT CHÚT ĐỀU ĐẶN</span><h3>Hiểu bản chất.<br />Vững cách làm.</h3><p>Dành một khoảng thời gian cố định để ôn lại kiến thức và ghi chú điều bạn chưa hiểu.</p></BentoCard></aside></div>
    <CurriculumExplorer key={userProfile?.grade || "pending"} initialGrade={userProfile?.grade} showNotice={false} />
  </div>;
}
