import React from 'react';
import MathRenderer from './MathRenderer';
import { MathQuestionResult, QUESTION_TYPE_LABELS } from './MathQuestionResponse';
import './QuestionDisplay.css';

/** Shared question anatomy. Only the result variant exposes student grading. */
export default function QuestionDisplay({ question, variant = 'paper', number, onEdit, id, className = '', header, topic, footer, showSolutions = true, solutionMode = 'inline', promptContent, answerContent, ...attributes }) {
 const q = { ...question, options: (question.options || []).map(o => ({ ...o, key: o.key || o.optionKey, isCorrect: o.isCorrect ?? (o.key || o.optionKey) === question.correctOption })) };
 const result = variant === 'result';
 const hasSolution = !!String(q.explanation || '').trim();
 return <article {...attributes} id={id} className={`question-display qd-${variant} ${className}`}>
  {header || <header className="qd-heading"><div><h3>Câu {number}</h3><p>{QUESTION_TYPE_LABELS[q.questionType || 'SINGLE_CHOICE']}{q.points != null && ` · ${q.points} điểm`}</p></div>{onEdit && <button type="button" className="qd-edit" aria-label={`Chỉnh sửa câu hỏi ${number}`} onClick={() => onEdit('content')}>Chỉnh sửa câu hỏi</button>}</header>}
  {topic && <div className="qd-topic">{topic}</div>}
  {promptContent || <MathRenderer className="qd-prompt" content={q.content} />}
  <section className={variant === 'bank' ? 'qd-answers qb-answer-section' : 'qd-answers'} aria-label={result ? 'Câu trả lời và kết quả' : 'Đáp án chuẩn'}>
   {!result && <div className="qd-answer-heading"><h4>{variant === 'source' ? 'Đáp án và hướng dẫn từ bản gốc' : 'Đáp án chuẩn'}</h4>{variant === 'paper' && q.shortAnswer?.mode === 'NUMERIC' && <small>Sai số: {q.shortAnswer.tolerance ?? 1e-9}</small>}</div>}
   {answerContent || <MathQuestionResult question={q} answerKey={!result} showTechnicalDetails={false} />}
  </section>
  {showSolutions && (hasSolution ? solutionMode === 'disclosure' ? <details className="qd-solution"><summary>Xem lời giải</summary><MathRenderer content={q.explanation} /></details> : <section className="qd-solution"><h4>Lời giải</h4><MathRenderer content={q.explanation} /></section> : <div className="qd-empty-solution"><span>Chưa có lời giải</span>{onEdit && <button type="button" onClick={() => onEdit('explanation')}>Thêm lời giải</button>}</div>)}
  {footer}
 </article>;
}
