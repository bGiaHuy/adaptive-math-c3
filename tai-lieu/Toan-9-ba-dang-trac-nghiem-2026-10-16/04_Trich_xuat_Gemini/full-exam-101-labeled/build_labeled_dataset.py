import json
import csv
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'
dest_dir = os.path.join(root, '04_Trich_xuat_Gemini', 'full-exam-101-labeled')
os.makedirs(dest_dir, exist_ok=True)

# Read base questions
with open(os.path.join(root, '04_Trich_xuat_Gemini', 'full-exam-101', 'questions.jsonl'), 'r', encoding='utf-8') as f:
    base_questions = [json.loads(line) for line in f if line.strip()]

labeled_questions = []

# Definition of classification for each question
classifications = {
    "SRC009-P001-Q001": {
        "knowledgeStrand": "Hình học và đo lường",
        "chapter": "HỆ THỨC LƯỢNG TRONG TAM GIÁC VUÔNG",
        "topic": "Tỉ số lượng giác của góc nhọn",
        "primarySkillCode": "SKILL-07",
        "secondarySkillCodes": [],
        "learningOutcome": "Nhận biết tỉ số lượng giác sin của góc nhọn trong tam giác vuông (cạnh đối bằng nửa cạnh huyền suy ra góc nhọn bằng 30°).",
        "cognitiveLevel": "REMEMBERING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Câu hỏi kiểm tra trực tiếp kiến thức định nghĩa tỉ số lượng giác sin α = 1/2 hoặc tính chất góc 30° trong tam giác vuông, thao tác 1 bước nhớ lại công thức.",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [1],
            "answerPages": [9],
            "referenceSection": "Phần I - Câu 1",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "EASY",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Khớp với Slot 8 trong ma trận blueprint diagnostic (Tỉ số lượng giác và tam giác vuông, REMEMBERING, EASY).",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P001-Q002": {
        "knowledgeStrand": "Hình học và đo lường",
        "chapter": "ĐƯỜNG TRÒN",
        "topic": "Vị trí tương đối của hai đường tròn",
        "primarySkillCode": "SKILL-08",
        "secondarySkillCodes": ["MATH9-CIRCLE-RELATIONS"],
        "learningOutcome": "Xác định được vị trí tương đối của hai đường tròn dựa trên mối quan hệ giữa đoạn nối tâm d và các bán kính R1, R2 (|R1 - R2| < d < R1 + R2).",
        "cognitiveLevel": "UNDERSTANDING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Yêu cầu tính hiệu bán kính |6 - 4| = 2 và tổng bán kính 4 + 6 = 10, đối chiếu bất đẳng thức kép 2 < 6 < 10 để suy ra vị trí cắt nhau tại hai điểm phân biệt; cần hiểu bản chất hệ thức khoảng cách.",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [1],
            "answerPages": [9],
            "referenceSection": "Phần I - Câu 2",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "MEDIUM",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Độ khó biên soạn sư phạm cho câu thông hiểu hệ thức khoảng cách hai đường tròn; chưa qua hiệu chuẩn IRT.",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P001-Q003": {
        "knowledgeStrand": "Đại số và một số yếu tố giải tích",
        "chapter": "PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH",
        "topic": "Phương trình bậc nhất hai ẩn và hệ hai phương trình bậc nhất hai ẩn",
        "primarySkillCode": "SKILL-03",
        "secondarySkillCodes": [],
        "learningOutcome": "Giải hệ hai phương trình bậc nhất hai ẩn bằng phương pháp thế hoặc cộng đại số và tính giá trị của biểu thức tổng x + y.",
        "cognitiveLevel": "UNDERSTANDING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Cần thực hiện thao tác giải hệ phương trình tìm nghiệm (x, y) = (11/5, 1/5) sau đó thực hiện phép cộng phân số để tính x + y = 12/5; vượt mức nhận biết nhận dạng nghiệm.",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [1],
            "answerPages": [9],
            "referenceSection": "Phần I - Câu 3",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "MEDIUM",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Mức độ thông hiểu giải hệ và tính toán phân số; Slot 1 blueprint yêu cầu EASY/REMEMBERING nên câu này có mức độ cao hơn yêu cầu tối thiểu của slot.",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P001-Q004": {
        "knowledgeStrand": "Đại số và một số yếu tố giải tích",
        "chapter": "HÀM SỐ BẬC HAI VÀ PHƯƠNG TRÌNH BẬC HAI",
        "topic": "Phương trình bậc hai một ẩn và định lý Viète",
        "primarySkillCode": "SKILL-05",
        "secondarySkillCodes": ["SKILL-06"],
        "learningOutcome": "Giải phương trình bậc hai một ẩn có biệt thức không chính phương, so sánh thứ tự nghiệm và tính giá trị biểu thức không đối xứng T = 2x1 + x2.",
        "cognitiveLevel": "UNDERSTANDING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Cần tính biệt thức Delta = 29, tìm hai nghiệm vô tỉ (3 ± căn(29))/2, phân biệt nghiệm lớn/nhỏ theo điều kiện x1 > x2 và thay vào biểu thức không đối xứng để rút gọn kết quả.",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [1],
            "answerPages": [9],
            "referenceSection": "Phần I - Câu 4",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "MEDIUM",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Khớp với Slot 7 trong ma trận blueprint diagnostic (Phương trình bậc hai, UNDERSTANDING, MEDIUM).",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P001-Q005": {
        "knowledgeStrand": "Hình học và đo lường",
        "chapter": "ĐƯỜNG TRÒN",
        "topic": "Góc ở tâm và góc nội tiếp đường tròn",
        "primarySkillCode": "SKILL-08",
        "secondarySkillCodes": [],
        "learningOutcome": "Vận dụng mối liên hệ giữa góc ở tâm và góc nội tiếp cùng chắn một cung trong đường tròn để thiết lập và giải phương trình tìm ẩn số đo góc.",
        "cognitiveLevel": "UNDERSTANDING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Cần nhận ra quan hệ BOC = 2 BAC cùng chắn cung BC, thiết lập phương trình bậc nhất 4x - 80 = 2(x - 10) và giải ra x = 30°.",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [1],
            "answerPages": [9],
            "referenceSection": "Phần I - Câu 5",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "MEDIUM",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Độ khó thông hiểu bài toán hình học kết hợp phương trình; Slot 9 blueprint yêu cầu REMEMBERING/EASY nên câu này cao hơn yêu cầu cơ bản của slot.",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P001-Q006": {
        "knowledgeStrand": "Hình học và đo lường",
        "chapter": "ĐƯỜNG TRÒN",
        "topic": "Cung tròn và hình quạt tròn",
        "primarySkillCode": "SKILL-08",
        "secondarySkillCodes": ["MATH9-CIRCULAR-SECTOR"],
        "learningOutcome": "Tính diện tích hình quạt tròn khi biết bán kính R và số đo góc ở tâm n° bằng công thức S = (pi * R^2 * n) / 360.",
        "cognitiveLevel": "REMEMBERING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Áp dụng trực tiếp công thức diện tích hình quạt tròn đã học, thay các giá trị R = 9, n = 40, pi ≈ 3,14 vào tính ra kết quả 28,26 cm².",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [1],
            "answerPages": [9],
            "referenceSection": "Phần I - Câu 6",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "EASY",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Câu hỏi nhận biết và thay số trực tiếp theo công thức; phù hợp độ khó EASY.",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P001-Q007": {
        "knowledgeStrand": "Thống kê và xác suất",
        "chapter": "MỘT SỐ YẾU TỐ THỐNG KÊ",
        "topic": "Tần số và tần số tương đối",
        "primarySkillCode": "MATH9-STATISTICS",
        "secondarySkillCodes": [],
        "learningOutcome": "Tính tần số tương đối của một loại đối tượng từ số liệu thống kê đơn giản (tần số chia cho kích thước mẫu).",
        "cognitiveLevel": "REMEMBERING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Tính số lượng trà trái cây 50 - 40 = 10 ly, áp dụng công thức tần số tương đối 10/50 * 100% = 20%; các phép tính cơ bản.",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [1],
            "answerPages": [9],
            "referenceSection": "Phần I - Câu 7",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "EASY",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Khớp với Slot 11 trong ma trận blueprint diagnostic (Thống kê, tần số và tần số tương đối, REMEMBERING, EASY).",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P002-Q008": {
        "knowledgeStrand": "Đại số và một số yếu tố giải tích",
        "chapter": "CĂN BẬC HAI VÀ CĂN BẬC BA",
        "topic": "Căn bậc hai và biến đổi căn thức",
        "primarySkillCode": "SKILL-02",
        "secondarySkillCodes": ["SKILL-01"],
        "learningOutcome": "Rút gọn biểu thức chứa căn bậc hai dạng căn(A^2) = |A| bằng cách nhận dạng hằng đẳng thức 6 + 2 căn(5) = (căn(5) + 1)^2.",
        "cognitiveLevel": "REMEMBERING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Nhận dạng bình phương đúng dưới căn thức bậc hai quen thuộc trong chương trình lớp 9, thao tác cơ bản đưa ra ngoài dấu căn.",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [2],
            "answerPages": [9],
            "referenceSection": "Phần I - Câu 8",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "EASY",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Khớp với Slot 4 trong ma trận blueprint diagnostic (Căn bậc hai / Biến đổi căn thức cơ bản, REMEMBERING, EASY).",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P002-Q009": {
        "knowledgeStrand": "Đại số và một số yếu tố giải tích",
        "chapter": "BẤT ĐẲNG THỨC VÀ BẤT PHƯƠNG TRÌNH",
        "topic": "Bất đẳng thức và tính chất",
        "primarySkillCode": "MATH9-LINEAR-INEQUALITY",
        "secondarySkillCodes": [],
        "learningOutcome": "Hiểu và phân tích được các tính chất của bất đẳng thức (tính chất cộng, nhân với số âm/dương, bình phương) để nhận diện khẳng định sai.",
        "cognitiveLevel": "UNDERSTANDING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Cần phân tích từng phương án và dùng phản ví dụ chứng minh tính chất bình phương không bảo toàn khi có số âm (a = -5, b = 2 thì a^2 > b^2); đòi hỏi hiểu sâu tính chất bất đẳng thức.",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [2],
            "answerPages": [9],
            "referenceSection": "Phần I - Câu 9",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "MEDIUM",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Mức độ thông hiểu tính chất bất đẳng thức; Slot 3 blueprint chỉ định REMEMBERING/EASY nhưng nội dung câu này đòi hỏi lập luận phản ví dụ.",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P002-Q010": {
        "knowledgeStrand": "Hình học và đo lường",
        "chapter": "HÌNH KHỐI TRONG THỰC TIỄN",
        "topic": "Hình cầu - Thể tích hình cầu",
        "primarySkillCode": "MATH9-SOLIDS",
        "secondarySkillCodes": [],
        "learningOutcome": "Nhận biết và tính thể tích hình cầu theo công thức V = (4/3) * pi * r^3 khi biết bán kính r.",
        "cognitiveLevel": "REMEMBERING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Áp dụng trực tiếp công thức V = (4/3)*pi*3^3 = 36*pi, không qua biến đổi trung gian.",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [2],
            "answerPages": [9],
            "referenceSection": "Phần I - Câu 10",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "EASY",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Nhận biết công thức thể tích hình khối cơ bản; Slot 12 blueprint yêu cầu UNDERSTANDING/MEDIUM nhưng câu này ở mức nhận biết.",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P002-Q011": {
        "knowledgeStrand": "Đại số và một số yếu tố giải tích",
        "chapter": "HÀM SỐ BẬC HAI VÀ PHƯƠNG TRÌNH BẬC HAI",
        "topic": "Hàm số y = ax² (a ≠ 0)",
        "primarySkillCode": "MATH9-QUADRATIC-FUNCTIONS",
        "secondarySkillCodes": [],
        "learningOutcome": "Nhận biết định nghĩa hàm số bậc hai một ẩn và lập luận điều kiện hệ số trước x^2 luôn khác 0 với mọi giá trị của tham số.",
        "cognitiveLevel": "UNDERSTANDING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Cần hiểu bản chất điều kiện của hàm bậc hai y = Ax^2 là hệ số A khác 0, nhận ra a^2 + 1 >= 1 > 0 với mọi a để chọn phương án đúng; loại trừ các phương án phụ thuộc dấu của a.",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [2],
            "answerPages": [9],
            "referenceSection": "Phần I - Câu 11",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "MEDIUM",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Thông hiểu định nghĩa và tính chất đại số tham số; Slot 6 blueprint yêu cầu REMEMBERING/EASY nên câu này có mức độ lập luận cao hơn.",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P002-Q012": {
        "knowledgeStrand": "Đại số và một số yếu tố giải tích",
        "chapter": "CĂN BẬC HAI VÀ CĂN BẬC BA",
        "topic": "Căn bậc hai và điều kiện xác định",
        "primarySkillCode": "SKILL-01",
        "secondarySkillCodes": [],
        "learningOutcome": "Tìm điều kiện xác định của biểu thức chứa hai căn thức bậc hai bằng cách giải hệ hai bất phương trình bậc nhất một ẩn.",
        "cognitiveLevel": "UNDERSTANDING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Cần thiết lập hệ điều kiện x - 2 >= 0 và 4 - x >= 0, giải ra 2 <= x <= 4 và kết hợp nghiệm trên trục số.",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [2],
            "answerPages": [9],
            "referenceSection": "Phần I - Câu 12",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "MEDIUM",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Thông hiểu điều kiện xác định căn thức kết hợp bất phương trình; chưa qua hiệu chuẩn IRT.",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },

    # ==================== PHẦN II: TRẮC NGHIỆM ĐÚNG SAI ====================
    "SRC009-P002-Q001": {
        "knowledgeStrand": "Hình học và đo lường",
        "chapter": "HÌNH KHỐI TRONG THỰC TIỄN",
        "topic": "Hình trụ - Diện tích xung quanh và bài toán thực tế",
        "primarySkillCode": "MATH9-SOLIDS",
        "secondarySkillCodes": [],
        "learningOutcome": "Vận dụng công thức diện tích xung quanh hình trụ vào giải quyết bài toán thực tế tính chi phí quét keo chống thấm.",
        "cognitiveLevel": None,
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Câu hỏi đúng/sai đa ý có phân bố nhận thức không đồng nhất giữa 4 ý (từ Nhận biết đến Vận dụng). Chưa có quy tắc tổng hợp mức nhận thức chung cho toàn câu trong blueprint, do đó để null theo quy định.",
        "statementLevelDistribution": {
            "REMEMBERING": 1,
            "UNDERSTANDING": 2,
            "APPLYING": 1,
            "ADVANCED_APPLYING": 0
        },
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [2],
            "answerPages": [9],
            "referenceSection": "Phần II - Câu 1",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": None,
        "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
        "difficultyRationale": "Đề thi Hải Phòng đặt bài toán hình trụ vào Câu 1 Phần II, lệch với cấu trúc blueprint (chỉ định Slot 12 TN hoặc Slot 20 Ngắn). Cần người thẩm định duyệt nhãn độ khó tổng thể.",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P002-Q002": {
        "knowledgeStrand": "Thống kê và xác suất",
        "chapter": "MỘT SỐ YẾU TỐ THỐNG KÊ",
        "topic": "Bảng tần số ghép nhóm và phân tích số liệu",
        "primarySkillCode": "MATH9-STATISTICS",
        "secondarySkillCodes": [],
        "learningOutcome": "Đọc, hiểu và phân tích bảng tần số ghép nhóm, tính toán tỉ lệ phần trăm và chi phí phát sinh theo số giờ cao điểm.",
        "cognitiveLevel": None,
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Câu đúng/sai đa ý có phân bố từ Nhận biết tần số lớn nhất (ý a) đến Thông hiểu (ý b, c) và Vận dụng tính chi phí (ý d). Để cognitiveLevel câu chính là null chờ quy tắc phê duyệt.",
        "statementLevelDistribution": {
            "REMEMBERING": 1,
            "UNDERSTANDING": 2,
            "APPLYING": 1,
            "ADVANCED_APPLYING": 0
        },
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [2],
            "answerPages": [9],
            "referenceSection": "Phần II - Câu 2",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "MEDIUM",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Khớp với Slot 16 trong ma trận blueprint diagnostic (Đọc và phân tích dữ liệu, UNDERSTANDING, MEDIUM).",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P003-Q003": {
        "knowledgeStrand": "Đại số và một số yếu tố giải tích",
        "chapter": "PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH",
        "topic": "Giải bài toán bằng cách lập hệ phương trình bậc nhất hai ẩn",
        "primarySkillCode": "SKILL-04",
        "secondarySkillCodes": ["SKILL-03"],
        "learningOutcome": "Mô hình hóa bài toán thực tế sản xuất chip bằng hệ hai phương trình bậc nhất hai ẩn và đánh giá sự thay đổi công nghệ ở tuần 2.",
        "cognitiveLevel": None,
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Câu đúng/sai đa ý có phân bố trải rộng từ Thông hiểu (ý a) đến Vận dụng (ý b, c) và Vận dụng cao (ý d lập luận phần trăm tối ưu). Để cognitiveLevel câu chính là null.",
        "statementLevelDistribution": {
            "REMEMBERING": 0,
            "UNDERSTANDING": 1,
            "APPLYING": 2,
            "ADVANCED_APPLYING": 1
        },
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [3],
            "answerPages": [9],
            "referenceSection": "Phần II - Câu 3",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "MEDIUM",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Khớp với Slot 13 trong ma trận blueprint diagnostic (Mô hình hóa bằng phương trình và hệ phương trình, UNDERSTANDING, MEDIUM).",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P003-Q004": {
        "knowledgeStrand": "Đại số và một số yếu tố giải tích",
        "chapter": "HÀM SỐ BẬC HAI VÀ PHƯƠNG TRÌNH BẬC HAI",
        "topic": "Sự tương giao giữa parabol và đường thẳng",
        "primarySkillCode": "MATH9-QUADRATIC-FUNCTIONS",
        "secondarySkillCodes": ["SKILL-05", "SKILL-06", "MATH9-PARABOLA-INTERSECTION"],
        "learningOutcome": "Phân tích phương trình hoành độ giao điểm của parabol và đường thẳng, áp dụng định lý Viète tính tích hoành độ và tích tung độ các giao điểm.",
        "cognitiveLevel": None,
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Câu đúng/sai đa ý gồm Nhận biết đỉnh gốc toạ độ (ý a), Thông hiểu lập phương trình hoành độ và Viète (ý b, c) và Vận dụng tính tích tung độ (ý d). Để cognitiveLevel câu chính là null.",
        "statementLevelDistribution": {
            "REMEMBERING": 1,
            "UNDERSTANDING": 2,
            "APPLYING": 1,
            "ADVANCED_APPLYING": 0
        },
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [3],
            "answerPages": [9],
            "referenceSection": "Phần II - Câu 4",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": None,
        "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
        "difficultyRationale": "Đề Hải Phòng đưa tương giao parabol vào Câu 4 Phần II, trong khi blueprint Slot 14 và 15 dành cho Căn thức và Đường tròn. Cần người thẩm định phân bổ.",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },

    # ==================== PHẦN III: TRẮC NGHIỆM TRẢ LỜI NGẮN ====================
    "SRC009-P003-III-Q001": {
        "knowledgeStrand": "Hình học và đo lường",
        "chapter": "ĐƯỜNG TRÒN",
        "topic": "Vị trí tương đối của hai đường tròn và hệ thức lượng hình học",
        "primarySkillCode": "SKILL-08",
        "secondarySkillCodes": ["MATH9-CYCLIC-POLYGONS"],
        "learningOutcome": "Vận dụng định lý Pythagore tính bán kính nửa đường tròn và áp dụng tính chất hai đường tròn tiếp xúc trong để tính bán kính đường tròn nội tiếp góc vuông.",
        "cognitiveLevel": "APPLYING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Bài toán giải qua 2 giai đoạn: tính bán kính nửa đường tròn Rp = 20/căn(3), sau đó giải phương trình tiếp xúc r*căn(2) + r = Rp để tìm r ≈ 4,78 cm; đòi hỏi vận dụng liên hoàn kiến thức hình học.",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [3],
            "answerPages": [9],
            "referenceSection": "Phần III - Câu 1",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "HARD",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Mức độ vận dụng hình học phức hợp tính bán kính đường tròn tiếp xúc; chưa hiệu chuẩn IRT.",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P003-III-Q002": {
        "knowledgeStrand": "Đại số và một số yếu tố giải tích",
        "chapter": "CĂN BẬC HAI VÀ CĂN BẬC BA",
        "topic": "Hạ bậc đa thức, định lý Viète và rút gọn biểu thức căn thức",
        "primarySkillCode": "SKILL-02",
        "secondarySkillCodes": ["SKILL-06", "MATH9-ALGEBRA-REDUCTION"],
        "learningOutcome": "Sử dụng tính chất nghiệm của phương trình bậc hai để hạ bậc đa thức bậc bốn dưới dấu căn thức, nhận dạng bình phương đúng và rút gọn biểu thức với nghiệm còn lại.",
        "cognitiveLevel": "ADVANCED_APPLYING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Kỹ thuật biến đổi bậc cao: dùng x1^2 = 4x1 - 1 để hạ bậc x1^4 -> 56x1 - 15, chuyển biểu thức dưới căn thành 76 + 42căn(3) = (7 + 3căn(3))^2, kết hợp nghiệm x2 và đồng nhất hệ số tìm T = a + bc = 5.",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [3],
            "answerPages": [9],
            "referenceSection": "Phần III - Câu 2",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "VERY_HARD",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Khớp với Slot 21 trong ma trận blueprint diagnostic (Căn thức tổng hợp và cực trị, ADVANCED_APPLYING, VERY_HARD).",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P003-III-Q003": {
        "knowledgeStrand": "Đại số và một số yếu tố giải tích",
        "chapter": "HÀM SỐ BẬC HAI VÀ PHƯƠNG TRÌNH BẬC HAI",
        "topic": "Ứng dụng hàm số bậc hai trong bài toán tối ưu kinh tế",
        "primarySkillCode": "MATH9-QUADRATIC-FUNCTIONS",
        "secondarySkillCodes": ["SKILL-05", "MATH9-ALGEBRA-OPTIMIZATION"],
        "learningOutcome": "Mô hình hóa bài toán kinh tế thực tế thành hàm số bậc hai một ẩn, tìm giá trị lớn nhất tại đỉnh parabol sau khi đã quy đổi khấu trừ thuế VAT 10%.",
        "cognitiveLevel": "APPLYING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Cần nhận ra việc khấu trừ 10% VAT đưa về giá thuần, lập hàm doanh thu F(x) = (500 - 25x)(20 + x) + 250x = -25x^2 + 250x + 10000, tìm cực đại tại x = 5 và tính ra 10,63 tỷ đồng.",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [3],
            "answerPages": [9],
            "referenceSection": "Phần III - Câu 3",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "HARD",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Vận dụng mô hình kinh tế thực tiễn tối ưu hàm bậc hai; chưa qua hiệu chuẩn thực nghiệm IRT.",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P004-Q004": {
        "knowledgeStrand": "Hình học và đo lường",
        "chapter": "ĐƯỜNG TRÒN",
        "topic": "Vị trí tương đối của hai đường tròn và tiếp tuyến",
        "primarySkillCode": "SKILL-08",
        "secondarySkillCodes": ["MATH9-CYCLIC-POLYGONS"],
        "learningOutcome": "Vận dụng tính đối xứng, định lý Pythagore trong tam giác vuông và tam giác đồng dạng để tính khoảng cách giữa hai tiếp điểm của đường tròn nội tiếp tiếp xúc hai cung tròn.",
        "cognitiveLevel": "ADVANCED_APPLYING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Bài toán hình học phân hóa cao: chứng minh ba điểm thẳng hàng do tiếp xúc trong (A, O, Q), thiết lập phương trình Pythagore (40 - r)^2 = 20^2 + r^2 tìm bán kính r = 15, sau đó dùng tam giác đồng dạng OPQ ~ OBA tỉ số 3/5 tính ra PQ = 24.",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [4],
            "answerPages": [9],
            "referenceSection": "Phần III - Câu 4",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "VERY_HARD",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Khớp với Slot 22 trong ma trận blueprint diagnostic (Hình học tổng hợp phân hóa cao, ADVANCED_APPLYING, VERY_HARD).",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P004-Q005": {
        "knowledgeStrand": "Đại số và một số yếu tố giải tích",
        "chapter": "BẤT ĐẲNG THỨC VÀ BẤT PHƯƠNG TRÌNH",
        "topic": "Bất phương trình bậc nhất một ẩn và bài toán tối ưu chi phí",
        "primarySkillCode": "MATH9-LINEAR-INEQUALITY",
        "secondarySkillCodes": [],
        "learningOutcome": "Mô hình hóa bài toán thực tế so sánh chi phí vận tải thành bất phương trình bậc nhất một ẩn và tìm nghiệm nguyên lớn nhất.",
        "cognitiveLevel": "APPLYING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Thiết lập bất phương trình so sánh chi phí 18000x < 1200000 + 13000x, giải bất phương trình bậc nhất tìm x < 240 và suy ra giá trị nguyên lớn nhất x = 239.",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [4],
            "answerPages": [9],
            "referenceSection": "Phần III - Câu 5",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "HARD",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Khớp 100% với Slot 18 trong ma trận blueprint diagnostic (Vận dụng bất phương trình, APPLYING, HARD).",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    },
    "SRC009-P004-Q006": {
        "knowledgeStrand": "Thống kê và xác suất",
        "chapter": "MỘT SỐ YẾU TỐ XÁC SUẤT",
        "topic": "Xác suất của biến cố trong một số mô hình xác suất đơn giản",
        "primarySkillCode": "MATH9-PROBABILITY",
        "secondarySkillCodes": [],
        "learningOutcome": "Tính xác suất của biến cố đối trong mô hình rút ngẫu nhiên không hoàn lại và áp dụng quy tắc làm tròn số thập phân đến hàng phần trăm.",
        "cognitiveLevel": "APPLYING",
        "sourceLevel": None,
        "classificationOrigin": "MODEL_PROPOSED",
        "rationale": "Xác định không gian mẫu n(Omega) = C(8, 2) = 28, sử dụng biến cố đối (không có nguyên âm) n(E_bar) = C(5, 2) = 10, tính xác suất P(E) = 1 - 10/28 = 9/14 ≈ 0,6428 và làm tròn 0,64.",
        "evidence": {
            "sourceId": "SRC009",
            "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
            "questionPages": [4],
            "answerPages": [9],
            "referenceSection": "Phần III - Câu 6",
            "curriculumReference": "Chương trình GDPT 2018 môn Toán - Lớp 9 (Thông tư 32/2018/TT-BGDĐT)"
        },
        "difficulty": "HARD",
        "difficultyStatus": "PROVISIONAL",
        "difficultyRationale": "Khớp 100% với Slot 19 trong ma trận blueprint diagnostic (Xác suất của biến cố, APPLYING, HARD).",
        "calibrationStatus": "UNCALIBRATED",
        "labelReviewStatus": "NEEDS_REVIEW"
    }
}

# Detailed statement classifications for True/False questions
statement_classifications = {
    "SRC009-P002-Q001": {
        "a": {
            "knowledgeStrand": "Hình học và đo lường",
            "chapter": "HÌNH KHỐI TRONG THỰC TIỄN",
            "topic": "Hình trụ - Bán kính và diện tích xung quanh",
            "primarySkillCode": "MATH9-SOLIDS",
            "secondarySkillCodes": [],
            "learningOutcome": "Nhận biết khái niệm diện tích xung quanh hình trụ và đổi đúng đơn vị đường kính sang bán kính đáy.",
            "cognitiveLevel": "REMEMBERING",
            "sourceLevel": None,
            "classificationOrigin": "MODEL_PROPOSED",
            "rationale": "Nhận biết định nghĩa diện tích xung quanh và thực hiện phép đổi đơn vị trực tiếp r = d/2 = 0,1 m = 10 cm.",
            "difficulty": None,
            "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
            "difficultyRationale": "Chưa có quy tắc phân độ khó độc lập cho từng ý trong blueprint.",
            "calibrationStatus": "UNCALIBRATED",
            "labelReviewStatus": "NEEDS_REVIEW"
        },
        "b": {
            "knowledgeStrand": "Hình học và đo lường",
            "chapter": "HÌNH KHỐI TRONG THỰC TIỄN",
            "topic": "Hình trụ - Tính diện tích xung quanh",
            "primarySkillCode": "MATH9-SOLIDS",
            "secondarySkillCodes": [],
            "learningOutcome": "Tính toán và phát hiện sai sót trong diện tích xung quanh hình trụ do nhầm lẫn bậc độ lớn đơn vị đo.",
            "cognitiveLevel": "UNDERSTANDING",
            "sourceLevel": None,
            "classificationOrigin": "MODEL_PROPOSED",
            "rationale": "Tính S_xq = 2*pi*r*h ≈ 6,28 m², so sánh và chỉ ra khẳng định 628 m² là sai (sai số 100 lần do nhầm lẫn đơn vị).",
            "difficulty": None,
            "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
            "difficultyRationale": "Chưa có quy tắc phân độ khó độc lập cho từng ý trong blueprint.",
            "calibrationStatus": "UNCALIBRATED",
            "labelReviewStatus": "NEEDS_REVIEW"
        },
        "c": {
            "knowledgeStrand": "Hình học và đo lường",
            "chapter": "HÌNH KHỐI TRONG THỰC TIỄN",
            "topic": "Hình trụ - So sánh diện tích bề mặt",
            "primarySkillCode": "MATH9-SOLIDS",
            "secondarySkillCodes": [],
            "learningOutcome": "So sánh diện tích phủ sơn/keo của số lượng hộp với diện tích xung quanh thực tế của ống.",
            "cognitiveLevel": "UNDERSTANDING",
            "sourceLevel": None,
            "classificationOrigin": "MODEL_PROPOSED",
            "rationale": "Tính diện tích 2 hộp quét được 2 * 3 = 6 m², so sánh với 6,28 m² để kết luận không đủ quét bề mặt.",
            "difficulty": None,
            "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
            "difficultyRationale": "Chưa có quy tắc phân độ khó độc lập cho từng ý trong blueprint.",
            "calibrationStatus": "UNCALIBRATED",
            "labelReviewStatus": "NEEDS_REVIEW"
        },
        "d": {
            "knowledgeStrand": "Hình học và đo lường",
            "chapter": "HÌNH KHỐI TRONG THỰC TIỄN",
            "topic": "Hình trụ - Tối ưu chi phí mua nguyên vật liệu",
            "primarySkillCode": "MATH9-SOLIDS",
            "secondarySkillCodes": [],
            "learningOutcome": "Vận dụng phép làm tròn lên số hộp nguyên cần mua trong thực tế và tính chi phí tối thiểu.",
            "cognitiveLevel": "APPLYING",
            "sourceLevel": None,
            "classificationOrigin": "MODEL_PROPOSED",
            "rationale": "Lập luận thực tế cần mua trần ceil(6,28 / 3) = 3 hộp keo và nhân đơn giá 50.000 ra số tiền tối thiểu 150.000 đồng.",
            "difficulty": None,
            "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
            "difficultyRationale": "Chưa có quy tắc phân độ khó độc lập cho từng ý trong blueprint.",
            "calibrationStatus": "UNCALIBRATED",
            "labelReviewStatus": "NEEDS_REVIEW"
        }
    },
    "SRC009-P002-Q002": {
        "a": {
            "knowledgeStrand": "Thống kê và xác suất",
            "chapter": "MỘT SỐ YẾU TỐ THỐNG KÊ",
            "topic": "Bảng tần số ghép nhóm",
            "primarySkillCode": "MATH9-STATISTICS",
            "secondarySkillCodes": [],
            "learningOutcome": "Đọc bảng số liệu ghép nhóm và chỉ ra nhóm có tần số lớn nhất.",
            "cognitiveLevel": "REMEMBERING",
            "sourceLevel": None,
            "classificationOrigin": "MODEL_PROPOSED",
            "rationale": "Nhận diện trực tiếp nhóm [20; 30) có tần số 10 giờ là lớn nhất trong bảng.",
            "difficulty": None,
            "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
            "difficultyRationale": "Chưa có quy tắc phân độ khó độc lập cho từng ý trong blueprint.",
            "calibrationStatus": "UNCALIBRATED",
            "labelReviewStatus": "NEEDS_REVIEW"
        },
        "b": {
            "knowledgeStrand": "Thống kê và xác suất",
            "chapter": "MỘT SỐ YẾU TỐ THỐNG KÊ",
            "topic": "Bảng tần số ghép nhóm - Tổng hợp tần số",
            "primarySkillCode": "MATH9-STATISTICS",
            "secondarySkillCodes": [],
            "learningOutcome": "Hiểu định nghĩa giờ cao điểm (từ 30 khách trở lên) và cộng tần số của các nhóm thỏa mãn.",
            "cognitiveLevel": "UNDERSTANDING",
            "sourceLevel": None,
            "classificationOrigin": "MODEL_PROPOSED",
            "rationale": "Cộng tần số nhóm [30; 40) là 6 và [40; 50) là 3 thành tổng 9 giờ.",
            "difficulty": None,
            "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
            "difficultyRationale": "Chưa có quy tắc phân độ khó độc lập cho từng ý trong blueprint.",
            "calibrationStatus": "UNCALIBRATED",
            "labelReviewStatus": "NEEDS_REVIEW"
        },
        "c": {
            "knowledgeStrand": "Thống kê và xác suất",
            "chapter": "MỘT SỐ YẾU TỐ THỐNG KÊ",
            "topic": "Bảng tần số ghép nhóm - Tỉ lệ phần trăm",
            "primarySkillCode": "MATH9-STATISTICS",
            "secondarySkillCodes": [],
            "learningOutcome": "Tính tỉ lệ phần trăm số giờ thỏa mãn điều kiện so với tổng thời gian 24 giờ và đối chiếu với ngưỡng 25%.",
            "cognitiveLevel": "UNDERSTANDING",
            "sourceLevel": None,
            "classificationOrigin": "MODEL_PROPOSED",
            "rationale": "Tính 5/24 ≈ 20,83% và so sánh với 25% để kết luận mệnh đề sai.",
            "difficulty": None,
            "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
            "difficultyRationale": "Chưa có quy tắc phân độ khó độc lập cho từng ý trong blueprint.",
            "calibrationStatus": "UNCALIBRATED",
            "labelReviewStatus": "NEEDS_REVIEW"
        },
        "d": {
            "knowledgeStrand": "Thống kê và xác suất",
            "chapter": "MỘT SỐ YẾU TỐ THỐNG KÊ",
            "topic": "Bảng tần số ghép nhóm - Tính toán chi phí thực tế",
            "primarySkillCode": "MATH9-STATISTICS",
            "secondarySkillCodes": [],
            "learningOutcome": "Vận dụng số liệu thống kê giờ cao điểm vào tính toán chi phí nhân sự phát sinh trong ngày.",
            "cognitiveLevel": "APPLYING",
            "sourceLevel": None,
            "classificationOrigin": "MODEL_PROPOSED",
            "rationale": "Kết hợp số giờ cao điểm 9 giờ nhân đơn giá 50.000 đồng/giờ ra 450.000 đồng, nhận ra số 500.000 đồng là sai.",
            "difficulty": None,
            "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
            "difficultyRationale": "Chưa có quy tắc phân độ khó độc lập cho từng ý trong blueprint.",
            "calibrationStatus": "UNCALIBRATED",
            "labelReviewStatus": "NEEDS_REVIEW"
        }
    },
    "SRC009-P003-Q003": {
        "a": {
            "knowledgeStrand": "Đại số và một số yếu tố giải tích",
            "chapter": "PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH",
            "topic": "Mô hình hóa bằng phương trình và hệ phương trình",
            "primarySkillCode": "SKILL-04",
            "secondarySkillCodes": [],
            "learningOutcome": "Hiểu và kiểm tra điều kiện quỹ thời gian khi cho trước số lượng sản phẩm mỗi loại.",
            "cognitiveLevel": "UNDERSTANDING",
            "sourceLevel": None,
            "classificationOrigin": "MODEL_PROPOSED",
            "rationale": "Thay số 300 * 2 + 200 * 3 = 1200 giờ, so sánh với quỹ thời gian 1200 giờ để kết luận mệnh đề sai.",
            "difficulty": None,
            "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
            "difficultyRationale": "Chưa có quy tắc phân độ khó độc lập cho từng ý trong blueprint.",
            "calibrationStatus": "UNCALIBRATED",
            "labelReviewStatus": "NEEDS_REVIEW"
        },
        "b": {
            "knowledgeStrand": "Đại số và một số yếu tố giải tích",
            "chapter": "PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH",
            "topic": "Giải bài toán bằng cách lập hệ phương trình bậc nhất hai ẩn",
            "primarySkillCode": "SKILL-04",
            "secondarySkillCodes": ["SKILL-03"],
            "learningOutcome": "Lập và giải hệ hai phương trình bậc nhất hai ẩn biểu diễn thời gian và chi phí nguyên liệu tuần 1.",
            "cognitiveLevel": "APPLYING",
            "sourceLevel": None,
            "classificationOrigin": "MODEL_PROPOSED",
            "rationale": "Thiết lập hệ phương trình 2x + 3y = 1200 và 0,5x + 0,4y = 244, giải ra x = 360, y = 160 để nhận ra khẳng định ghi ngược là sai.",
            "difficulty": None,
            "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
            "difficultyRationale": "Chưa có quy tắc phân độ khó độc lập cho từng ý trong blueprint.",
            "calibrationStatus": "UNCALIBRATED",
            "labelReviewStatus": "NEEDS_REVIEW"
        },
        "c": {
            "knowledgeStrand": "Đại số và một số yếu tố giải tích",
            "chapter": "PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH",
            "topic": "Mô hình hóa bài toán thực tế - Tuần 2",
            "primarySkillCode": "SKILL-04",
            "secondarySkillCodes": [],
            "learningOutcome": "Tính toán tổng thời gian sản xuất tuần 2 khi áp dụng định mức thời gian đã giảm cho sản lượng tuần 1.",
            "cognitiveLevel": "APPLYING",
            "sourceLevel": None,
            "classificationOrigin": "MODEL_PROPOSED",
            "rationale": "Tính thời gian với định mức mới 1,6 * 360 + 2,7 * 160 = 576 + 432 = 1008 giờ.",
            "difficulty": None,
            "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
            "difficultyRationale": "Chưa có quy tắc phân độ khó độc lập cho từng ý trong blueprint.",
            "calibrationStatus": "UNCALIBRATED",
            "labelReviewStatus": "NEEDS_REVIEW"
        },
        "d": {
            "knowledgeStrand": "Đại số và một số yếu tố giải tích",
            "chapter": "PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH",
            "topic": "Mô hình hóa bài toán thực tế - Tối ưu quỹ thời gian",
            "primarySkillCode": "SKILL-04",
            "secondarySkillCodes": [],
            "learningOutcome": "Đánh giá mức tăng sản lượng 15% tác động đến quỹ thời gian và kết luận về tính khả thi không cần tăng thời gian.",
            "cognitiveLevel": "ADVANCED_APPLYING",
            "sourceLevel": None,
            "classificationOrigin": "MODEL_PROPOSED",
            "rationale": "Lập luận thời gian tăng theo tỉ lệ tuyến tính 1008 * 1,15 = 1159,2 giờ, so sánh với 1200 giờ để kết luận đúng.",
            "difficulty": None,
            "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
            "difficultyRationale": "Chưa có quy tắc phân độ khó độc lập cho từng ý trong blueprint.",
            "calibrationStatus": "UNCALIBRATED",
            "labelReviewStatus": "NEEDS_REVIEW"
        }
    },
    "SRC009-P003-Q004": {
        "a": {
            "knowledgeStrand": "Đại số và một số yếu tố giải tích",
            "chapter": "HÀM SỐ BẬC HAI VÀ PHƯƠNG TRÌNH BẬC HAI",
            "topic": "Hàm số y = ax² - Tính chất đồ thị",
            "primarySkillCode": "MATH9-QUADRATIC-FUNCTIONS",
            "secondarySkillCodes": [],
            "learningOutcome": "Nhận biết tính chất parabol y = ax² luôn đi qua gốc toạ độ O(0; 0).",
            "cognitiveLevel": "REMEMBERING",
            "sourceLevel": None,
            "classificationOrigin": "MODEL_PROPOSED",
            "rationale": "Khẳng định cơ bản về đồ thị y = ax² với x = 0 thì y = 0, suy ra parabol luôn đi qua gốc O.",
            "difficulty": None,
            "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
            "difficultyRationale": "Chưa có quy tắc phân độ khó độc lập cho từng ý trong blueprint.",
            "calibrationStatus": "UNCALIBRATED",
            "labelReviewStatus": "NEEDS_REVIEW"
        },
        "b": {
            "knowledgeStrand": "Đại số và một số yếu tố giải tích",
            "chapter": "HÀM SỐ BẬC HAI VÀ PHƯƠNG TRÌNH BẬC HAI",
            "topic": "Sự tương giao giữa parabol và đường thẳng",
            "primarySkillCode": "MATH9-QUADRATIC-FUNCTIONS",
            "secondarySkillCodes": ["SKILL-05"],
            "learningOutcome": "Lập phương trình hoành độ giao điểm của parabol y = 2x² và đường thẳng y = 4x + 9.",
            "cognitiveLevel": "UNDERSTANDING",
            "sourceLevel": None,
            "classificationOrigin": "MODEL_PROPOSED",
            "rationale": "Chuyển vế thiết lập 2x² - 4x - 9 = 0, nhận ra phương trình đề bài ghi 2x² - 5x + 9 = 0 là sai hệ số b và c.",
            "difficulty": None,
            "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
            "difficultyRationale": "Chưa có quy tắc phân độ khó độc lập cho từng ý trong blueprint.",
            "calibrationStatus": "UNCALIBRATED",
            "labelReviewStatus": "NEEDS_REVIEW"
        },
        "c": {
            "knowledgeStrand": "Đại số và một số yếu tố giải tích",
            "chapter": "HÀM SỐ BẬC HAI VÀ PHƯƠNG TRÌNH BẬC HAI",
            "topic": "Định lý Viète cho phương trình hoành độ giao điểm",
            "primarySkillCode": "SKILL-06",
            "secondarySkillCodes": ["MATH9-QUADRATIC-FUNCTIONS"],
            "learningOutcome": "Áp dụng định lý Viète tính tích hai nghiệm x1*x2 của phương trình hoành độ giao điểm.",
            "cognitiveLevel": "UNDERSTANDING",
            "sourceLevel": None,
            "classificationOrigin": "MODEL_PROPOSED",
            "rationale": "Tính x1*x2 = c/a = -9/2 từ phương trình 2x² - 4x - 9 = 0.",
            "difficulty": None,
            "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
            "difficultyRationale": "Chưa có quy tắc phân độ khó độc lập cho từng ý trong blueprint.",
            "calibrationStatus": "UNCALIBRATED",
            "labelReviewStatus": "NEEDS_REVIEW"
        },
        "d": {
            "knowledgeStrand": "Đại số và một số yếu tố giải tích",
            "chapter": "HÀM SỐ BẬC HAI VÀ PHƯƠNG TRÌNH BẬC HAI",
            "topic": "Tọa độ giao điểm và tính tích tung độ",
            "primarySkillCode": "MATH9-QUADRATIC-FUNCTIONS",
            "secondarySkillCodes": ["SKILL-06"],
            "learningOutcome": "Tính tích tung độ y1*y2 của các giao điểm thông qua công thức parabol y = 2x².",
            "cognitiveLevel": "APPLYING",
            "sourceLevel": None,
            "classificationOrigin": "MODEL_PROPOSED",
            "rationale": "Biểu diễn y1*y2 = (2x1²)*(2x2²) = 4(x1*x2)² = 4*(-9/2)² = 81, so sánh với 100 để kết luận khẳng định sai.",
            "difficulty": None,
            "difficultyStatus": "NEEDS_DIFFICULTY_REVIEW",
            "difficultyRationale": "Chưa có quy tắc phân độ khó độc lập cho từng ý trong blueprint.",
            "calibrationStatus": "UNCALIBRATED",
            "labelReviewStatus": "NEEDS_REVIEW"
        }
    }
}

# Attach classifications to questions and statements
for q in base_questions:
    qid = q["id"]
    if qid in classifications:
        q["classification"] = classifications[qid]

    if q["type"] == "TRUE_FALSE" and qid in statement_classifications:
        for stmt in q.get("statements", []):
            skey = stmt["key"]
            if skey in statement_classifications[qid]:
                stmt["classification"] = statement_classifications[qid][skey]

    labeled_questions.append(q)

# Write questions.jsonl
questions_out_path = os.path.join(dest_dir, 'questions.jsonl')
with open(questions_out_path, 'w', encoding='utf-8') as f:
    for q in labeled_questions:
        f.write(json.dumps(q, ensure_ascii=False) + '\n')

print(f"Successfully generated labeled {questions_out_path} with {len(labeled_questions)} questions!")

# Generate review.csv with statement-level detail for TRUE_FALSE
review_csv_path = os.path.join(dest_dir, 'review.csv')
fieldnames = [
    "id",
    "subId",
    "section",
    "questionNumber",
    "statementKey",
    "type",
    "topic",
    "primarySkillCode",
    "cognitiveLevel",
    "difficulty",
    "difficultyStatus",
    "classificationOrigin",
    "labelReviewStatus",
    "learningOutcome",
    "rationale"
]

rows = []
for q in labeled_questions:
    qid = q["id"]
    c = q["classification"]
    # Main row
    main_row = {
        "id": qid,
        "subId": qid,
        "section": q["section"],
        "questionNumber": q["questionNumber"],
        "statementKey": "MAIN",
        "type": q["type"],
        "topic": c["topic"],
        "primarySkillCode": c["primarySkillCode"],
        "cognitiveLevel": c["cognitiveLevel"] if c["cognitiveLevel"] is not None else "NULL_MULTIPLE_STATEMENTS",
        "difficulty": c["difficulty"] if c["difficulty"] is not None else "NULL",
        "difficultyStatus": c["difficultyStatus"],
        "classificationOrigin": c["classificationOrigin"],
        "labelReviewStatus": c["labelReviewStatus"],
        "learningOutcome": c["learningOutcome"],
        "rationale": c["rationale"]
    }
    rows.append(main_row)

    # If true/false, append statement rows
    if q["type"] == "TRUE_FALSE":
        for stmt in q.get("statements", []):
            sc = stmt["classification"]
            srow = {
                "id": qid,
                "subId": f"{qid}-{stmt['key']}",
                "section": q["section"],
                "questionNumber": q["questionNumber"],
                "statementKey": stmt["key"],
                "type": "STATEMENT",
                "topic": sc["topic"],
                "primarySkillCode": sc["primarySkillCode"],
                "cognitiveLevel": sc["cognitiveLevel"],
                "difficulty": sc["difficulty"] if sc["difficulty"] is not None else "NULL",
                "difficultyStatus": sc["difficultyStatus"],
                "classificationOrigin": sc["classificationOrigin"],
                "labelReviewStatus": sc["labelReviewStatus"],
                "learningOutcome": sc["learningOutcome"],
                "rationale": sc["rationale"]
            }
            rows.append(srow)

with open(review_csv_path, 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Successfully generated {review_csv_path} with {len(rows)} rows (22 main + 16 statements = 38 rows)!")

# Generate blueprint-coverage.csv
blueprint_slots = [
    (1, "SINGLE_CHOICE", "SKILL-03", "REMEMBERING", "EASY", "Hệ phương trình bậc nhất hai ẩn"),
    (2, "SINGLE_CHOICE", "MATH9-LINEAR-EQUATIONS", "REMEMBERING", "EASY", "Phương trình quy về bậc nhất"),
    (3, "SINGLE_CHOICE", "MATH9-LINEAR-INEQUALITY", "REMEMBERING", "EASY", "Bất đẳng thức và bất phương trình"),
    (4, "SINGLE_CHOICE", "SKILL-01", "REMEMBERING", "EASY", "Căn bậc hai"),
    (5, "SINGLE_CHOICE", "MATH9-CUBE-ROOTS", "REMEMBERING", "EASY", "Căn bậc ba"),
    (6, "SINGLE_CHOICE", "MATH9-QUADRATIC-FUNCTIONS", "REMEMBERING", "EASY", "Hàm số y = ax² và đồ thị"),
    (7, "SINGLE_CHOICE", "SKILL-05", "UNDERSTANDING", "MEDIUM", "Phương trình bậc hai"),
    (8, "SINGLE_CHOICE", "SKILL-07", "REMEMBERING", "EASY", "Tỉ số lượng giác và tam giác vuông"),
    (9, "SINGLE_CHOICE", "SKILL-08", "REMEMBERING", "EASY", "Đường tròn, góc, cung, tiếp tuyến"),
    (10, "SINGLE_CHOICE", "MATH9-CYCLIC-POLYGONS", "UNDERSTANDING", "MEDIUM", "Tứ giác nội tiếp, đa giác đều"),
    (11, "SINGLE_CHOICE", "MATH9-STATISTICS", "REMEMBERING", "EASY", "Thống kê, tần số và tần số tương đối"),
    (12, "SINGLE_CHOICE", "MATH9-SOLIDS", "UNDERSTANDING", "MEDIUM", "Hình trụ, hình nón, hình cầu"),
    (13, "TRUE_FALSE", "SKILL-04", "UNDERSTANDING", "MEDIUM", "Mô hình hóa bằng phương trình và hệ phương trình"),
    (14, "TRUE_FALSE", "SKILL-02", "UNDERSTANDING", "MEDIUM", "Biến đổi căn thức"),
    (15, "TRUE_FALSE", "SKILL-08", "UNDERSTANDING", "MEDIUM", "Quan hệ hình học đường tròn"),
    (16, "TRUE_FALSE", "MATH9-STATISTICS", "UNDERSTANDING", "MEDIUM", "Đọc và phân tích dữ liệu"),
    (17, "SHORT_ANSWER", "SKILL-06", "APPLYING", "HARD", "Định lí Viète và ứng dụng"),
    (18, "SHORT_ANSWER", "MATH9-LINEAR-INEQUALITY", "APPLYING", "HARD", "Vận dụng bất phương trình"),
    (19, "SHORT_ANSWER", "MATH9-PROBABILITY", "APPLYING", "HARD", "Xác suất của biến cố"),
    (20, "SHORT_ANSWER", "MATH9-SOLIDS", "APPLYING", "HARD", "Diện tích, thể tích trong thực tiễn"),
    (21, "SHORT_ANSWER", "SKILL-02", "ADVANCED_APPLYING", "VERY_HARD", "Căn thức tổng hợp và cực trị"),
    (22, "SHORT_ANSWER", "MATH9-CYCLIC-POLYGONS", "ADVANCED_APPLYING", "VERY_HARD", "Hình học nội tiếp tổng hợp")
]

coverage_rows = []
for slot, qtype, skill, cog, diff, topic in blueprint_slots:
    matched_id = None
    match_type = "SHORTAGE_UNMATCHED"
    notes = ""

    if slot == 1:
        matched_id = "SRC009-P001-Q003"
        match_type = "PARTIAL_CONTENT_MATCH"
        notes = "Khớp kỹ năng SKILL-03 và dạng câu; tuy nhiên câu hỏi yêu cầu giải hệ và tính x+y nên mức nhận thức đề xuất là UNDERSTANDING, cao hơn mức REMEMBERING của slot."
    elif slot == 2:
        matched_id = "NONE"
        match_type = "SHORTAGE_UNMATCHED"
        notes = "Đề Hải Phòng không có câu trắc nghiệm nhiều lựa chọn về phương trình quy về bậc nhất (chỉ có hệ pt ở Câu 3 và pt bậc hai ở Câu 4)."
    elif slot == 3:
        matched_id = "SRC009-P002-Q009"
        match_type = "PARTIAL_CONTENT_MATCH"
        notes = "Khớp kỹ năng MATH9-LINEAR-INEQUALITY và dạng câu; tuy nhiên câu hỏi yêu cầu lập luận phản ví dụ nên mức nhận thức đề xuất là UNDERSTANDING, cao hơn REMEMBERING của slot."
    elif slot == 4:
        matched_id = "SRC009-P002-Q008"
        match_type = "PROPOSED_MATCH"
        notes = "Khớp chuyên đề căn bậc hai / biến đổi căn thức cơ bản; câu hỏi rút gọn căn thức hằng đẳng thức cơ bản đạt REMEMBERING/EASY."
    elif slot == 5:
        matched_id = "NONE"
        match_type = "SHORTAGE_UNMATCHED"
        notes = "Đề Hải Phòng không có câu trắc nghiệm nhiều lựa chọn riêng về căn bậc ba."
    elif slot == 6:
        matched_id = "SRC009-P002-Q011"
        match_type = "PARTIAL_CONTENT_MATCH"
        notes = "Khớp chuyên đề hàm số y = ax²; câu hỏi yêu cầu lập luận hệ số tham số a^2 + 1 > 0 nên mức đề xuất là UNDERSTANDING, cao hơn REMEMBERING của slot."
    elif slot == 7:
        matched_id = "SRC009-P001-Q004"
        match_type = "PROPOSED_MATCH"
        notes = "Khớp hoàn toàn chuyên đề phương trình bậc hai một ẩn, dạng SINGLE_CHOICE, mức đề xuất UNDERSTANDING, độ khó dự kiến MEDIUM."
    elif slot == 8:
        matched_id = "SRC009-P001-Q001"
        match_type = "PROPOSED_MATCH"
        notes = "Khớp hoàn toàn chuyên đề tỉ số lượng giác góc nhọn, dạng SINGLE_CHOICE, mức đề xuất REMEMBERING, độ khó dự kiến EASY."
    elif slot == 9:
        matched_id = "SRC009-P001-Q006"
        match_type = "PROPOSED_MATCH"
        notes = "Khớp chuyên đề đường tròn, cung và quạt tròn; áp dụng công thức quạt tròn cơ bản đạt REMEMBERING/EASY."
    elif slot == 10:
        matched_id = "NONE"
        match_type = "SHORTAGE_UNMATCHED"
        notes = "Đề Hải Phòng không có câu trắc nghiệm nhiều lựa chọn riêng về tứ giác nội tiếp / đa giác đều."
    elif slot == 11:
        matched_id = "SRC009-P001-Q007"
        match_type = "PROPOSED_MATCH"
        notes = "Khớp hoàn toàn chuyên đề thống kê tần số tương đối, dạng SINGLE_CHOICE, mức đề xuất REMEMBERING, độ khó dự kiến EASY."
    elif slot == 12:
        matched_id = "SRC009-P002-Q010"
        match_type = "PARTIAL_CONTENT_MATCH"
        notes = "Khớp chuyên đề hình khối (hình cầu); tuy nhiên câu hỏi áp dụng trực tiếp công thức thể tích nên mức nhận thức đề xuất là REMEMBERING, thấp hơn UNDERSTANDING của slot."
    elif slot == 13:
        matched_id = "SRC009-P003-Q003"
        match_type = "PROPOSED_MATCH"
        notes = "Khớp chuyên đề mô hình hóa bằng lập hệ phương trình; mức độ toàn câu để null nhưng các ý b,c đạt APPLYING và ý a đạt UNDERSTANDING."
    elif slot == 14:
        matched_id = "NONE"
        match_type = "SHORTAGE_UNMATCHED"
        notes = "Đề Hải Phòng không có câu đúng/sai về biến đổi căn thức ở Phần II."
    elif slot == 15:
        matched_id = "NONE"
        match_type = "SHORTAGE_UNMATCHED"
        notes = "Đề Hải Phòng không có câu đúng/sai thuần túy về quan hệ hình học đường tròn ở Phần II (Câu 4 Phần II là tương giao parabol)."
    elif slot == 16:
        matched_id = "SRC009-P002-Q002"
        match_type = "PROPOSED_MATCH"
        notes = "Khớp hoàn toàn chuyên đề thống kê phân tích số liệu bảng ghép nhóm, dạng TRUE_FALSE."
    elif slot == 17:
        matched_id = "NONE"
        match_type = "SHORTAGE_UNMATCHED"
        notes = "Đề Hải Phòng có bài toán Viète kết hợp căn thức ở Câu 2 Phần III nhưng ở mức ADVANCED_APPLYING phân hóa cao, khớp với Slot 21 hơn là Slot 17."
    elif slot == 18:
        matched_id = "SRC009-P004-Q005"
        match_type = "PROPOSED_MATCH"
        notes = "Khớp 100% chuyên đề vận dụng bất phương trình thực tế tìm nghiệm nguyên lớn nhất, dạng SHORT_ANSWER, mức đề xuất APPLYING, độ khó dự kiến HARD."
    elif slot == 19:
        matched_id = "SRC009-P004-Q006"
        match_type = "PROPOSED_MATCH"
        notes = "Khớp 100% chuyên đề xác suất biến cố rút thẻ nguyên âm, dạng SHORT_ANSWER, mức đề xuất APPLYING, độ khó dự kiến HARD."
    elif slot == 20:
        matched_id = "NONE"
        match_type = "SHORTAGE_UNMATCHED"
        notes = "Đề Hải Phòng đưa bài toán hình khối thực tế vào Câu 1 Phần II (đúng/sai ống thoát nước), không có câu trả lời ngắn hình khối ở Phần III."
    elif slot == 21:
        matched_id = "SRC009-P003-III-Q002"
        match_type = "PROPOSED_MATCH"
        notes = "Khớp chuyên đề căn thức tổng hợp kết hợp hạ bậc đa thức nghiệm phương trình bậc hai, dạng SHORT_ANSWER, mức đề xuất ADVANCED_APPLYING, độ khó VERY_HARD."
    elif slot == 22:
        matched_id = "SRC009-P004-Q004"
        match_type = "PROPOSED_MATCH"
        notes = "Khớp chuyên đề hình học đường tròn tiếp xúc tổng hợp phân hóa cao, dạng SHORT_ANSWER, mức đề xuất ADVANCED_APPLYING, độ khó VERY_HARD."

    coverage_rows.append({
        "slot": slot,
        "requiredType": qtype,
        "requiredSkillCode": skill,
        "requiredCognitiveLevel": cog,
        "requiredDifficulty": diff,
        "requiredTopic": topic,
        "matchingQuestionId": matched_id,
        "matchType": match_type,
        "notes": notes
    })

blueprint_csv_path = os.path.join(dest_dir, 'blueprint-coverage.csv')
fieldnames_bp = [
    "slot",
    "requiredType",
    "requiredSkillCode",
    "requiredCognitiveLevel",
    "requiredDifficulty",
    "requiredTopic",
    "matchingQuestionId",
    "matchType",
    "notes"
]

with open(blueprint_csv_path, 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames_bp)
    writer.writeheader()
    writer.writerows(coverage_rows)

print(f"Successfully generated {blueprint_csv_path} with 22 slot mappings!")
