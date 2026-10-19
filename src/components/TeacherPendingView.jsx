import React, { useState } from 'react';
import { Clock, ShieldAlert, CheckCircle2, RefreshCw, Mail, School, MapPin, Edit3, Send, ShieldCheck, AlertCircle } from 'lucide-react';
import { authApi } from '../lib/apiClient';

export default function TeacherPendingView({ currentUser, onRefreshUser }) {
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const teacherProfile = currentUser?.teacherProfile || {};
  const status = teacherProfile.verificationStatus || 'PENDING_REVIEW';
  const rejectionReason = teacherProfile.rejectionReason;

  // Form state for re-application or editing profile
  const [isEditing, setIsEditing] = useState(status === 'REJECTED');
  const [schoolName, setSchoolName] = useState(teacherProfile.schoolName || '');
  const [city, setCity] = useState(teacherProfile.city || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    setMessage('');
    setErrorMessage('');
    try {
      const data = await authApi.getMe();
      if (data.user) {
        onRefreshUser(data.user);
        if (data.user.role === 'TEACHER') {
          setMessage('Chúc mừng! Hồ sơ của bạn đã được phê duyệt thành công.');
        } else if (data.user.teacherProfile?.verificationStatus === 'REJECTED') {
          setMessage('Hồ sơ của bạn đã bị từ chối phê duyệt. Vui lòng cập nhật thông tin và nộp lại.');
          setIsEditing(true);
        } else {
          setMessage('Hồ sơ vẫn đang trong quá trình thẩm định của Ban Quản trị.');
        }
      }
    } catch {
      setErrorMessage('Không thể kiểm tra trạng thái. Vui lòng thử lại sau.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleResubmit = async (e) => {
    e.preventDefault();
    if (!schoolName.trim() || !city.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ Trường công tác và Tỉnh / Thành phố.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    setErrorMessage('');

    try {
      const res = await authApi.updateTeacherProfile({
        schoolName: schoolName.trim(),
        city: city.trim()
      });

      if (res.user) {
        onRefreshUser(res.user);
        setMessage('Đã cập nhật hồ sơ và gửi lại yêu cầu thẩm định thành công! Ban Quản trị sẽ xem xét lại hồ sơ.');
        setIsEditing(false);
      }
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi nộp lại hồ sơ.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pastel-pending-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e4e2ea',
          borderRadius: '16px',
          padding: '36px 30px',
          boxShadow: 'var(--bento-shadow)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '24px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              backgroundColor: status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {status === 'REJECTED' ? (
              <ShieldAlert size={28} color="#dc2626" />
            ) : (
              <Clock size={28} color="#d97706" />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
                {status === 'REJECTED' ? 'Hồ sơ Giáo viên Cần Cập Nhật & Nộp Lại' : 'Hồ sơ Đang Chờ Phê Duyệt'}
              </h1>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                  color: status === 'REJECTED' ? '#991b1b' : '#92400e'
                }}
              >
                {status === 'REJECTED' ? 'TỪ CHỐI DUYỆT' : 'PENDING REVIEW'}
              </span>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#475569', marginTop: '6px', lineHeight: 1.5 }}>
              {status === 'REJECTED'
                ? 'Hồ sơ đăng ký của thầy/cô chưa đủ điều kiện thẩm định. Thầy/cô có thể chỉnh sửa thông tin trường công tác bên dưới và bấm "Cập nhật & Nộp lại" để Ban Quản trị thẩm định lại.'
                : 'Cảm ơn thầy/cô đã đăng ký tham gia giảng dạy trên AdaptiveMath. Để đảm bảo an toàn thông tin và quyền riêng tư cho học sinh theo quy định, Ban Quản trị cần thẩm định hồ sơ công tác trước khi mở quyền tạo lớp.'}
            </p>
          </div>
        </div>

        {/* Rejection notice if rejected */}
        {status === 'REJECTED' && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '24px'
            }}
          >
            <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} /> Lý do từ chối thẩm định:
            </div>
            <div style={{ fontSize: '0.9rem', color: '#7f1d1d' }}>
              {rejectionReason || 'Thông tin đơn vị công tác chưa khớp với dữ liệu thẩm tra.'}
            </div>
          </div>
        )}

        {/* Form to update and resubmit profile */}
        {isEditing ? (
          <form
            onSubmit={handleResubmit}
            data-testid="teacher-resubmit-form"
            style={{
              backgroundColor: '#f8fafc',
              border: '1.5px solid #0284c7',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={18} color="#0284c7" />
                <span>Cập nhật thông tin giảng dạy</span>
              </div>
              {status !== 'REJECTED' && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    fontSize: '0.8rem',
                    color: '#64748b',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Hủy chỉnh sửa
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Trường công tác *
                </label>
                <div style={{ position: 'relative' }}>
                  <School size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                  <input
                    type="text"
                    data-testid="input-school-name"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="VD: THPT Chuyên Hà Nội - Amsterdam"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 34px',
                      fontSize: '0.88rem',
                      borderRadius: '16px',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Tỉnh / Thành phố *
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                  <input
                    type="text"
                    data-testid="input-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="VD: Hà Nội"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 34px',
                      fontSize: '0.88rem',
                      borderRadius: '16px',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="submit"
                data-testid="btn-resubmit-teacher-profile"
                disabled={isSubmitting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  backgroundColor: '#293b35',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                <Send size={16} />
                <span>{isSubmitting ? 'Đang gửi lại...' : 'Cập nhật & Nộp lại hồ sơ thẩm định'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* View current info */
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '18px 20px',
              marginBottom: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Thông tin hồ sơ đăng ký
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#034b75',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={14} /> Chỉnh sửa
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <School size={16} color="#0f766e" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Trường công tác</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' }}>
                    {teacherProfile.schoolName || 'Chưa cung cấp'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} color="#0f766e" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Tỉnh / Thành phố</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' }}>
                    {teacherProfile.city || 'Chưa cung cấp'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="#0f766e" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Email liên hệ</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' }}>
                    {currentUser?.email || 'Chưa cung cấp'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Protection and Privacy Note */}
        <div
          style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px'
          }}
        >
          <div style={{ fontWeight: 700, color: '#166534', fontSize: '0.88rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} /> Chính sách bảo vệ dữ liệu giáo viên (Nghị định 13/2023/NĐ-CP)
          </div>
          <p style={{ fontSize: '0.82rem', color: '#14532d', lineHeight: 1.5, margin: 0 }}>
            Hệ thống <strong>không thu thập bản chụp CCCD/CMND</strong> qua biểu mẫu web nhằm giảm thiểu tối đa rủi ro bảo mật dữ liệu nhạy cảm. Thẩm định tư cách giảng dạy được thực hiện an toàn qua xác minh email miền trường học và danh bạ ngành giáo dục.
          </p>
        </div>

        {/* Governance & Privacy Notice (Gate 0 D-03) */}
        <div
          style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '26px'
          }}
        >
          <div style={{ fontWeight: 700, color: '#1e40af', fontSize: '0.88rem', marginBottom: '6px' }}>
            Quy trình phê duyệt nghiêm ngặt (Quality Gate D-03)
          </div>
          <p style={{ fontSize: '0.82rem', color: '#1e3a8a', lineHeight: 1.5, margin: 0 }}>
            Theo Quy chuẩn Quản trị Hệ thống, tài khoản giáo viên chưa được thẩm định <strong>không thể tạo lớp học, không thể sinh mã mời và không thể truy cập dữ liệu học sinh</strong>. Sau khi Quản trị viên duyệt, tài khoản sẽ tự động chuyển sang vai trò Giáo viên chính thức.
          </p>
        </div>

        {/* Feedback message */}
        {message && (
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: '16px',
              color: '#166534',
              fontSize: '0.88rem',
              marginBottom: '20px'
            }}
          >
            {message}
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '16px',
              color: '#991b1b',
              fontSize: '0.88rem',
              marginBottom: '20px'
            }}
          >
            {errorMessage}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleCheckStatus}
            disabled={isChecking}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#047857',
              color: '#ffffff',
              border: 'none',
              borderRadius: '16px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={16} className={isChecking ? 'animate-spin' : ''} />
            <span>{isChecking ? 'Đang kiểm tra...' : 'Kiểm tra trạng thái duyệt'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
