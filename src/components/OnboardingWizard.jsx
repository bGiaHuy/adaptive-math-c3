import { THPT_CURRICULUM } from '../data/thptCurriculum';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Calendar, Trash2, Loader2 } from 'lucide-react';
import Navbar from './Navbar';
import {
  GRADES_DATA,
  GOALS_DATA,
  DAILY_TIMES_DATA,
  SELF_EVALUATIONS_DATA
} from '../data/curriculumData';
import { curriculumApi, studentApi } from '../lib/apiClient';

export default function OnboardingWizard({
  currentUser,
  onComplete,
  onCancel,
  onStepChange
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Dynamic Curriculum Options
  const [grades, setGrades] = useState(GRADES_DATA);
  const [goals, setGoals] = useState(GOALS_DATA);
  const [dailyTimes, setDailyTimes] = useState(DAILY_TIMES_DATA);
  const [selfEvals, setSelfEvals] = useState(SELF_EVALUATIONS_DATA);

  // Form State initialized to match the video flow defaults
  const [selectedGrade, setSelectedGrade] = useState('grade10');
  const [selectedGoal, setSelectedGoal] = useState('graduation');
  const [selectedDailyTime, setSelectedDailyTime] = useState('45m');
  const [examDate, setExamDate] = useState('05/06/2027');
  const [selfEval, setSelfEval] = useState('good');
  const [weakTopics, setWeakTopics] = useState([]);

  const totalSteps = 8;

  useEffect(() => {
    const loadCurriculumOptions = async () => {
      try {
        const [gradesData, optionsData] = await Promise.all([
          curriculumApi.getGrades(),
          curriculumApi.getOptions()
        ]);
        if (Array.isArray(gradesData) && gradesData.length > 0) {
          setGrades(gradesData.map((g) => ({ id: `grade${g.id}`, rawId: g.id, label: g.label, desc: g.desc })));
        }
        if (optionsData?.goals) {
          setGoals(optionsData.goals);
        }
        if (optionsData?.dailyTimes) {
          setDailyTimes(optionsData.dailyTimes);
        }
        if (optionsData?.selfAssessments) {
          setSelfEvals(optionsData.selfAssessments);
        }
      } catch {
        // Safe fallback to default data
      }
    };
    loadCurriculumOptions();
  }, []);

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep, totalSteps);
    } else {
      // Step 8 completed -> sync to backend via PATCH /student/onboarding
      setIsSubmitting(true);
      setSaveError('');
      const chosenGoal = goals.find((g) => g.id === selectedGoal)?.title || 'Ôn thi tốt nghiệp THPT';
      const chosenTimeObj = dailyTimes.find((t) => t.id === selectedDailyTime);
      const chosenMinutes = chosenTimeObj?.minutes || (selectedDailyTime === '30m' ? 30 : selectedDailyTime === '60m' ? 60 : selectedDailyTime === '90m' ? 90 : 45);
      const chosenSelfEval = selfEvals.find((e) => e.id === selfEval)?.title || 'Khá';

      const setupProfile = {
        grade: Number(selectedGrade.replace('grade', '')),
        targetGoal: chosenGoal,
        dailyMinutes: chosenMinutes,
        examDate: examDate || null,
        selfAssessment: chosenSelfEval
      };

      try {
        const saved = await studentApi.updateOnboarding(setupProfile);
        onComplete({
          ...saved.profile,
          ...setupProfile,
          userId: currentUser?.id,
          gradeLabel: `Lớp ${setupProfile.grade}`,
          weakTopicsList: weakTopics,
          weakTopicsCount: weakTopics.length
        });
      } catch (err) { setSaveError(err.message || 'Chưa lưu được hồ sơ. Hãy thử lại.'); }
      finally { setIsSubmitting(false); }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep, totalSteps);
    } else {
      onCancel();
    }
  };

  const toggleTopic = (topicId) => {
    if (weakTopics.includes(topicId)) {
      setWeakTopics(weakTopics.filter((id) => id !== topicId));
    } else {
      setWeakTopics([...weakTopics, topicId]);
    }
  };

  // Helper to calculate days remaining from date string DD/MM/YYYY
  const getDaysRemaining = (dateStr) => {
    if (!dateStr || dateStr.length < 8) return null;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const target = new Date(year, month, day, 23, 59, 59);
      const now = new Date();
      const diffTime = target - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 ? diffDays : 0;
    }
    return null;
  };

  return (
    <div className="wizard-content-wrapper">
      <div className="wizard-card-box animate-fade-in" key={currentStep}>
          <div className="wizard-step-tag">Bước {currentStep} / {totalSteps}</div>

          {/* STEP 1: Introduction */}
          {currentStep === 1 && (
            <div className="step-body">
              <h2 className="step-title">Chào bạn!</h2>
              <p className="step-desc-lead">
                Thiết lập hồ sơ Toán THPT lớp 10, 11, 12 theo bộ Kết nối tri thức với cuộc sống. Chọn mục tiêu và nhịp học; bài kiểm tra đầu vào sẽ mở khi kho câu hỏi THPT được kiểm duyệt.
              </p>

              <div className="step-bullets-list">
                <div className="bullet-row">
                  <div className="bullet-dot"></div>
                  <span>Hồ sơ được lưu vào tài khoản sau khi bạn xác nhận.</span>
                </div>
                <div className="bullet-row">
                  <div className="bullet-dot"></div>
                  <span>Khám phá 24 chương SGK; kho câu hỏi THPT đang được chuẩn bị.</span>
                </div>
                <div className="bullet-row">
                  <div className="bullet-dot"></div>
                  <span>Bạn có thể sửa lại thiết lập bất cứ lúc nào.</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Grade Selection */}
          {currentStep === 2 && (
            <div className="step-body">
              <h2 className="step-title">Bạn đang học lớp mấy?</h2>
              <p className="step-subtitle">
                Ngân hàng câu hỏi và lộ trình sẽ bám theo lớp bạn chọn.
              </p>

              <div className="options-grid-2col">
                {grades.map((grade) => {
                  const isSelected = selectedGrade === grade.id;
                  return (
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      key={grade.id}
                      className={`selection-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => { setSelectedGrade(grade.id); setWeakTopics([]); }}
                    >
                      <div className="radio-circle">
                        {isSelected && <div className="radio-inner-dot" />}
                      </div>
                      <div className="selection-card-text">
                        <div className="card-label-main">{grade.label}</div>
                        <div className="card-label-sub">{grade.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Goal Selection */}
          {currentStep === 3 && (
            <div className="step-body">
              <h2 className="step-title">Mục tiêu của bạn là gì?</h2>
              <p className="step-subtitle">
                Mục tiêu quyết định mức thành thạo mà lộ trình hướng tới cho mỗi chủ đề.
              </p>

              <div className="options-list-vertical">
                {GOALS_DATA.map((goal) => {
                  const isSelected = selectedGoal === goal.id;
                  return (
                    <div
                      key={goal.id}
                      className={`selection-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedGoal(goal.id)}
                    >
                      <div className="radio-circle">
                        {isSelected && <div className="radio-inner-dot" />}
                      </div>
                      <div className="selection-card-text">
                        <div className="card-label-main">{goal.title}</div>
                        <div className="card-label-sub">{goal.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedGoal && (
                <div className="step-info-notice">
                  <span>Mức thành thạo mục tiêu: <strong>85%</strong> cho mỗi chủ đề.</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Daily Learning Time */}
          {currentStep === 4 && (
            <div className="step-body">
              <h2 className="step-title">Mỗi ngày bạn học được bao lâu?</h2>
              <p className="step-subtitle">
                Lộ trình sẽ xếp bài vào đúng quỹ thời gian này.
              </p>

              <div className="options-grid-2col">
                {DAILY_TIMES_DATA.map((item) => {
                  const isSelected = selectedDailyTime === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`selection-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedDailyTime(item.id)}
                    >
                      <div className="radio-circle">
                        {isSelected && <div className="radio-inner-dot" />}
                      </div>
                      <div className="selection-card-text">
                        <div className="card-label-main">{item.title}</div>
                        <div className="card-label-sub">{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Exam Milestone Date */}
          {currentStep === 5 && (
            <div className="step-body">
              <h2 className="step-title">Bạn có mốc thi nào không?</h2>
              <p className="step-subtitle">
                Không bắt buộc. Nếu có, hệ thống sẽ tự động ưu tiên cho các chủ đề còn yếu khi ngày thi đến gần.
              </p>

              <div className="exam-date-box">
                <label className="input-group-label">Ngày thi (ngày/tháng/năm)</label>
                <div className="date-input-wrapper">
                  <input
                    type="text"
                    className="form-input date-input"
                    placeholder="dd/mm/yyyy"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                  />
                  <Calendar size={18} className="date-input-icon" />
                </div>

                {examDate && (
                  <div className="exam-date-status-row">
                    <span className="exam-days-tag">Còn {getDaysRemaining(examDate)} ngày</span>
                    <span className="exam-date-confirm">Ngày thi: {examDate}</span>
                    <button
                      type="button"
                      className="btn-clear-date"
                      onClick={() => setExamDate('')}
                    >
                      Xoá ngày
                    </button>
                  </div>
                )}

                <p className="date-helper-note">
                  Bỏ trống nếu bạn học đều, không theo mốc thi cụ thể.
                </p>
              </div>
            </div>
          )}

          {/* STEP 6: Self Assessment */}
          {currentStep === 6 && (
            <div className="step-body">
              <h2 className="step-title">Bạn tự đánh giá mình thế nào?</h2>
              <p className="step-subtitle">
                Chỉ dùng để chọn câu hỏi đầu tiên cho phù hợp — bài kiểm tra sẽ tự điều chỉnh sau đó.
              </p>

              <div className="options-list-vertical">
                {SELF_EVALUATIONS_DATA.map((evalItem) => {
                  const isSelected = selfEval === evalItem.id;
                  return (
                    <div
                      key={evalItem.id}
                      className={`selection-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelfEval(evalItem.id)}
                    >
                      <div className="radio-circle">
                        {isSelected && <div className="radio-inner-dot" />}
                      </div>
                      <div className="selection-card-text">
                        <div className="card-label-main">{evalItem.title}</div>
                        <div className="card-label-sub">{evalItem.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: Weak Topics Selection */}
          {currentStep === 7 && (
            <div className="step-body">
              <h2 className="step-title">Chủ đề nào bạn thấy khó?</h2>
              <p className="step-subtitle">
                Không bắt buộc — chọn bao nhiêu tuỳ bạn. Những chủ đề này được cộng thêm độ ưu tiên trong lộ trình.
              </p>

              <div className="topics-category-container">
                {(THPT_CURRICULUM.find(level => level.grade === Number(selectedGrade.replace('grade', '')))?.chapters || []).map((chapter) => (
                  <div key={chapter.id} className="chapter-group">
                    <h4 className="chapter-heading">{chapter.title}</h4>
                    <div className="topic-chips-grid">
                      {chapter.topics.map((topic) => {
                        const isChecked = weakTopics.includes(topic.id);
                        return (
                          <button
                            type="button"
                            aria-pressed={isChecked}
                            key={topic.id}
                            className={`topic-chip ${isChecked ? 'active' : ''}`}
                            onClick={() => toggleTopic(topic.id)}
                          >
                            {isChecked && <Check size={14} className="chip-check-icon" />}
                            <span>{topic.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: Review & Confirm */}
          {currentStep === 8 && (
            <div className="step-body">
              <h2 className="step-title">Kiểm tra lại thông tin</h2>
              <p className="step-subtitle">
                Xác nhận xong, bạn sẽ xem danh mục chuyên đề THPT trong khi chờ kho câu hỏi.
              </p>

              <div className="summary-review-table">
                <div className="summary-row">
                  <span className="summary-col-label">Lớp</span>
                  <span className="summary-col-value">
                    {GRADES_DATA.find((g) => g.id === selectedGrade)?.label || 'Lớp 10'}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-col-label">Mục tiêu</span>
                  <span className="summary-col-value">
                    {GOALS_DATA.find((g) => g.id === selectedGoal)?.title || 'Ôn thi tốt nghiệp THPT'}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-col-label">Thời gian mỗi ngày</span>
                  <span className="summary-col-value">
                    {DAILY_TIMES_DATA.find((t) => t.id === selectedDailyTime)?.title || '45 phút'}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-col-label">Ngày thi</span>
                  <span className="summary-col-value">{examDate || 'Chưa đặt'}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-col-label">Tự đánh giá</span>
                  <span className="summary-col-value">
                    {SELF_EVALUATIONS_DATA.find((e) => e.id === selfEval)?.title || 'Khá'}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-col-label">Chủ đề tự thấy yếu</span>
                  <span className="summary-col-value highlight">
                    {weakTopics.length} chủ đề
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons footer */}
          {saveError && <p role="alert" style={{ color: '#922a22', padding: '12px 24px' }}>{saveError}</p>}
          <div className="wizard-card-footer">
            <button
              type="button"
              className="btn-wizard-back"
              onClick={handleBack}
            >
              <ArrowLeft size={16} />
              <span>Quay lại</span>
            </button>

            <button
              type="button"
              className="btn-wizard-next"
              disabled={isSubmitting}
              onClick={handleNext}
            >
              <span>{isSubmitting ? 'Đang lưu hồ sơ…' : currentStep === 8 ? 'Bắt đầu kiểm tra' : 'Tiếp tục'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
  );
}
