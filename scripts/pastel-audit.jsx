// Development-only visual fixture. Not an application entry or production data.
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Sidebar from '../src/components/Sidebar';
import DashboardView from '../src/components/DashboardView';
import MathTutorWidget from '../src/components/MathTutorWidget';
import TeacherWorkspace, { AssignmentReport } from '../src/components/TeacherWorkspace';
import TeacherLibrary from '../src/components/TeacherLibrary';
import TeacherClassDirectory from '../src/components/TeacherClassDirectory';
import AdminPortalView from '../src/components/AdminPortalView';
import ClassroomView from '../src/components/ClassroomView';
import TeacherPendingView from '../src/components/TeacherPendingView';
import OnboardingWizard from '../src/components/OnboardingWizard';
import SessionManagementModal from '../src/components/SessionManagementModal';
import ChangePasswordModal from '../src/components/ChangePasswordModal';
import LegalNoticeModal from '../src/components/LegalNoticeModal';
import ExamResultDialog from '../src/components/ExamResultDialog';
import NotFoundView from '../src/components/NotFoundView';
import ModernLoadingState from '../src/components/ModernLoadingState';
import MissionsView from '../src/components/MissionsView';
import LearningPathView from '../src/components/LearningPathView';
import MathReviewView from '../src/components/MathReviewView';
import ProfileCompetencyView from '../src/components/ProfileCompetencyView';
import MistakeNotebookView from '../src/components/MistakeNotebookView';
import TeacherExamComposer from '../src/components/TeacherExamComposer';
import CurriculumExplorer from '../src/components/CurriculumExplorer';
import 'katex/dist/katex.min.css';
import '../src/index.css';
import '../src/site-polish.css';
import '../src/semantic-ui.css';
import '../src/teacher-app-shell.css';
import '../src/pastel-bento.css';
import '../src/pastel-pages.css';
const noop = () => {};
const mode = new URLSearchParams(location.search).get('mode') || 'library';
const currentUser = { id: 'qa-teacher', role: 'TEACHER', fullName: 'Giáo viên kiểm thử', username: 'qa-teacher' };
export const classes = [{id:'qa-class',name:'Toán 10A1',grade:10,academicYear:'2026–2027',studentCount:5,isActive:true},{id:'qa-class2',name:'Toán 12A2',grade:12,academicYear:'2026–2027',studentCount:7,isActive:true}];
export const assignment = { id:'qa-report',classId:'qa-class',title:'Hàm số bậc hai và đồ thị',className:'Toán 10A1',status:'CLOSED',durationMinutes:45,questionCount:3,totalSubmissions:3,totalStudents:5,revision:1,resultsVisible:false,settings:{resultsPolicy:'MANUAL',published:false,showSolutions:true,folder:'Ôn tập chương VI',mode:'TEST',trackTabSwitches:true} };
export const questions = [
 {id:'q1',orderIndex:1,questionType:'SINGLE_CHOICE',content:'Cho hàm số $y=x^2$. Giá trị của hàm số tại $x=2$ là bao nhiêu?',options:['2','4','6','8'].map((content,i)=>({key:'ABCD'[i],content,isCorrect:i===1})),correctOption:'B',explanation:'Thay $x=2$ được $y=2^2=4$.',difficulty:'EASY',cognitiveLevel:'REMEMBERING',points:2,gradingMode:'STANDARD'},
 {id:'q2',orderIndex:2,questionType:'TRUE_FALSE',content:'Xét hàm số $y=x^2$. Xác định tính đúng sai của các khẳng định.',statements:[{key:'a',content:'Đồ thị đi qua gốc tọa độ.',isCorrect:true},{key:'b',content:'Hàm số nhận giá trị âm tại $x=2$.',isCorrect:false},{key:'c',content:'Trục đối xứng là trục tung.',isCorrect:true},{key:'d',content:'Đỉnh của đồ thị là điểm $(0;1)$.',isCorrect:false}],explanation:'Đồ thị có đỉnh tại gốc tọa độ, đối xứng qua trục tung và nhận giá trị không âm.',points:4,gradingMode:'STANDARD'},
 {id:'q3',orderIndex:3,questionType:'SHORT_ANSWER',content:'Tính giá trị của biểu thức $3^2+4^2$.',shortAnswer:{mode:'NUMERIC',acceptedAnswers:['25'],tolerance:0,instructions:'Nhập một số nguyên.'},explanation:'Ta có $3^2+4^2=9+16=25$.',points:4,gradingMode:'STANDARD'}
];
window.__qaQuestions = questions;
const activity={count:0,seconds:0,reloads:0,visits:[]};
export const roster = [
 {studentId:'s1',fullName:'Nguyễn Minh An',username:'minhan',isSubmitted:true,status:'SUBMITTED',score:4,timeSpentSeconds:1500,activity,answers:[{questionId:'q1',selectedOptionKey:'A',isCorrect:false,pointsAwarded:0}]},
 {studentId:'s2',fullName:'Trần Khánh Linh',username:'khanhlinh',isSubmitted:true,status:'SUBMITTED',score:8,timeSpentSeconds:1400,activity,answers:[{questionId:'q1',selectedOptionKey:'B',isCorrect:true,pointsAwarded:2}]},
 {studentId:'s3',fullName:'Lê Hải Nam',username:'hainam',isSubmitted:true,status:'SUBMITTED',score:6,timeSpentSeconds:1800,activity,answers:[{questionId:'q1',selectedOptionKey:'B',isCorrect:true,pointsAwarded:2}]},
 {studentId:'s4',fullName:'Đỗ Ngọc Mai',username:'ngocmai',isSubmitted:false,status:'IN_PROGRESS',score:null,activity,answers:[]},
 {studentId:'s5',fullName:'Phạm Gia Huy',username:'giahuy',isSubmitted:false,status:'NOT_STARTED',score:null,activity,answers:[]}
];
const questionAnalytics=questions.map((q,i)=>({questionId:q.id,orderIndex:i+1,questionType:q.questionType,content:q.content,skillTitle:'Hàm số và đồ thị',chapter:'Chương VI',totalAnswers:3,correctAnswers:i===0?2:1,wrongAnswers:i===0?1:2,skippedAnswers:0,correctOptionKey:q.correctOption,distribution:[{key:'A',count:1},{key:'B',count:2},{key:'C',count:0},{key:'D',count:0}],answers:[],statements:q.statements?.map(s=>({...s,correct:1,wrong:2,blank:0}))||[]}));
const report={assignment,roster,questions,questionAnalytics,history:[],stats:{},submissionCount:3};
function Audit(){
 const [tab,setTab]=useState(['report-edit','report-publish','report-student'].includes(mode) ? (mode==='report-edit'?'paper':'results') : mode.replace('report-',''));
 const [view,onView]=useState('grid'),[filter,onFilter]=useState(''),[search,onSearch]=useState(''),[folder,onFolder]=useState(''),[page,onPage]=useState(1);
 const [controls,setControls]=useState({page:1,query:'',grade:''});
 let content;
 if(mode==='competency')content=<ProfileCompetencyView onStartDiagnostic={noop}/>;
 if(mode==='mistakes')content=<MistakeNotebookView onStartPractice={noop}/>;
 if(mode==='exam-composer')content=<div className="teacher-workspace teacher-portal"><TeacherExamComposer bank={[]} counts={{SINGLE_CHOICE:12,TRUE_FALSE:4,SHORT_ANSWER:6}} setCounts={noop} selectedIds={[]} setSelectedIds={noop} custom={[]} setCustom={noop}/></div>;
 if(mode==='missions')content=<MissionsView onStartDiagnostic={noop} onNavigateTab={noop}/>;
 if(mode==='learning-path')content=<LearningPathView onStartDiagnostic={noop} onStartPractice={noop} onReview={noop}/>;
 if(mode==='review')content=<MathReviewView/>;
 if(mode==='library')content=<TeacherLibrary assignments={[assignment,{...assignment,id:'qa-draft',title:'Ôn tập xác suất lớp 12',status:'DRAFT',totalSubmissions:0},{...assignment,id:'qa-open',title:'Luyện tập vectơ trong không gian',status:'PUBLISHED',className:'Toán 12A2'}]} {...{view,onView,filter,onFilter,search,onSearch,folder,onFolder,page,onPage}} onOpen={noop} onReuse={noop} onDelete={noop} onCreate={noop}/>;
 else if(mode.startsWith('report-'))content=<AssignmentReport data={report} tab={tab} setTab={setTab} onBack={noop} onRefresh={noop}/>;
 else if(mode==='classes')content=<TeacherClassDirectory classes={classes} assignments={[assignment]} controls={controls} setControls={setControls} onOpen={noop} onCreate={noop}/>;
 else if(mode.startsWith('class-')||mode==='create-class'||mode.startsWith('composer'))content=<TeacherWorkspace currentUser={currentUser} activeTab="teacher-classes" onNavigate={noop}/>;
 else if(mode.startsWith('admin-'))content=<AdminPortalView currentUser={{...currentUser,role:'ADMIN'}} defaultTab={mode.replace('admin-','')} onNavigate={noop}/>;
 else if(mode==='student-dashboard')content=<DashboardView userProfile={{grade:10,dailyMinutes:45}} onStartSetup={noop} onNavigatePath={noop}/>;
 else if(mode==='tutor')content=<MathTutorWidget userId="qa-student"/>;
 else if(mode==='student-classroom'||mode.startsWith('student-exam'))content=<ClassroomView/>;
 else if(mode==='pending'||mode==='rejected')content=<TeacherPendingView currentUser={{...currentUser,role:'TEACHER_APPLICANT',teacherProfile:{schoolName:'THPT Kiểm thử',city:'Hà Nội',verificationStatus:mode==='rejected'?'REJECTED':'PENDING_REVIEW'}}} onRefreshUser={noop}/>;
 else if(mode.startsWith('onboarding'))content=<OnboardingWizard currentUser={{...currentUser,role:'STUDENT'}} onComplete={noop} onCancel={noop} onStepChange={noop}/>;
 else if(mode==='not-found')content=<NotFoundView isLoggedIn onNavigateDashboard={noop}/>;
 else if(mode==='loading')content=<ModernLoadingState message="Đang tải dữ liệu" subMessage="Vui lòng chờ trong giây lát"/>;
 else if(mode==='curriculum')content=<CurriculumExplorer/>;
 const isTeacher=mode==='exam-composer'||mode==='library'||mode==='classes'||mode.startsWith('class-')||mode==='create-class'||mode.startsWith('composer')||mode.startsWith('report-');
 return <div className={`app-container ${isTeacher?'teacher-app-shell':''}`}><Sidebar currentUser={currentUser} activeTab="teacher-library" onSelectTab={noop} onLogout={noop}/><div className="main-content-area"><main id="main-content" className="tab-viewport">{isTeacher&&!mode.startsWith('class-')&&!mode.startsWith('composer')?<div className="teacher-workspace teacher-portal">{content}</div>:content}
 {mode==='sessions'&&<SessionManagementModal isOpen onClose={noop}/>}{mode==='password'&&<ChangePasswordModal isOpen onClose={noop}/>}{mode==='legal'&&<LegalNoticeModal isOpen onClose={noop}/>}{mode==='student-result'&&<ExamResultDialog data={{assignmentTitle:assignment.title,className:'10A1',score:6,totalQuestions:3,correctCount:1,timeSpentSeconds:1400,questions:questions.map((q,i)=>({...q,isCorrect:i===0,selectedOptionKey:i===0?'B':'A',pointsAwarded:i===0?2:0}))}} onClose={noop}/>}
 </main></div></div>;
}
createRoot(document.getElementById('root')).render(<Audit/>);

