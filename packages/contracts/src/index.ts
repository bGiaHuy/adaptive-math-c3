// ==============================================================================
// AdaptiveMath — Shared Contracts & Data Transfer Objects
// ==============================================================================

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER_APPLICANT = 'TEACHER_APPLICANT',
  TEACHER = 'TEACHER',
  CONTENT_AUTHOR = 'CONTENT_AUTHOR',
  CONTENT_REVIEWER = 'CONTENT_REVIEWER',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export enum TeacherVerificationStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export enum CognitiveLevel {
  REMEMBERING = 'REMEMBERING', // Nhận biết
  UNDERSTANDING = 'UNDERSTANDING', // Thông hiểu
  APPLYING = 'APPLYING' // Vận dụng
}

export enum QuestionStatus {
  DRAFT = 'DRAFT',
  IN_REVIEW = 'IN_REVIEW',
  PUBLISHED = 'PUBLISHED',
  RETIRED = 'RETIRED'
}

export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED'
}

// Unified Error Response format mandated by PRD & Implementation Prompt
export interface ApiErrorResponse {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  requestId: string;
  timestamp: string;
}

// User Profile summary returned by /auth/me
export interface CurrentUserDto {
  id: string;
  username: string;
  email: string | null;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  permissionVersion: number;
  studentProfile?: {
    grade: number;
    targetGoal: string;
    dailyMinutes: number;
    examDate: string | null;
  };
  teacherProfile?: {
    schoolName: string | null;
    city: string | null;
    verificationStatus: TeacherVerificationStatus;
  };
}
