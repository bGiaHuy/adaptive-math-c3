export const GRADES_DATA = [
  { id: 'grade10', label: 'Lớp 10', desc: '9 chương SGK Kết nối tri thức' },
  { id: 'grade11', label: 'Lớp 11', desc: '9 chương SGK Kết nối tri thức' },
  { id: 'grade12', label: 'Lớp 12', desc: '6 chương SGK Kết nối tri thức' }
];

export const GOALS_DATA = [
  {
    id: 'midterm',
    title: 'Ôn thi giữa kỳ',
    desc: 'Tập trung trên nửa học kỳ gần nhất.',
    targetMastery: '75%'
  },
  {
    id: 'finalterm',
    title: 'Ôn thi cuối kỳ',
    desc: 'Phủ toàn bộ chương trình học kỳ.',
    targetMastery: '80%'
  },
  {
    id: 'university',
    title: 'Ôn thi đại học',
    desc: 'Dành cho lớp 12: củng cố kiến thức và luyện mục tiêu xét tuyển đại học.',
    minGrade: 12,
    targetMastery: '85%'
  },
  {
    id: 'advanced_hsg',
    title: 'Học nâng cao / HSG',
    desc: 'Tiến xa hơn chương trình chuẩn, bài khó.',
    targetMastery: '95%'
  }
];

export const DAILY_TIMES_DATA = [
  { id: '30m', title: '30 phút', desc: 'Nhẹ nhàng, duy trì nhịp học.' },
  { id: '45m', title: '45 phút', desc: 'Phù hợp đa số học sinh.' },
  { id: '60m', title: '60 phút', desc: 'Tiến độ nhanh, rõ kết quả.' },
  { id: '90m', title: '90 phút', desc: 'Tập trung ôn thi, cường độ cao.' }
];

export const SELF_EVALUATIONS_DATA = [
  {
    id: 'weak',
    title: 'Yếu',
    desc: 'Còn hổng nhiều kiến thức nền, cần bắt đầu lại từ cơ bản.'
  },
  {
    id: 'average',
    title: 'Trung bình',
    desc: 'Nắm được căn bản, nhưng chưa vững khi gặp bài khó.'
  },
  {
    id: 'good',
    title: 'Khá',
    desc: 'Làm tốt bài cơ bản, đang hướng tới mức vận dụng cao.'
  },
  {
    id: 'excellent',
    title: 'Giỏi',
    desc: 'Tự tin mọi dạng, muốn luyện chuyên sâu.'
  }
];
