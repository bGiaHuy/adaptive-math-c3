import { DIAGNOSTIC_BLUEPRINT } from '../../src/modules/diagnostic/diagnostic-blueprint';
import { THPT_DIAGNOSTIC_MATRICES } from '../../src/modules/question/diagnostic-blueprint';
export const thptBank = (grade = 10) => THPT_DIAGNOSTIC_MATRICES[grade].flatMap((cell, cellIndex) => Array.from({length:cell.count+2},(_,variant)=>({
  id:`thpt-${grade}-${cellIndex}-${variant}`,skillId:`thpt-skill-${grade}`,skill:{id:`thpt-skill-${grade}`,code:`THPT-${grade}`,grade,title:`Toán lớp ${grade}`,chapter:`Chương ${grade}`},
  questionType:cell.questionType,cognitiveLevel:cell.cognitiveLevel,difficulty:cell.difficulty,content:`Câu THPT ${grade} ${cellIndex} ${variant}`,explanation:'Lời giải kiểm thử',
  options:cell.questionType==='SINGLE_CHOICE'?['A','B','C','D'].map(optionKey=>({optionKey,content:optionKey,isCorrect:optionKey==='A'})):[],
  ...(cell.questionType==='TRUE_FALSE'?{statements:['a','b','c','d'].map(key=>({key,content:key,isCorrect:true}))}:{}),
  ...(cell.questionType==='SHORT_ANSWER'?{shortAnswer:{mode:'NUMERIC',acceptedAnswers:['7'],instructions:'Nhập số.'}}:{})
})));
export const blueprintSkills = [...new Set(DIAGNOSTIC_BLUEPRINT.map(s => s.skillCode))].map(code => ({ id: `skill-${code}`, code, grade: 9, title: code, chapter: 'Toán 9' }));
export const blueprintQuestions = () => DIAGNOSTIC_BLUEPRINT.map(s => ({
  skillId: `skill-${s.skillCode}`, questionType: s.questionType, cognitiveLevel: s.cognitiveLevel, difficulty: s.difficulty,
  content: `Bài toán vị trí ${s.slot}: ${s.topic}`, explanation: 'Lời giải kiểm thử',
  ...(s.questionType === 'SINGLE_CHOICE' ? { options: ['A', 'B', 'C', 'D'].map(key => ({ key, content: key })), correctOption: 'A' } :
    s.questionType === 'TRUE_FALSE' ? { statements: ['a', 'b', 'c', 'd'].map(key => ({ key, content: key, isCorrect: true })) } :
    { shortAnswer: { mode: 'NUMERIC', acceptedAnswers: ['7'], instructions: 'Nhập số, không ghi đơn vị.' } })
}));
export const blueprintBank = () => blueprintQuestions().map((q, i) => ({ ...q, id: `q-${i}`, skill: blueprintSkills.find(s => s.id === q.skillId) }));
