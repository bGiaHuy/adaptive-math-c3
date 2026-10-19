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
    id: 'graduation',
    title: 'Ôn thi tốt nghiệp THPT',
    desc: 'Củng cố kiến thức THPT và luyện theo cấu trúc đề hiện có.',
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

export const GRADE_9_CHAPTERS = [
  {
    id: 'ch1',
    name: 'PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN',
    topics: [
      { id: 't1', title: 'Phương trình bậc nhất hai ẩn và hệ phương trình' },
      { id: 't2', title: 'Giải hệ hai phương trình bậc nhất hai ẩn' },
      { id: 't3', title: 'Giải bài toán bằng cách lập hệ phương trình' }
    ]
  },
  {
    id: 'ch2',
    name: 'PHƯƠNG TRÌNH VÀ BẤT PHƯƠNG TRÌNH BẬC NHẤT MỘT ẨN',
    topics: [
      { id: 't4', title: 'Phương trình quy về phương trình bậc nhất một ẩn' },
      { id: 't5', title: 'Bất đẳng thức và tính chất' },
      { id: 't6', title: 'Bất phương trình bậc nhất một ẩn' }
    ]
  },
  {
    id: 'ch3',
    name: 'CĂN BẬC HAI VÀ CĂN BẬC BA',
    topics: [
      { id: 't7', title: 'Căn bậc hai và căn bậc ba' },
      { id: 't8', title: 'Biến đổi và phép tính với căn thức' }
    ]
  },
  {
    id: 'ch4',
    name: 'HỆ THỨC LƯỢNG TRONG TAM GIÁC VUÔNG',
    topics: [
      { id: 't9', title: 'Tỉ số lượng giác của góc nhọn' },
      { id: 't10', title: 'Hệ thức giữa cạnh và góc trong tam giác vuông' }
    ]
  },
  {
    id: 'ch5',
    name: 'ĐƯỜNG TRÒN',
    topics: [
      { id: 't11', title: 'Đường tròn và vị trí tương đối' },
      { id: 't12', title: 'Tiếp tuyến của đường tròn' },
      { id: 't13', title: 'Góc ở tâm, góc nội tiếp và cung' }
    ]
  },
  {
    id: 'ch6',
    name: 'HÀM SỐ y = ax² VÀ PHƯƠNG TRÌNH BẬC HAI MỘT ẨN',
    topics: [
      { id: 't14', title: 'Hàm số y = ax² (a ≠ 0)' },
      { id: 't15', title: 'Phương trình bậc hai một ẩn' },
      { id: 't16', title: 'Định lí Viète và ứng dụng' }
    ]
  },
  {
    id: 'ch7',
    name: 'TẦN SỐ VÀ TẦN SỐ TƯƠNG ĐỐI',
    topics: [
      { id: 't17', title: 'Bảng tần số, biểu đồ tần số' }
    ]
  },
  {
    id: 'ch8',
    name: 'XÁC SUẤT CỦA BIẾN CỐ TRONG MỘT SỐ MÔ HÌNH XÁC SUẤT ĐƠN GIẢN',
    topics: [
      { id: 't18', title: 'Xác suất của biến cố trong một số mô hình' }
    ]
  }
];
