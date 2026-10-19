/**
 * Production-grade Offline / Prototype Mock API Fallback
 * Provides 100% realistic, persistent interactive testing for all 3 roles:
 * - Student (User)
 * - Teacher (Verified & Applicant)
 * - Admin
 */

import { DIAGNOSTIC_QUESTIONS } from '../data/questionBank';

const MOCK_STORAGE_PREFIX = 'adaptive_mock_db_';

function getStorage(key, defaultVal) {
  try {
    const raw = localStorage.getItem(`${MOCK_STORAGE_PREFIX}${key}`);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Mock storage read error:', err);
  }
  return defaultVal;
}

function setStorage(key, val) {
  try {
    localStorage.setItem(`${MOCK_STORAGE_PREFIX}${key}`, JSON.stringify(val));
  } catch (err) {
    console.error('Mock storage write error:', err);
  }
}

// Initial Mock Database State
const INITIAL_USERS = [
  {
    id: 'mock_student_1',
    username: 'duc_nguyen',
    fullName: 'Nguyễn Minh Đức',
    email: 'duc.nguyen@example.com',
    role: 'STUDENT',
    status: 'ACTIVE',
    createdAt: '2026-09-01T08:00:00Z',
    studentProfile: {
      grade: 9,
      targetGoal: 'Ôn thi vào lớp 10',
      dailyMinutes: 45,
      examDate: '2027-06-10',
      selfAssessment: 'Khá'
    }
  },
  {
    id: 'mock_teacher_1',
    username: 'thaynam',
    fullName: 'Thầy Nguyễn Văn Nam',
    email: 'thaynam@thcs.edu.vn',
    role: 'TEACHER',
    status: 'ACTIVE',
    createdAt: '2026-08-15T08:00:00Z',
    teacherProfile: {
      schoolName: 'THCS Chu Văn An, Hà Nội',
      city: 'Hà Nội',
      verificationStatus: 'VERIFIED'
    }
  },
  {
    id: 'mock_applicant_1',
    username: 'teacher_pending',
    fullName: 'Cô Lê Thu Trang (Chờ duyệt)',
    email: 'thutrang@thcs.edu.vn',
    role: 'TEACHER_APPLICANT',
    status: 'ACTIVE',
    createdAt: '2026-10-02T10:00:00Z',
    teacherProfile: {
      schoolName: 'THCS Giảng Võ, Hà Nội',
      city: 'Hà Nội',
      verificationStatus: 'PENDING_REVIEW'
    }
  },
  {
    id: 'mock_admin_1',
    username: 'admin',
    fullName: 'Quản Trị Viên Hệ Thống',
    email: 'admin@adaptivelearning.vn',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z'
  }
];

const INITIAL_CLASSROOMS = [
  {
    id: 'cls_math_9a1',
    name: 'Toán 9A1 — Luyện Thi Chuyên',
    grade: 9,
    academicYear: '2026-2027',
    teacherId: 'mock_teacher_1',
    teacher: { fullName: 'Thầy Nguyễn Văn Nam' },
    activeInviteCode: {
      id: 'inv_math_1',
      code: 'MATH9A1X',
      codePrefix: 'MATH9',
      expiresAt: '2026-11-30T23:59:59Z',
      usedCount: 18,
      maxUses: 45,
      isRevoked: false
    },
    inviteCodes: [
      {
        id: 'inv_math_1',
        code: 'MATH9A1X',
        codePrefix: 'MATH9',
        expiresAt: '2026-11-30T23:59:59Z',
        usedCount: 18,
        maxUses: 45,
        isRevoked: false
      }
    ],
    students: [
      { id: 'mock_student_1', fullName: 'Nguyễn Minh Đức', email: 'duc.nguyen@example.com', joinedAt: '2026-09-05T09:00:00Z' },
      { id: 'mock_student_2', fullName: 'Trần Bảo Ngọc', email: 'ngoc.tran@example.com', joinedAt: '2026-09-06T10:00:00Z' }
    ]
  }
];

const INITIAL_ASSIGNMENTS = [
  {
    id: 'asg_diag_01',
    classId: 'cls_math_9a1',
    title: 'Khảo Sát Năng Lực Đầu Năm: Căn Thức & Hệ Phương Trình',
    description: 'Bài kiểm tra 45 phút gồm 15 câu trắc nghiệm bao quát chương I và chương II.',
    durationMinutes: 45,
    dueDate: '2026-10-25T23:59:59Z',
    questionCount: 15,
    status: 'PUBLISHED',
    isSubmitted: false,
    questions: DIAGNOSTIC_QUESTIONS.slice(0, 4)
  }
];

