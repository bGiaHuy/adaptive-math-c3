export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'q1',
    chapter: 'Căn bậc hai và căn bậc ba',
    topic: 'Biến đổi và phép tính với căn thức',
    level: 'Nhận biết',
    type: 'Trắc nghiệm',
    source: 'Biên soạn mới theo SGK Toán Kết nối tri thức với cuộc sống và Chương trình GDPT 2018.',
    content: 'Rút gọn \\sqrt{245} được',
    options: [
      { id: 'A', text: '\\sqrt{35}' },
      { id: 'B', text: '7\\sqrt{5}' },
      { id: 'C', text: '5\\sqrt{7}' },
      { id: 'D', text: '49\\sqrt{5}' }
    ],
    correctAnswer: 'B',
    explanation: 'Ta có $245 = 49 \\times 5 = 7^2 \\times 5$. Do đó $\\sqrt{245} = \\sqrt{7^2 \\times 5} = 7\\sqrt{5}$.',
    selectionReason: {
      title: 'Giai đoạn phổ độ: vị trí tiêu chí để được chọn hỏi lần nào.',
      description: 'Thuật toán thích ứng CAT (Computerized Adaptive Testing) dựa trên mô hình IRT ước lượng năng lực θ. Câu hỏi nhận biết về căn thức được chọn làm câu thăm dò đầu tiên cho mục tiêu củng cố kiến thức Toán THPT.',
      table: [
        { topic: 'Biến đổi và phép tính với căn thức', count: '0 lượt', level: 'mức N' },
        { topic: 'Tỉ số lượng giác của góc nhọn', count: '0 lượt', level: 'mức N' },
        { topic: 'Phương trình bậc nhất hai ẩn và hệ', count: '0 lượt', level: 'mức N' }
      ]
    }
  },
  {
    id: 'q2',
    chapter: 'Phương trình và hệ hai phương trình bậc nhất hai ẩn',
    topic: 'Giải hệ hai phương trình bậc nhất hai ẩn',
    level: 'Thông hiểu',
    type: 'Trắc nghiệm',
    source: 'Biên soạn mới theo SGK Toán Kết nối tri thức với cuộc sống và Chương trình GDPT 2018.',
    content: 'Nghiệm của hệ phương trình \\begin{cases} 2x + y = 5 \\\\ x - y = 1 \\end{cases} là cặp số (x; y):',
    options: [
      { id: 'A', text: '(2;\\, 1)' },
      { id: 'B', text: '(1;\\, 2)' },
      { id: 'C', text: '(3;\\, -1)' },
      { id: 'D', text: '(2;\\, 3)' }
    ],
    correctAnswer: 'A',
    explanation: 'Cộng hai vế ta được $(2x+y) + (x-y) = 5+1 \\implies 3x = 6 \\implies x = 2$. Thay vào phương trình thứ hai $2 - y = 1 \\implies y = 1$.',
    selectionReason: {
      title: 'Xác minh độ hiểu sau câu nhận biết căn thức thành công.',
      description: 'Học sinh đạt đúng ở mức Nhận biết, hệ thống nâng mức câu hỏi lên Thông hiểu trong chủ đề bạn đã đánh dấu quan tâm.',
      table: [
        { topic: 'Giải hệ hai phương trình bậc nhất hai ẩn', count: '0 lượt', level: 'mức TH' },
        { topic: 'Phương trình bậc nhất hai ẩn và hệ', count: '0 lượt', level: 'mức TH' }
      ]
    }
  },
  {
    id: 'q3',
    chapter: 'Hệ thức lượng trong tam giác vuông',
    topic: 'Tỉ số lượng giác của góc nhọn',
    level: 'Vận dụng',
    type: 'Trắc nghiệm',
    source: 'Biên soạn mới theo SGK Toán Kết nối tri thức với cuộc sống và Chương trình GDPT 2018.',
    content: 'Cho tam giác ABC vuông tại A có AB = 6\\text{ cm}, AC = 8\\text{ cm}. Giá trị \\sin B bằng:',
    options: [
      { id: 'A', text: '\\frac{3}{5}' },
      { id: 'B', text: '\\frac{4}{5}' },
      { id: 'C', text: '\\frac{3}{4}' },
      { id: 'D', text: '\\frac{4}{3}' }
    ],
    correctAnswer: 'B',
    explanation: 'Áp dụng định lý Pythagoras: $BC = \\sqrt{AB^2 + AC^2} = \\sqrt{6^2 + 8^2} = 10\\text{ cm}$. Khi đó $\\sin B = \\frac{AC}{BC} = \\frac{8}{10} = \\frac{4}{5}$.',
    selectionReason: {
      title: 'Đánh giá độ sâu hình học mức Vận dụng.',
      description: 'Học sinh đã trả lời đúng 2 câu liên tiếp, hệ thống kiểm tra khả năng tích hợp định lý Pythagoras và tỉ số lượng giác.',
      table: [
        { topic: 'Tỉ số lượng giác của góc nhọn', count: '0 lượt', level: 'mức VD' },
        { topic: 'Hệ thức lượng trong tam giác vuông', count: '0 lượt', level: 'mức VD' }
      ]
    }
  }
];
