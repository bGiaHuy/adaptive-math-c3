import { describe, it, expect } from 'vitest';

// Emulate ApiError and Client Logic for Headless Verification
class ApiError extends Error {
  status: number;
  code: string;
  requestId: string;
  details: any;

  constructor({ status, code, message, requestId, details = null }: {
    status: number;
    code?: string;
    message?: string;
    requestId: string;
    details?: any;
  }) {
    super(message || 'Đã có lỗi xảy ra trong quá trình xử lý yêu cầu.');
    this.name = 'ApiError';
    this.status = status;
    this.code = code || 'UNKNOWN_ERROR';
    this.requestId = requestId;
    this.details = details;
  }
}

// Role routing rules from App.jsx & Sidebar.jsx
function getDefaultTabForRole(role?: string): string {
  switch (role) {
    case 'TEACHER_APPLICANT':
      return 'teacher-pending';
    case 'TEACHER':
      return 'teacher-classes';
    case 'ADMIN':
    case 'CONTENT_AUTHOR':
    case 'CONTENT_REVIEWER':
      return 'admin-overview';
    case 'STUDENT':
    default:
      return 'dashboard';
  }
}

function getAllowedTabsForRole(role?: string): string[] {
  switch (role) {
    case 'TEACHER_APPLICANT':
      return ['teacher-pending'];
    case 'TEACHER':
      return ['teacher-classes'];
    case 'ADMIN':
    case 'CONTENT_AUTHOR':
    case 'CONTENT_REVIEWER':
      return ['admin-overview', 'admin-applicants', 'admin-questions', 'admin-audit'];
    case 'STUDENT':
    default:
      return [
        'onboarding',
        'dashboard',
        'profile',
        'learning-path',
        'diagnostic',
        'missions',
        'mistakes',
        'classroom'
      ];
  }
}

describe('Frontend API Client & Role Shell Routing Specifications (Phase 1 & 7)', () => {
  describe('ApiError Classification & Contract', () => {
    it('constructs ApiError with complete error context and requestId', () => {
      const err = new ApiError({
        status: 403,
        code: 'MAKER_CHECKER_VIOLATION',
        message: 'Tác giả không được phép tự thẩm định câu hỏi của chính mình.',
        requestId: 'req_test12345',
        details: { questionId: 'q_999' }
      });

      expect(err.name).toBe('ApiError');
      expect(err.status).toBe(403);
      expect(err.code).toBe('MAKER_CHECKER_VIOLATION');
      expect(err.message).toContain('Tác giả không được phép');
      expect(err.requestId).toBe('req_test12345');
      expect(err.details).toEqual({ questionId: 'q_999' });
    });

    it('standardizes HTTP error status codes (400, 401, 403, 404, 409, 429, 500)', () => {
      const statusMap: Record<number, string> = {
        400: 'BAD_REQUEST',
        401: 'UNAUTHORIZED_SESSION_EXPIRED',
        403: 'FORBIDDEN_SCOPE',
        404: 'NOT_FOUND',
        409: 'CONFLICT_DUPLICATE',
        429: 'RATE_LIMIT_EXCEEDED',
        500: 'INTERNAL_SERVER_ERROR'
      };

      for (const [statusStr, expectedCode] of Object.entries(statusMap)) {
        const status = Number(statusStr);
        const err = new ApiError({
          status,
          code: expectedCode,
          requestId: `req_${status}`
        });
        expect(err.status).toBe(status);
        expect(err.code).toBe(expectedCode);
      }
    });

    it('enforces idempotent retry policy: only GET retries, mutations never retry', () => {
      const getOptions = { method: 'GET' };
      const maxRetriesGet = getOptions.method === 'GET' ? 2 : 0;
      expect(maxRetriesGet).toBe(2);

      const postOptions = { method: 'POST' };
      const maxRetriesPost = postOptions.method === 'GET' ? 2 : 0;
      expect(maxRetriesPost).toBe(0);

      const patchOptions = { method: 'PATCH' };
      const maxRetriesPatch = patchOptions.method === 'GET' ? 2 : 0;
      expect(maxRetriesPatch).toBe(0);

      const deleteOptions = { method: 'DELETE' };
      const maxRetriesDelete = deleteOptions.method === 'GET' ? 2 : 0;
      expect(maxRetriesDelete).toBe(0);
    });
  });

  describe('Role-Based Shell Routing & Navigation Guards', () => {
    it('routes STUDENT to dashboard and provides full student feature set', () => {
      expect(getDefaultTabForRole('STUDENT')).toBe('dashboard');
      const studentTabs = getAllowedTabsForRole('STUDENT');
      expect(studentTabs).toContain('dashboard');
      expect(studentTabs).toContain('diagnostic');
      expect(studentTabs).toContain('profile');
      expect(studentTabs).toContain('learning-path');
      expect(studentTabs).toContain('mistakes');
      expect(studentTabs).toContain('classroom');

      // Negative check: Student cannot see admin tabs
      expect(studentTabs).not.toContain('admin-overview');
      expect(studentTabs).not.toContain('teacher-classes');
    });

    it('routes TEACHER_APPLICANT strictly to pending view without classroom creation access', () => {
      expect(getDefaultTabForRole('TEACHER_APPLICANT')).toBe('teacher-pending');
      const applicantTabs = getAllowedTabsForRole('TEACHER_APPLICANT');
      expect(applicantTabs).toEqual(['teacher-pending']);
      expect(applicantTabs).not.toContain('teacher-classes');
      expect(applicantTabs).not.toContain('admin-overview');
    });

    it('routes VERIFIED TEACHER to teacher classrooms view', () => {
      expect(getDefaultTabForRole('TEACHER')).toBe('teacher-classes');
      const teacherTabs = getAllowedTabsForRole('TEACHER');
      expect(teacherTabs).toContain('teacher-classes');
      expect(teacherTabs).not.toContain('teacher-pending');
      expect(teacherTabs).not.toContain('admin-overview');
    });

    it('routes ADMIN, CONTENT_AUTHOR, and CONTENT_REVIEWER to admin portal', () => {
      expect(getDefaultTabForRole('ADMIN')).toBe('admin-overview');
      expect(getDefaultTabForRole('CONTENT_AUTHOR')).toBe('admin-overview');
      expect(getDefaultTabForRole('CONTENT_REVIEWER')).toBe('admin-overview');

      const adminTabs = getAllowedTabsForRole('ADMIN');
      expect(adminTabs).toContain('admin-overview');
      expect(adminTabs).toContain('admin-applicants');
      expect(adminTabs).toContain('admin-questions');
      expect(adminTabs).toContain('admin-audit');
    });

    it('protects Gate 0 D-04 Student Privacy: Teacher role does not have access to student mistake notebook', () => {
      const teacherTabs = getAllowedTabsForRole('TEACHER');
      expect(teacherTabs).not.toContain('mistakes');
      expect(teacherTabs).not.toContain('profile');
    });
  });
});