const INITIAL_AUDIT_LOGS = [
  { id: 'aud_1', action: 'USER_LOGIN', actor: { fullName: 'Thầy Nguyễn Văn Nam' }, targetEntity: 'User', ipAddress: '127.0.0.1', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'aud_2', action: 'TEACHER_APPROVED', actor: { fullName: 'Quản Trị Viên' }, targetEntity: 'TeacherProfile', ipAddress: '127.0.0.1', createdAt: new Date(Date.now() - 7200000).toISOString() }
];

export function handleMockApi(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};

  // Active Session
  let activeUser = getStorage('active_user', null);
  let users = getStorage('users', INITIAL_USERS);
  let classrooms = getStorage('classrooms', INITIAL_CLASSROOMS);
  let assignments = getStorage('assignments', INITIAL_ASSIGNMENTS);
  let auditLogs = getStorage('audit_logs', INITIAL_AUDIT_LOGS);
  let activeAttempt = getStorage('diagnostic_attempt', null);

  // 1. AUTH ENDPOINTS
  if (endpoint === '/auth/me') {
    return { user: activeUser };
  }

  if (endpoint === '/auth/login' && method === 'POST') {
    const { identifier, password } = body;
    const user = users.find(u => u.username === identifier || u.email === identifier);
    if (!user) {
      // Allow dynamic login as student if identifier looks like student
      const newUser = {
        id: `user_${Date.now()}`,
        username: identifier,
        fullName: identifier.includes('admin') ? 'Quản Trị Viên' : identifier.includes('thay') ? 'Thầy Giáo Viên' : 'Học Sinh Đăng Nhập',
        role: identifier.includes('admin') ? 'ADMIN' : identifier.includes('thay') || identifier.includes('tea') ? 'TEACHER' : 'STUDENT',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      setStorage('users', users);
      setStorage('active_user', newUser);
      return { message: 'Đăng nhập thành công (Chế độ mô phỏng trực tiếp)', user: newUser };
    }
    setStorage('active_user', user);
    return { message: 'Đăng nhập thành công', user };
  }

  if (endpoint === '/auth/register/student' && method === 'POST') {
    const studentUser = {
      id: `stu_${Date.now()}`,
      username: body.username,
      fullName: body.fullName,
      email: body.email || `${body.username}@student.vn`,
      role: 'STUDENT',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      studentProfile: {
        grade: 9,
        targetGoal: 'Ôn thi vào lớp 10',
        dailyMinutes: 45,
        selfAssessment: 'Khá'
      }
    };
    users.push(studentUser);
    setStorage('users', users);
    setStorage('active_user', studentUser);
    return { message: 'Đăng ký học sinh thành công', user: studentUser };
  }

  if (endpoint === '/auth/register/teacher' && method === 'POST') {
    const teacherUser = {
      id: `tea_${Date.now()}`,
      username: body.email?.split('@')[0] || `teacher_${Date.now()}`,
      fullName: body.fullName,
      email: body.email,
      role: 'TEACHER_APPLICANT',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      teacherProfile: {
        schoolName: body.schoolName || 'THCS Giảng Võ, Hà Nội',
        city: body.city || 'Hà Nội',
        verificationStatus: 'PENDING_REVIEW'
      }
    };
    users.push(teacherUser);
    setStorage('users', users);
    setStorage('active_user', teacherUser);
    return { message: 'Nộp hồ sơ giáo viên thành công', user: teacherUser };
  }

  if (endpoint === '/auth/logout' && method === 'POST') {
    setStorage('active_user', null);
    return { message: 'Đã đăng xuất' };
  }

  if (endpoint === '/auth/sessions') {
    return {
      sessions: [
        {
          id: 'sess_current',
          userAgent: navigator.userAgent,
          ipAddress: '127.0.0.1 (Local Client)',
          createdAt: new Date().toISOString(),
          lastSeenAt: new Date().toISOString(),
          isCurrent: true
        }
      ]
    };
  }

  // 2. STUDENT ENDPOINTS
  if (endpoint === '/student/profile') {
    const prof = activeUser?.studentProfile || {
      grade: 9,
      targetGoal: 'Ôn thi vào lớp 10',
      dailyMinutes: 45,
      examDate: '2027-06-10',
      selfAssessment: 'Khá'
    };
    return {
      id: activeUser?.id || 'mock_student_1',
      username: activeUser?.username || 'duc_nguyen',
      fullName: activeUser?.fullName || 'Nguyễn Minh Đức',
      role: 'STUDENT',
      profile: prof,
      joinedClassrooms: classrooms.map(c => ({
        id: c.id,
        name: c.name,
        grade: c.grade,
        teacherName: c.teacher?.fullName || 'Thầy Nam',
        joinedAt: '2026-09-05T09:00:00Z'
      })),
      stats: {
        completedAssessments: 1,
        masteredSkills: 6,
        totalMistakes: 3,
        unmasteredMistakes: 1
      }
    };
  }

  if (endpoint === '/student/onboarding' && method === 'PATCH') {
    if (activeUser) {
      activeUser.studentProfile = {
        ...(activeUser.studentProfile || {}),
        ...body
      };
      setStorage('active_user', activeUser);
      // update in users list
      const uIndex = users.findIndex(u => u.id === activeUser.id);
      if (uIndex >= 0) {
        users[uIndex] = activeUser;
        setStorage('users', users);
      }
    }
    return { message: 'Cập nhật thiết lập hồ sơ thành công', profile: activeUser?.studentProfile };
  }

  if (endpoint === '/student/mastery') {
    return {
      averageMasteryScore: 82,
      totalAssessedSkills: 8,
      strongCount: 5,
      averageCount: 2,
      weakCount: 1,
      skills: [
        { skillId: 's1', code: 'CAN_THUC_01', title: 'Căn bậc hai và căn bậc ba', chapter: 'Đại số 9', score: 85, level: 'THÀNH THẠO' },
        { skillId: 's2', code: 'HE_PHUONG_TRINH_01', title: 'Hệ hai phương trình bậc nhất hai ẩn', chapter: 'Đại số 9', score: 90, level: 'THÀNH THẠO' },
        { skillId: 's3', code: 'LUONG_GIAC_01', title: 'Tỉ số lượng giác góc nhọn', chapter: 'Hình học 9', score: 65, level: 'TRUNG BÌNH' },
        { skillId: 's4', code: 'DUONG_TRON_01', title: 'Đường tròn và góc với đường tròn', chapter: 'Hình học 9', score: 45, level: 'CẦN LUYỆN TẬP' }
      ]
    };
  }

  if (endpoint === '/student/learning-path') {
    return {
      grade: 9,
      path: [
        { id: 'node_1', code: 'C1', title: 'Chương 1: Căn bậc hai & Căn thức', status: 'COMPLETED', progress: 100, score: 88 },
        { id: 'node_2', code: 'C2', title: 'Chương 2: Hệ phương trình bậc nhất hai ẩn', status: 'IN_PROGRESS', progress: 75, score: 80 },
        { id: 'node_3', code: 'C3', title: 'Chương 3: Hệ thức lượng trong tam giác vuông', status: 'UNLOCKED', progress: 30, score: 65 },
        { id: 'node_4', code: 'C4', title: 'Chương 4: Đường tròn & Góc nội tiếp', status: 'LOCKED', progress: 0, score: 0 }
      ]
    };
  }

  if (endpoint.startsWith('/student/mistakes')) {
    return {
      total: 3,
      mistakes: [
        {
          id: 'mistake_1',
          question: {
            content: 'Rút gọn biểu thức $\\sqrt{245} - \\sqrt{5}$:',
            explanation: '$\\sqrt{245} = 7\\sqrt{5}$, do đó $7\\sqrt{5} - \\sqrt{5} = 6\\sqrt{5}$.',
            options: [
              { optionKey: 'A', content: '$6\\sqrt{5}$' },
              { optionKey: 'B', content: '$5\\sqrt{5}$' }
            ]
          },
          selectedOptionKey: 'B',
          isMastered: false,
          userNotes: 'Cần nhớ cách tách thừa số chính phương 245 = 49 * 5'
        }
      ]
    };
  }

  // 3. DIAGNOSTIC ASSESSMENT (CAT/IRT)
  if (endpoint === '/diagnostic/start' && method === 'POST') {
    const newAttempt = {
      attemptId: `att_${Date.now()}`,
      currentTheta: 0.50,
      answeredCount: 0,
      totalQuestions: 4,
      currentQuestionIndex: 0,
      answers: []
    };
    setStorage('diagnostic_attempt', newAttempt);
    return {
      attemptId: newAttempt.attemptId,
      currentTheta: newAttempt.currentTheta,
      answeredCount: 0,
      totalQuestions: 4,
      currentQuestion: DIAGNOSTIC_QUESTIONS[0],
      questionTimeRemainingSeconds: 90,
      isReadyToSubmit: false
    };
  }

  if (endpoint === '/diagnostic/answer' && method === 'POST') {
    let attempt = getStorage('diagnostic_attempt', null) || {
      attemptId: `att_${Date.now()}`,
      currentTheta: 0.50,
      answeredCount: 0,
      totalQuestions: 4,
      currentQuestionIndex: 0,
      answers: []
    };

    const nextIndex = (attempt.currentQuestionIndex || 0) + 1;
    attempt.answeredCount = nextIndex;
    attempt.currentQuestionIndex = nextIndex;
    attempt.currentTheta = Math.min(0.95, attempt.currentTheta + 0.12);

    const isFinished = nextIndex >= 4 || nextIndex >= DIAGNOSTIC_QUESTIONS.length;
    setStorage('diagnostic_attempt', attempt);

    return {
      attemptId: attempt.attemptId,
      answeredCount: attempt.answeredCount,
      totalQuestions: 4,
      currentTheta: attempt.currentTheta,
      isReadyToSubmit: isFinished,
      currentQuestion: isFinished ? null : DIAGNOSTIC_QUESTIONS[nextIndex] || DIAGNOSTIC_QUESTIONS[0],
      explanation: 'Lời giải chi tiết: Đáp án chính xác đã được hệ thống ghi nhận và phân tích năng lực theo mô hình IRT 2PL.'
    };
  }

  if (endpoint.startsWith('/diagnostic/submit/')) {
    return {
      message: 'Hoàn thành bài kiểm tra chẩn đoán năng lực.',
      results: {
        finalTheta: 0.78,
        estimatedGradeScore: 8.5,
        masteryLevel: 'KHÁ_GIỎI',
        strongTopics: ['Căn bậc hai', 'Hệ hai phương trình bậc nhất hai ẩn'],
        weakTopics: ['Tỉ số lượng giác nâng cao']
      }
    };
  }

  if (endpoint.startsWith('/diagnostic/results/')) {
    return {
      finalTheta: 0.78,
      estimatedGradeScore: 8.5,
      completedAt: new Date().toISOString(),
      summary: 'Năng lực toán học của học sinh đạt mức Khá - Giỏi, vững vàng kiến thức nền tảng THCS.'
    };
  }

  // 4. CLASSROOM & ASSIGNMENT ENDPOINTS
  if (endpoint === '/classrooms') {
    if (method === 'GET') {
      return { classrooms };
    }
    if (method === 'POST') {
      const generatedCode = 'MTH' + Math.random().toString(36).substring(2, 7).toUpperCase();
      const newCodeObj = {
        id: `inv_${Date.now()}`,
        code: generatedCode,
        codePrefix: generatedCode.substring(0, 5),
        expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
        usedCount: 0,
        maxUses: 45,
        isRevoked: false
      };
      const newClass = {
        id: `cls_${Date.now()}`,
        name: body.name || 'Lớp Học Mới',
        grade: body.grade || 9,
        academicYear: body.academicYear || '2026-2027',
        teacherId: activeUser?.id || 'mock_teacher_1',
        teacher: { fullName: activeUser?.fullName || 'Thầy Nam' },
        activeInviteCode: newCodeObj,
        inviteCodes: [newCodeObj],
        students: []
      };
      classrooms.push(newClass);
      setStorage('classrooms', classrooms);
      return { message: 'Tạo lớp học thành công', classroom: newClass };
    }
  }

  if (endpoint === '/classrooms/join' && method === 'POST') {
    return {
      message: 'Tham gia lớp học thành công!',
      classroom: classrooms[0]
    };
  }

  if (endpoint.startsWith('/classrooms/')) {
    const parts = endpoint.split('/');
    const classId = parts[2];
    const subRoute = parts[3];
    const currentClass = classrooms.find(c => c.id === classId) || classrooms[0];

    if (subRoute === 'students') {
      return { students: currentClass?.students || [] };
    }

    if (subRoute === 'assignments') {
      return { assignments: assignments.filter(a => a.classId === classId) || assignments };
    }

    if (subRoute === 'invite-codes') {
      if (parts[4] === 'revoke' && method === 'POST') {
        if (currentClass) {
          if (currentClass.activeInviteCode) currentClass.activeInviteCode.isRevoked = true;
          if (currentClass.inviteCodes) {
            currentClass.inviteCodes.forEach(c => { c.isRevoked = true; });
          }
          setStorage('classrooms', classrooms);
        }
        return { message: 'Đã thu hồi mã mời.' };
      }
      const generatedCode = 'MTH' + Math.random().toString(36).substring(2, 7).toUpperCase();
      const newCodeObj = {
        id: `inv_${Date.now()}`,
        code: generatedCode,
        codePrefix: generatedCode.substring(0, 5),
        expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
        usedCount: 0,
        maxUses: 50,
        isRevoked: false
      };
      if (currentClass) {
        currentClass.activeInviteCode = newCodeObj;
        if (!currentClass.inviteCodes) currentClass.inviteCodes = [];
        currentClass.inviteCodes.unshift(newCodeObj);
        setStorage('classrooms', classrooms);
      }
      return {
        inviteCode: newCodeObj
      };
    }

    if (!subRoute && method === 'GET') {
      return { classroom: currentClass };
    }
  }

  // 5. ADMIN ENDPOINTS
  if (endpoint === '/admin/overview') {
    return {
      totalUsers: users.length,
      totalStudents: users.filter(u => u.role === 'STUDENT').length || 1,
      totalTeachers: users.filter(u => u.role === 'TEACHER').length || 1,
      pendingApplicants: users.filter(u => u.role === 'TEACHER_APPLICANT').length || 1,
      totalQuestions: 254,
      publishedQuestions: 230,
      totalClassrooms: classrooms.length
    };
  }

  if (endpoint === '/admin/teachers/applicants') {
    const applicants = users.filter(u => u.role === 'TEACHER_APPLICANT' || u.teacherProfile?.verificationStatus === 'PENDING_REVIEW');
    return { applicants };
  }

  if (endpoint.includes('/admin/teachers/') && endpoint.includes('/review') && method === 'POST') {
    const teacherId = endpoint.split('/')[3];
    const user = users.find(u => u.id === teacherId);
    if (user) {
      if (body.status === 'VERIFIED' || body.decision === 'APPROVE') {
        user.role = 'TEACHER';
        if (user.teacherProfile) user.teacherProfile.verificationStatus = 'VERIFIED';
      } else {
        if (user.teacherProfile) user.teacherProfile.verificationStatus = 'REJECTED';
      }
      setStorage('users', users);
      auditLogs.unshift({
        id: `aud_${Date.now()}`,
        action: 'TEACHER_APPROVED',
        actor: { fullName: 'Quản Trị Viên' },
        targetEntity: 'TeacherProfile',
        ipAddress: '127.0.0.1',
        createdAt: new Date().toISOString()
      });
      setStorage('audit_logs', auditLogs);
    }
    return { message: 'Đã cập nhật trạng thái phê duyệt hồ sơ giáo viên.' };
  }

  if (endpoint.startsWith('/admin/questions')) {
    return {
      total: DIAGNOSTIC_QUESTIONS.length,
      questions: DIAGNOSTIC_QUESTIONS.map(q => ({
        id: q.id,
        content: q.content,
        cognitiveLevel: q.level === 'Nhận biết' ? 'REMEMBERING' : q.level === 'Thông hiểu' ? 'UNDERSTANDING' : 'APPLYING',
        status: 'PUBLISHED',
        author: { fullName: 'Tổ Chuyên Môn Toán' }
      }))
    };
  }

  if (endpoint.startsWith('/admin/audit-logs')) {
    return { logs: auditLogs };
  }

  if (endpoint.startsWith('/admin/users')) {
    return {
      users: users.map(u => ({
        id: u.id,
        username: u.username,
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt
      }))
    };
  }

  // Default Fallback
  return { message: 'Thành công (Chế độ mô phỏng offline)' };
}
