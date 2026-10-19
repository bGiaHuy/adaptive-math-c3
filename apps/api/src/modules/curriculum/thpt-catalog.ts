// Catalogue IDs are curriculum references, never database SkillNode IDs.
export const LEGACY_BANK_PAUSED = true;
export const THPT_BOOK = 'Kết nối tri thức với cuộc sống';
export const THPT_CURRICULUM = [
  { grade: 10, chapters: [
    ['Mệnh đề và tập hợp', ['Mệnh đề', 'Tập hợp và các phép toán trên tập hợp']],
    ['Bất phương trình và hệ bất phương trình bậc nhất hai ẩn', ['Bất phương trình bậc nhất hai ẩn', 'Hệ bất phương trình bậc nhất hai ẩn']],
    ['Hệ thức lượng trong tam giác', ['Giá trị lượng giác của góc từ 0° đến 180°', 'Hệ thức lượng và giải tam giác']],
    ['Vectơ', ['Tổng và hiệu của hai vectơ', 'Tích của vectơ với một số', 'Vectơ trong mặt phẳng tọa độ', 'Tích vô hướng của hai vectơ']],
    ['Các số đặc trưng của mẫu số liệu không ghép nhóm', ['Số gần đúng và sai số', 'Các số đặc trưng đo xu thế trung tâm', 'Các số đặc trưng đo độ phân tán']],
    ['Hàm số, đồ thị và ứng dụng', ['Hàm số và hàm số bậc hai', 'Dấu của tam thức bậc hai', 'Phương trình quy về phương trình bậc hai']],
    ['Phương pháp tọa độ trong mặt phẳng', ['Phương trình đường thẳng', 'Vị trí tương đối, góc và khoảng cách', 'Đường tròn', 'Ba đường conic']],
    ['Đại số tổ hợp', ['Quy tắc đếm', 'Hoán vị, chỉnh hợp và tổ hợp', 'Nhị thức Newton']],
    ['Tính xác suất theo định nghĩa cổ điển', ['Biến cố và định nghĩa cổ điển của xác suất', 'Thực hành tính xác suất']]
  ], electives: ['Hệ phương trình bậc nhất ba ẩn', 'Phương pháp quy nạp toán học. Nhị thức Newton', 'Ba đường conic và ứng dụng'] },
  { grade: 11, chapters: [
    ['Hàm số lượng giác và phương trình lượng giác', ['Giá trị lượng giác của góc lượng giác', 'Công thức lượng giác', 'Hàm số lượng giác', 'Phương trình lượng giác cơ bản']],
    ['Dãy số. Cấp số cộng và cấp số nhân', ['Dãy số', 'Cấp số cộng', 'Cấp số nhân']],
    ['Các số đặc trưng đo xu thế trung tâm của mẫu số liệu ghép nhóm', ['Mẫu số liệu ghép nhóm', 'Trung bình, trung vị, tứ phân vị và mốt']],
    ['Đường thẳng và mặt phẳng trong không gian. Quan hệ song song', ['Đường thẳng và mặt phẳng', 'Hai đường thẳng song song', 'Đường thẳng song song với mặt phẳng', 'Hai mặt phẳng song song', 'Phép chiếu song song']],
    ['Giới hạn. Hàm số liên tục', ['Giới hạn của dãy số', 'Giới hạn của hàm số', 'Hàm số liên tục']],
    ['Hàm số mũ và hàm số lôgarit', ['Lũy thừa với số mũ thực', 'Lôgarit', 'Hàm số mũ và hàm số lôgarit', 'Phương trình, bất phương trình mũ và lôgarit']],
    ['Quan hệ vuông góc trong không gian', ['Hai đường thẳng vuông góc', 'Đường thẳng vuông góc với mặt phẳng', 'Phép chiếu vuông góc. Góc giữa đường thẳng và mặt phẳng', 'Hai mặt phẳng vuông góc', 'Khoảng cách', 'Thể tích']],
    ['Các quy tắc tính xác suất', ['Biến cố hợp, giao và độc lập', 'Công thức cộng xác suất', 'Công thức nhân xác suất cho hai biến cố độc lập']],
    ['Đạo hàm', ['Định nghĩa và ý nghĩa của đạo hàm', 'Các quy tắc tính đạo hàm', 'Đạo hàm cấp hai']]
  ], electives: ['Phép biến hình trong mặt phẳng', 'Làm quen với một vài khái niệm của lí thuyết đồ thị', 'Một số yếu tố vẽ kĩ thuật'] },
  { grade: 12, chapters: [
    ['Ứng dụng đạo hàm để khảo sát và vẽ đồ thị của hàm số', ['Tính đơn điệu và cực trị', 'Giá trị lớn nhất và giá trị nhỏ nhất', 'Đường tiệm cận', 'Khảo sát và vẽ đồ thị hàm số', 'Ứng dụng đạo hàm giải quyết vấn đề thực tiễn']],
    ['Vectơ và hệ trục tọa độ trong không gian', ['Vectơ trong không gian', 'Hệ trục tọa độ trong không gian', 'Biểu thức tọa độ của các phép toán vectơ']],
    ['Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm', ['Khoảng biến thiên và khoảng tứ phân vị', 'Phương sai và độ lệch chuẩn']],
    ['Nguyên hàm và tích phân', ['Nguyên hàm', 'Tích phân', 'Ứng dụng hình học của tích phân']],
    ['Phương pháp tọa độ trong không gian', ['Phương trình mặt phẳng', 'Phương trình đường thẳng trong không gian', 'Công thức tính góc trong không gian', 'Phương trình mặt cầu']],
    ['Xác suất có điều kiện', ['Xác suất có điều kiện', 'Công thức xác suất toàn phần và công thức Bayes']]
  ], electives: ['Biến ngẫu nhiên rời rạc. Các số đặc trưng của biến ngẫu nhiên rời rạc', 'Ứng dụng toán học để giải quyết một số bài toán tối ưu', 'Ứng dụng toán học trong một số vấn đề liên quan đến tài chính'] }
].map(level => ({ ...level, chapters: level.chapters.map(([title, topics], index) => ({
  id: `KNTT-${level.grade}-C${String(index + 1).padStart(2, '0')}`,
  title: title as string,
  topics: (topics as string[]).map((name, topicIndex) => ({ id: `KNTT-${level.grade}-C${String(index + 1).padStart(2, '0')}-T${String(topicIndex + 1).padStart(2, '0')}`, title: name }))
})) }));
