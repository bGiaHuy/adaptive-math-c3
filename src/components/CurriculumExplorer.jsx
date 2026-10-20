import React, { useId, useState } from 'react';
import { BookOpen, Search, Layers3 } from 'lucide-react';
import { THPT_CURRICULUM, THPT_BOOK } from '../data/thptCurriculum';
import { BankNotice, BentoCard } from './BentoUI';
import MathTopicBackdrop from './MathTopicBackdrop';
const fold = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
export default function CurriculumExplorer({ initialGrade = 10, showNotice = true, catalogOnly = false }) {
  const [grade, setGrade] = useState([10, 11, 12].includes(Number(initialGrade)) ? Number(initialGrade) : 10);
  const [query, setQuery] = useState('');
  const [electives, setElectives] = useState(false);
  const id = useId();
  const level = THPT_CURRICULUM.find(item => item.grade === grade);
  const chapters = level.chapters.filter(chapter => fold(`${chapter.title} ${chapter.topics.map(t => t.title).join(' ')}`).includes(fold(query)));
  const optional = level.electives.filter(title => fold(title).includes(fold(query)));
  return <section className="bento-curriculum" aria-labelledby={`${id}-heading`}>
    <header className="bento-section-heading"><div><span className="bento-eyebrow">CHƯƠNG TRÌNH HỌC</span><h2 id={`${id}-heading`}>Chương trình Toán THPT</h2><p>{THPT_BOOK} · Toán THPT</p></div><BookOpen size={28} aria-hidden="true" /></header>
    {showNotice && <BankNotice />}
    <div className="bento-filter-panel">
      <div className="bento-curriculum-tools"><div className="bento-filter-field"><span className="bento-filter-label">Khối lớp</span><div className="bento-grade-tabs" role="group" aria-label="Chọn khối lớp">{[10, 11, 12].map(value => <button type="button" key={value} aria-pressed={grade === value} onClick={() => setGrade(value)}>Lớp {value}</button>)}</div></div><label className="bento-search"><Search size={18} aria-hidden="true" /><span className="sr-only">Tìm chuyên đề</span><input type="search" placeholder="Tìm chuyên đề…" value={query} onChange={event => setQuery(event.target.value)} /></label></div>
      <div className="bento-book-filter"><div className="bento-book-tabs" role="group" aria-label="Loại sách"><button type="button" aria-pressed={!electives} onClick={() => setElectives(false)}>SGK chính</button><button type="button" aria-pressed={electives} onClick={() => setElectives(true)}>Chuyên đề học tập</button></div><span className="bento-book-hint">{electives ? 'Nội dung lựa chọn, học riêng với SGK chính' : 'Chương trình học chính theo từng khối lớp'}</span></div>
    </div>
    <p className="bento-result-count" role="status">{electives ? optional.length + ' chuyên đề học tập' : chapters.length + ' chương'} · Lớp {grade} · Danh mục kiến thức Kết nối tri thức</p>
    <div className="bento-chapter-grid">{electives ? optional.map((title, index) => <BentoCard key={title} tone={['yellow', 'pink', 'lavender'][level.electives.indexOf(title) % 3]} className="bento-topic-card"><MathTopicBackdrop grade={grade} index={level.electives.indexOf(title)} elective /><span className="bento-eyebrow">CHUYÊN ĐỀ {index + 1}</span><h3>{title}</h3><p>Thuộc sách Chuyên đề học tập, tách biệt chương trình SGK chính.</p><span className="bento-chip">{catalogOnly ? 'Danh mục chương trình' : 'Theo dõi ở Lộ trình học'}</span></BentoCard>) : chapters.map(chapter => <BentoCard key={chapter.id} tone={['mint', 'pink', 'lavender', 'yellow'][level.chapters.indexOf(chapter) % 4]} className="bento-topic-card"><MathTopicBackdrop grade={grade} index={level.chapters.indexOf(chapter)} /><div className="bento-chapter-top"><span className="bento-eyebrow">CHƯƠNG {level.chapters.indexOf(chapter) + 1}</span><Layers3 size={18} aria-hidden="true" /></div><h3>{chapter.title}</h3><ul>{chapter.topics.map(topic => <li key={topic.id}>{topic.title}</li>)}</ul><span className="bento-chip">{catalogOnly ? 'Danh mục chương trình' : 'Theo dõi ở Lộ trình học'}</span></BentoCard>)}</div>
    {!(electives ? optional.length : chapters.length) && <div className="bento-empty"><h3>Chưa tìm thấy chuyên đề</h3><p>Thử tên ngắn hơn hoặc chọn khối khác.</p><button type="button" className="bento-button" onClick={() => setQuery('')}>Xóa tìm kiếm</button></div>}
  </section>;
}

