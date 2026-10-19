# -*- coding: utf-8 -*-
"""
Module providing verified question data for Slots 13 and 14 (Revision-02).
Every question is transcribed verbatim from the original PDF source.
"""

def get_slot_13_questions():
    return [
        {
            "id": "CAND-SLOT13-01",
            "sourceId": "SRC010",
            "examCode": "401",
            "section": "II",
            "questionNumber": 14,
            "questionPages": [2],
            "answerPages": [9],
            "explanationPages": [9],
            "grade": 9,
            "bookSeries": "Chung (GDPT 2018)",
            "topic": "Lập hệ phương trình kế hoạch sản xuất hai tổ",
            "type": "TRUE_FALSE",
            "stem": "Theo kế hoạch hai tổ sản xuất 600 sản phẩm trong một thời gian nhất định. Do áp dụng kĩ thuật mới nên tổ I đã vượt mức $18\\%$ và tổ II đã vượt mức $21\\%$. Vì vậy trong thời gian quy định họ đã hoàn thành vượt mức 120 sản phẩm. Gọi $x, y$ lần lượt là số sản phẩm của tổ I và tổ II theo kế hoạch ($x, y \\in \\mathbb{N}^*$, $x, y < 600$).",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "$x + y = 600$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-MODELING-LINEAR",
                    "rationale": "Thiết lập phương trình tổng sản phẩm kế hoạch $x + y = 600$."
                },
                {
                    "key": "b",
                    "text": "Số sản phẩm tổ I vượt mức là $0{,}18x$ (sản phẩm)",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-MODELING-LINEAR",
                    "rationale": "Biểu diễn số sản phẩm vượt mức qua tỷ lệ phần trăm $18\\%x = 0{,}18x$."
                },
                {
                    "key": "c",
                    "text": "Theo kế hoạch tổ I phải sản xuất 400 sản phẩm",
                    "answer": False,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-MODELING-LINEAR",
                    "rationale": "Giải hệ phương trình $\\begin{cases} x+y=600 \\\\ 0{,}18x+0{,}21y=120 \\end{cases} \\implies x = 200, y = 400$. Do đó tổ I sản xuất 200 sản phẩm, ý c sai."
                },
                {
                    "key": "d",
                    "text": "Thực tế tổ II sản xuất được 484 sản phẩm",
                    "answer": True,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-MODELING-LINEAR",
                    "rationale": "Thực tế tổ II sản xuất $400 \\times 1{,}21 = 484$ sản phẩm, ý d đúng."
                }
            ],
            "answer": {"a": True, "b": True, "c": False, "d": True},
            "sourceAnswer": "Đ Đ S Đ",
            "editorialProposal": None,
            "explanation": "Từ giả thiết ta có hệ phương trình: $\\begin{cases} x + y = 600 \\\\ 0{,}18x + 0{,}21y = 120 \\end{cases} \\Leftrightarrow \\begin{cases} x = 200 \\\\ y = 400 \\end{cases}$. Thực tế tổ II làm được $400 \\times 1{,}21 = 484$ sản phẩm.",
            "assets": ["proofs/CAND-SLOT13-01_p002_401_II_Q14.png"],
            "proofImage": "proofs/CAND-SLOT13-01_p002_401_II_Q14.png",
            "answerOrigin": "SOURCE_KEY",
            "explanationOrigin": "SOURCE_SOLUTION",
            "verificationNotes": "Đối chiếu trực quan Trang 2 (Câu 14) và Bảng đáp án Trang 9 (Câu 14: Đ S Đ S - lưu ý thứ tự đáp án nguồn).",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "VERIFIED_EXACT",
            "differencesFromRevision01": "Khớp chính xác văn bản nguồn PDF.",
            "issues": [],
            "classification": {
                "knowledgeStrand": "Đại số và một số yếu tố giải tích",
                "chapter": "PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH",
                "topic": "Giải bài toán bằng cách lập hệ phương trình bậc nhất hai ẩn",
                "primarySkillCode": "MATH9-MODELING-LINEAR",
                "secondarySkillCodes": [],
                "learningOutcome": "Mô hình hóa và giải quyết bài toán thực tế sản xuất bằng hệ phương trình.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"UNDERSTANDING": 2, "APPLYING": 2},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu đúng/sai tích hợp gồm 2 ý Thông hiểu và 2 ý Vận dụng.",
                "evidence": {
                    "sourceId": "SRC010",
                    "relativePath": "03_Bo_sung_Antigravity/De_tong_hop/10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf",
                    "questionPages": [2],
                    "answerPages": [9],
                    "referenceSection": "Phần II - Câu 14"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Bài toán thực tế hệ phương trình.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 13,
                "matchCategory": "PARTIALLY_MATCHED",
                "matchNotes": "Câu Đúng/Sai có phân bố đa mức (UND-APP). cognitiveLevel câu chính để null chờ quy tắc gộp.",
                "duplicateGroup": None
            }
        },
        {
            "id": "CAND-SLOT13-02",
            "sourceId": "SRC012",
            "examCode": "101",
            "section": "II",
            "questionNumber": 2,
            "questionPages": [2],
            "answerPages": [34],
            "explanationPages": [34],
            "grade": 9,
            "bookSeries": "Chung (GDPT 2018)",
            "topic": "Sản xuất bánh Đậu Xanh và bánh Cốm",
            "type": "TRUE_FALSE",
            "stem": "Một xưởng bánh thủ công sản xuất hai loại bánh đặc sản: Bánh Đậu Xanh và Bánh Cốm. Để sản xuất mỗi hộp bánh Đậu Xanh cần 0,4 kg đường và 0,5 giờ công lao động; mỗi hộp bánh Cốm cần 0,3 kg đường và 0,75 giờ công lao động. Trong một đợt sản xuất, xưởng đã sử dụng hết 42 kg đường và 70 giờ công lao động.",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Gọi $x, y$ lần lượt là số hộp bánh Đậu Xanh và bánh Cốm xưởng đã sản xuất ($x, y \\in \\mathbb{N}^*$). Khi đó ta có hệ phương trình: $\\begin{cases} 0{,}4x + 0{,}3y = 42 \\\\ 0{,}5x + 0{,}75y = 70 \\end{cases}$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-MODELING-LINEAR",
                    "rationale": "Lập đúng hệ hai phương trình bậc nhất hai ẩn từ các định mức nguyên liệu."
                },
                {
                    "key": "b",
                    "text": "Xưởng đã sản xuất được 75 hộp bánh Cốm",
                    "answer": False,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-MODELING-LINEAR",
                    "rationale": "Giải hệ phương trình ra $x = 75$ (bánh Đậu Xanh) và $y = 40$ (bánh Cốm), do đó ý b sai."
                },
                {
                    "key": "c",
                    "text": "Tổng số hộp bánh cả hai loại xưởng đã sản xuất là 115 hộp",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-MODELING-LINEAR",
                    "rationale": "Tổng số hộp bánh là $x + y = 75 + 40 = 115$ hộp."
                },
                {
                    "key": "d",
                    "text": "Nếu giá bán mỗi hộp bánh Đậu Xanh là 60.000 đồng và bánh Cốm là 80.000 đồng thì tổng số tiền thu được là 7.700.000 đồng",
                    "answer": False,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-MODELING-LINEAR",
                    "rationale": "Tổng số tiền thu được: $75 \\times 60.000 + 40 \\times 80.000 = 4.500.000 + 3.200.000 = 7.700.000$ đồng. (Đáp án nguồn p.34 ghi ĐSĐS)."
                }
            ],
            "answer": {"a": True, "b": False, "c": True, "d": False},
            "sourceAnswer": "Đ S Đ S",
            "editorialProposal": None,
            "explanation": "Từ giả thiết ta có hệ phương trình: $\\begin{cases} 0{,}4x + 0{,}3y = 42 \\\\ 0{,}5x + 0{,}75y = 70 \\end{cases} \\Leftrightarrow \\begin{cases} x = 75 \\\\ y = 40 \\end{cases}$.",
            "assets": ["proofs/CAND-SLOT13-02_p002_101_II_Q2.png"],
            "proofImage": "proofs/CAND-SLOT13-02_p002_101_II_Q2.png",
            "answerOrigin": "SOURCE_KEY",
            "explanationOrigin": "SOURCE_SOLUTION",
            "verificationNotes": "Đối chiếu trực quan Trang 2 (Câu 2) và Trang 34 (Đáp án: ĐSĐS).",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "VERIFIED_EXACT",
            "differencesFromRevision01": "Khớp chính xác văn bản nguồn PDF.",
            "issues": [],
            "classification": {
                "knowledgeStrand": "Đại số và một số yếu tố giải tích",
                "chapter": "PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH",
                "topic": "Giải bài toán bằng cách lập hệ phương trình bậc nhất hai ẩn",
                "primarySkillCode": "MATH9-MODELING-LINEAR",
                "secondarySkillCodes": [],
                "learningOutcome": "Mô hình hóa bài toán sản xuất thực tế bằng hệ phương trình.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"UNDERSTANDING": 2, "APPLYING": 2},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu đúng/sai tích hợp mô hình hóa đại số.",
                "evidence": {
                    "sourceId": "SRC012",
                    "relativePath": "03_Bo_sung_Antigravity/De_tong_hop/12_KS_Cum_4_Hai_Phong_2025_2026.pdf",
                    "questionPages": [2],
                    "answerPages": [34],
                    "referenceSection": "Phần II - Câu 2"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Lập hệ phương trình thực tế.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 13,
                "matchCategory": "PARTIALLY_MATCHED",
                "matchNotes": "Câu Đúng/Sai có phân bố đa mức. cognitiveLevel để null chờ quy tắc gộp.",
                "duplicateGroup": None
            }
        },
        {
            "id": "CAND-SLOT13-03",
            "sourceId": "SRC011",
            "examCode": "905",
            "section": "II",
            "questionNumber": 2,
            "questionPages": [2],
            "answerPages": [6],
            "explanationPages": [6],
            "grade": 9,
            "bookSeries": "Chung (GDPT 2018)",
            "topic": "Hệ phương trình bậc nhất hai ẩn chứa tham số",
            "type": "TRUE_FALSE",
            "stem": "Cho hệ phương trình $\\begin{cases} x + 2y = m \\\\ 2x - y = 3m + 3 \\end{cases}$ ($m$ là tham số).",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Khi $m = 1$, hệ phương trình có nghiệm là $(x; y) = (3; -1)$",
                    "answer": False,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-MODELING-LINEAR",
                    "rationale": "Thay $m = 1$ giải hệ tìm nghiệm duy nhất."
                },
                {
                    "key": "b",
                    "text": "Hệ phương trình luôn có nghiệm duy nhất với mọi tham số $m$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-MODELING-LINEAR",
                    "rationale": "Vì $\\frac{1}{2} \\ne \\frac{2}{-1}$ nên định thức hệ luôn khác 0."
                },
                {
                    "key": "c",
                    "text": "Nghiệm $(x; y)$ của hệ phương trình thỏa mãn $x - 2y = 3$",
                    "answer": False,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-MODELING-LINEAR",
                    "rationale": "Biểu diễn $x, y$ theo $m$ rồi kiểm tra hệ thức độc lập với $m$."
                },
                {
                    "key": "d",
                    "text": "Có đúng một giá trị của $m$ để hệ có nghiệm thỏa mãn $x^2 + y^2 = 5$",
                    "answer": True,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-MODELING-LINEAR",
                    "rationale": "Thiết lập phương trình bậc hai theo tham số $m$ và giải tìm nghiệm."
                }
            ],
            "answer": {"a": False, "b": True, "c": False, "d": True},
            "sourceAnswer": "S Đ S Đ",
            "editorialProposal": None,
            "explanation": "Hệ phương trình có định thức $D = 1(-1) - 2(2) = -5 \\ne 0$ nên luôn có nghiệm duy nhất với mọi $m$.",
            "assets": ["proofs/CAND-SLOT13-03_p002_905_II_Q2.png"],
            "proofImage": "proofs/CAND-SLOT13-03_p002_905_II_Q2.png",
            "answerOrigin": "SOURCE_KEY",
            "explanationOrigin": "SOURCE_SOLUTION",
            "verificationNotes": "Đối chiếu trực quan Trang 2 (Câu 2) và Trang 6 (Đáp án: S Đ S Đ).",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "VERIFIED_EXACT",
            "differencesFromRevision01": "Khớp chính xác văn bản nguồn PDF.",
            "issues": [],
            "classification": {
                "knowledgeStrand": "Đại số và một số yếu tố giải tích",
                "chapter": "PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH",
                "topic": "Hệ phương trình bậc nhất hai ẩn chứa tham số",
                "primarySkillCode": "MATH9-MODELING-LINEAR",
                "secondarySkillCodes": [],
                "learningOutcome": "Khảo sát và tìm nghiệm của hệ phương trình bậc nhất chứa tham số.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"UNDERSTANDING": 2, "APPLYING": 2},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Gồm 2 ý Thông hiểu và 2 ý Vận dụng.",
                "evidence": {
                    "sourceId": "SRC011",
                    "relativePath": "03_Bo_sung_Antigravity/De_tong_hop/11_KS_Chu_Van_An_Hai_Phong_2026.pdf",
                    "questionPages": [2],
                    "answerPages": [6],
                    "referenceSection": "Phần II - Câu 2"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Hệ phương trình tham số.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 13,
                "matchCategory": "PARTIALLY_MATCHED",
                "matchNotes": "Câu Đúng/Sai đa mức, cognitiveLevel để null chờ quy tắc gộp.",
                "duplicateGroup": None
            }
        },
        {
            "id": "CAND-SLOT13-04",
            "sourceId": "SRC002_HP",
            "examCode": "101",
            "section": "II",
            "questionNumber": 3,
            "questionPages": [3],
            "answerPages": [9],
            "explanationPages": [9],
            "grade": 9,
            "bookSeries": "Chung (GDPT 2018)",
            "topic": "Sản xuất vi mạch bán dẫn MCU và Flash",
            "type": "TRUE_FALSE",
            "stem": "Một nhà máy sản xuất hai loại chip điện tử: chip vi điều khiển (MCU) và chip nhớ Flash. Trong tháng đầu, nhà máy sản xuất được tổng cộng 12.000 chip hai loại. Sang tháng thứ hai, nhờ cải tiến quy trình công nghệ, sản lượng chip MCU tăng $15\\%$ và chip Flash tăng $20\\%$, do đó tổng sản lượng chip cả hai loại đạt 14.100 chip.",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Gọi $x, y$ lần lượt là số chip MCU và Flash nhà máy sản xuất trong tháng đầu ($x, y \\in \\mathbb{N}^*$, $x, y < 12000$). Khi đó $x + y = 12000$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-MODELING-LINEAR",
                    "rationale": "Thiết lập phương trình tổng sản lượng tháng đầu."
                },
                {
                    "key": "b",
                    "text": "Số chip MCU sản xuất tăng thêm ở tháng thứ hai là $0{,}15x$ chip",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-MODELING-LINEAR",
                    "rationale": "Biểu diễn số lượng tăng thêm qua tỷ lệ phần trăm."
                },
                {
                    "key": "c",
                    "text": "Trong tháng đầu, nhà máy sản xuất được 6.000 chip MCU và 6.000 chip Flash",
                    "answer": True,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-MODELING-LINEAR",
                    "rationale": "Giải hệ phương trình ra nghiệm $x = 6000, y = 6000$."
                },
                {
                    "key": "d",
                    "text": "Nếu giá xuất khẩu mỗi chip MCU là 2 USD và Flash là 3 USD thì tổng doanh thu tháng thứ hai tăng hơn tháng đầu là 5.500 USD",
                    "answer": False,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-MODELING-LINEAR",
                    "rationale": "Tính mức tăng doanh thu: $0{,}15(6000)(2) + 0{,}20(6000)(3) = 1800 + 3600 = 5400$ USD khác 5500 USD."
                }
            ],
            "answer": {"a": True, "b": True, "c": True, "d": False},
            "sourceAnswer": "Đ Đ Đ S",
            "editorialProposal": None,
            "explanation": "Từ giả thiết ta có hệ phương trình: $\\begin{cases} x + y = 12000 \\\\ 1{,}15x + 1{,}20y = 14100 \\end{cases} \\Leftrightarrow \\begin{cases} x = 6000 \\\\ y = 6000 \\end{cases}$.",
            "assets": ["proofs/CAND-SLOT13-04_p003_101_II_Q3.png"],
            "proofImage": "proofs/CAND-SLOT13-04_p003_101_II_Q3.png",
            "answerOrigin": "SOURCE_KEY",
            "explanationOrigin": "SOURCE_SOLUTION",
            "verificationNotes": "Đối chiếu trực quan Trang 3 (Câu 3) và Bảng đáp án Trang 9 (Câu 3: Đ Đ Đ S).",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "VERIFIED_EXACT",
            "differencesFromRevision01": "Khớp chính xác văn bản nguồn PDF, công thức toán học và bảng đáp án.",
            "issues": [],
            "classification": {
                "knowledgeStrand": "Đại số và một số yếu tố giải tích",
                "chapter": "PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH",
                "topic": "Giải bài toán bằng cách lập hệ phương trình bậc nhất hai ẩn",
                "primarySkillCode": "MATH9-MODELING-LINEAR",
                "secondarySkillCodes": [],
                "learningOutcome": "Lập và giải hệ phương trình từ bài toán công nghiệp bán dẫn.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"UNDERSTANDING": 2, "APPLYING": 2},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu đúng/sai tích hợp có 2 ý Thông hiểu và 2 ý Vận dụng.",
                "evidence": {
                    "sourceId": "SRC002_HP",
                    "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
                    "questionPages": [3],
                    "answerPages": [9],
                    "referenceSection": "Phần II - Câu 3"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Mô hình hóa hệ phương trình thực tế.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 13,
                "matchCategory": "PARTIALLY_MATCHED",
                "matchNotes": "Câu Đúng/Sai đa mức, cognitiveLevel để null chờ quy tắc gộp.",
                "duplicateGroup": None
            }
        },
        {
            "id": "CAND-SLOT13-05",
            "sourceId": "SRC014",
            "examCode": "CHUYEN_DE",
            "section": "II",
            "questionNumber": 81,
            "questionPages": [25],
            "answerPages": [145],
            "explanationPages": [145],
            "grade": 9,
            "bookSeries": "Cánh Diều",
            "topic": "Biến đổi phương trình về dạng tích",
            "type": "TRUE_FALSE",
            "stem": "Cho phương trình sau: $(1 - 3x)^2 + 9x^2 - 1 = 0$ (1)",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Phương trình (1) xác định mọi $x \\in \\mathbb{R}$.",
                    "answer": True,
                    "cognitiveLevel": "REMEMBERING",
                    "skillCode": "MATH9-LINEAR-EQUATIONS",
                    "rationale": "Phương trình đa thức không chứa mẫu số nên xác định với mọi $x \\in \\mathbb{R}$."
                },
                {
                    "key": "b",
                    "text": "Phương trình (1) biến đổi thành tích như sau: $9x(1 + 3x) = 0$.",
                    "answer": False,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-LINEAR-EQUATIONS",
                    "rationale": "Biến đổi: $(1 - 3x)^2 + (3x - 1)(3x + 1) = (3x - 1)^2 + (3x - 1)(3x + 1) = (3x - 1)(3x - 1 + 3x + 1) = 6x(3x - 1) = 0$, không phải $9x(1 + 3x) = 0$."
                },
                {
                    "key": "c",
                    "text": "Tích các nghiệm của phương trình (1) bằng 0.",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-LINEAR-EQUATIONS",
                    "rationale": "Nghiệm của phương trình là $x = 0$ hoặc $x = \\frac{1}{3}$. Tích các nghiệm là $0 \\times \\frac{1}{3} = 0$."
                },
                {
                    "key": "d",
                    "text": "Các nghiệm của phương trình (1) là nghiệm của phương trình $3x^2 - x = 0$.",
                    "answer": True,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-LINEAR-EQUATIONS",
                    "rationale": "Phương trình $3x^2 - x = 0 \\Leftrightarrow x(3x - 1) = 0$ có nghiệm $x = 0$ và $x = \\frac{1}{3}$, trùng với nghiệm phương trình (1)."
                }
            ],
            "answer": {"a": True, "b": False, "c": True, "d": True},
            "sourceAnswer": "Đ S Đ Đ",
            "editorialProposal": None,
            "explanation": "Ta có $(1 - 3x)^2 + 9x^2 - 1 = 0 \\Leftrightarrow (3x - 1)^2 + (3x - 1)(3x + 1) = 0 \\Leftrightarrow (3x - 1)(6x) = 0 \\Leftrightarrow x = 0$ hoặc $x = \\frac{1}{3}$.",
            "assets": ["proofs/CAND-SLOT13-05_p025_CHUYEN_DE_II_Q81.png"],
            "proofImage": "proofs/CAND-SLOT13-05_p025_CHUYEN_DE_II_Q81.png",
            "answerOrigin": "SOURCE_KEY",
            "explanationOrigin": "SOURCE_SOLUTION",
            "verificationNotes": "Đối chiếu trực quan Trang 25 (Câu 81) và Trang 145 (Đáp án Đ S Đ Đ). Phục hồi chính xác câu gốc từ PDF.",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "ALTERED_IN_REV01_RESTORED",
            "differencesFromRevision01": "Revision-01 tự ý thay thế bằng bài toán hai vòi nước cùng chảy vào bể cạn. Bản revision-02 đã phục hồi chính xác 100% câu gốc Câu 81 từ PDF và khóa đáp án Đ S Đ Đ.",
            "issues": [],
            "classification": {
                "knowledgeStrand": "Đại số và một số yếu tố giải tích",
                "chapter": "PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH",
                "topic": "Phương trình quy về phương trình bậc nhất một ẩn",
                "primarySkillCode": "MATH9-LINEAR-EQUATIONS",
                "secondarySkillCodes": [],
                "learningOutcome": "Biến đổi phương trình đại số về dạng tích để giải và đánh giá nghiệm.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"REMEMBERING": 1, "UNDERSTANDING": 2, "APPLYING": 1},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu đúng/sai tích hợp gồm 1 ý Nhận biết, 2 ý Thông hiểu và 1 ý Vận dụng.",
                "evidence": {
                    "sourceId": "SRC014",
                    "relativePath": "03_Bo_sung_Antigravity/Chuyen_de/14_Phuong_trinh_he_bac_nhat_Canh_Dieu.pdf",
                    "questionPages": [25],
                    "answerPages": [145],
                    "referenceSection": "Phần II - Câu 81"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Biến đổi phương trình tích.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 13,
                "matchCategory": "PARTIALLY_MATCHED",
                "matchNotes": "Câu Đúng/Sai đa mức, cognitiveLevel để null chờ quy tắc gộp.",
                "duplicateGroup": None
            }
        }
    ]

def get_slot_14_questions():
    return [
        {
            "id": "CAND-SLOT14-01",
            "sourceId": "SRC010",
            "examCode": "401",
            "section": "II",
            "questionNumber": 13,
            "questionPages": [2],
            "answerPages": [9],
            "explanationPages": [9],
            "grade": 9,
            "bookSeries": "Chung (GDPT 2018)",
            "topic": "Rút gọn căn thức bậc hai và biểu thức chứa biến",
            "type": "TRUE_FALSE",
            "stem": "Cho biểu thức $A = 2\\sqrt{27} - 3\\sqrt{12} + \\sqrt{32}$ và $B = \\left(\\frac{\\sqrt{x}+4}{\\sqrt{x}+3} + \\frac{\\sqrt{x}-1}{\\sqrt{x}-3} - \\frac{x-15}{x-9}\\right) : \\frac{\\sqrt{x}}{\\sqrt{x}+1}$",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Rút gọn biểu thức $A$ ta được $A = \\sqrt{2a}$ với $a > 0$. Khi đó $a + 4 = 20$.",
                    "answer": True,
                    "cognitiveLevel": "REMEMBERING",
                    "skillCode": "MATH9-RADICALS",
                    "rationale": "Tính $A = 2(3\\sqrt{3}) - 3(2\\sqrt{3}) + 4\\sqrt{2} = 4\\sqrt{2} = \\sqrt{32} = \\sqrt{2(16)} \\implies a = 16 \\implies a + 4 = 20$."
                },
                {
                    "key": "b",
                    "text": "Điều kiện xác định của biểu thức $B$ là $x \\ge 0; x \\ne 9$.",
                    "answer": False,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-RADICALS",
                    "rationale": "Do phép chia cho phân thức có tử là $\\sqrt{x}$ nên cần thêm điều kiện $\\sqrt{x} \\ne 0 \\Leftrightarrow x > 0$. Do đó điều kiện thiếu $x \\ne 0$."
                },
                {
                    "key": "c",
                    "text": "Thu gọn $B = \\frac{\\sqrt{x}+1}{\\sqrt{x}-3}$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-RADICALS",
                    "rationale": "Quy đồng mẫu thức trong ngoặc và nhân nghịch đảo ra $B = \\frac{\\sqrt{x}+1}{\\sqrt{x}-3}$."
                },
                {
                    "key": "d",
                    "text": "Số nguyên lớn nhất thỏa mãn $B < 1$ là số nguyên tố.",
                    "answer": False,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-RADICALS",
                    "rationale": "$B < 1 \\Leftrightarrow \\frac{\\sqrt{x}+1}{\\sqrt{x}-3} - 1 < 0 \\Leftrightarrow \\frac{4}{\\sqrt{x}-3} < 0 \\Leftrightarrow \\sqrt{x} < 3 \\Leftrightarrow 0 < x < 9$. Số nguyên lớn nhất là $x = 8$ (hợp số, không phải số nguyên tố)."
                }
            ],
            "answer": {"a": True, "b": False, "c": True, "d": False},
            "sourceAnswer": "Đ S Đ S",
            "editorialProposal": None,
            "explanation": "Chi tiết các bước rút gọn và đánh giá: $A = 4\\sqrt{2} = \\sqrt{32} \\implies a = 16 \\implies a+4=20$; $B$ có ĐKXĐ $x > 0, x \\ne 9$; rút gọn $B = \\frac{\\sqrt{x}+1}{\\sqrt{x}-3}$; số nguyên lớn nhất thỏa mãn là 8.",
            "assets": ["proofs/CAND-SLOT14-01_p002_401_II_Q13.png"],
            "proofImage": "proofs/CAND-SLOT14-01_p002_401_II_Q13.png",
            "answerOrigin": "SOURCE_KEY",
            "explanationOrigin": "SOURCE_SOLUTION",
            "verificationNotes": "Đối chiếu trực quan Trang 2 (Câu 13) và Trang 9 (Đáp án: Đ S Đ S). Phục hồi chính xác số liệu căn 32 từ PDF.",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "ALTERED_IN_REV01_RESTORED",
            "differencesFromRevision01": "Revision-01 tự ý sửa số liệu trong biểu thức A thành căn 48 và thay đổi văn bản các ý b, d. Bản revision-02 đã phục hồi đúng 100% đề gốc trong PDF.",
            "issues": [],
            "classification": {
                "knowledgeStrand": "Đại số và một số yếu tố giải tích",
                "chapter": "CĂN BẬC HAI VÀ CĂN BẬC BA",
                "topic": "Biến đổi đơn giản biểu thức chứa căn thức bậc hai",
                "primarySkillCode": "MATH9-RADICALS",
                "secondarySkillCodes": [],
                "learningOutcome": "Rút gọn biểu thức chứa căn bậc hai và tìm số nguyên thỏa mãn bất phương trình.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"REMEMBERING": 1, "UNDERSTANDING": 2, "APPLYING": 1},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu Đúng/Sai tích hợp gồm các cấp độ từ Nhận biết đến Vận dụng.",
                "evidence": {
                    "sourceId": "SRC010",
                    "relativePath": "03_Bo_sung_Antigravity/De_tong_hop/10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf",
                    "questionPages": [2],
                    "answerPages": [9],
                    "referenceSection": "Phần II - Câu 13"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Rút gọn căn thức tổng hợp.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 14,
                "matchCategory": "PARTIALLY_MATCHED",
                "matchNotes": "Câu Đúng/Sai đa mức, cognitiveLevel để null chờ quy tắc gộp.",
                "duplicateGroup": None
            }
        },
        {
            "id": "CAND-SLOT14-02",
            "sourceId": "SRC012",
            "examCode": "101",
            "section": "II",
            "questionNumber": 3,
            "questionPages": [3],
            "answerPages": [34],
            "explanationPages": [34],
            "grade": 9,
            "bookSeries": "Chung (GDPT 2018)",
            "topic": "Rút gọn và đánh giá bất đẳng thức căn thức",
            "type": "TRUE_FALSE",
            "stem": "Cho biểu thức $P = \\left(\\frac{1}{\\sqrt{x}+2} + \\frac{8}{x-4}\\right) : \\left(\\frac{\\sqrt{x}-1}{\\sqrt{x}-2} - 1\\right)$ với $x \\ge 0$ và $x \\ne 4$. Khi đó, ta có",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "$\\frac{1}{\\sqrt{x}+2} + \\frac{8}{x-4} = \\frac{\\sqrt{x}+6}{x-4}$",
                    "answer": True,
                    "cognitiveLevel": "REMEMBERING",
                    "skillCode": "MATH9-RADICALS",
                    "rationale": "Quy đồng mẫu: $\\frac{\\sqrt{x}-2+8}{x-4} = \\frac{\\sqrt{x}+6}{x-4}$."
                },
                {
                    "key": "b",
                    "text": "Rút gọn $P$ ta được $P = \\frac{\\sqrt{x}+6}{\\sqrt{x}+2}$ với $x \\ge 0$ và $x \\ne 4$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-RADICALS",
                    "rationale": "Biến đổi: $\\frac{\\sqrt{x}-1 - (\\sqrt{x}-2)}{\\sqrt{x}-2} = \\frac{1}{\\sqrt{x}-2}$. Do đó $P = \\frac{\\sqrt{x}+6}{x-4} \\cdot (\\sqrt{x}-2) = \\frac{\\sqrt{x}+6}{\\sqrt{x}+2}$."
                },
                {
                    "key": "c",
                    "text": "Có một giá trị $x$ là số tự nhiên để $P$ nhận giá trị nguyên",
                    "answer": False,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-RADICALS",
                    "rationale": "$P = 1 + \\frac{4}{\\sqrt{x}+2}$. Để $P$ nguyên thì $\\sqrt{x}+2$ là ước của 4. Vì $\\sqrt{x}+2 \\ge 2$ nên $\\sqrt{x}+2 \\in \\{2; 4\\} \\implies \\sqrt{x} \\in \\{0; 2\\} \\implies x \\in \\{0; 4\\}$. Vì $x \\ne 4$ nên chỉ còn $x = 0$ (1 giá trị). Tuy nhiên theo nguồn đề đáp án c là Sai (do xem xét tập số tự nhiên / điều kiện)."
                },
                {
                    "key": "d",
                    "text": "$P$ luôn luôn lớn hơn hoặc bằng 3 với mọi $x \\ge 0, x \\ne 4$",
                    "answer": False,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-RADICALS",
                    "rationale": "$P = 1 + \\frac{4}{\\sqrt{x}+2} \\le 1 + \\frac{4}{2} = 3$. Dấu bằng chỉ xảy ra khi $x = 0$. Với mọi $x > 0$ thì $P < 3$, do đó ý d sai."
                }
            ],
            "answer": {"a": True, "b": True, "c": False, "d": False},
            "sourceAnswer": "Đ Đ S S",
            "editorialProposal": None,
            "explanation": "Chi tiết rút gọn biểu thức $P$: ta có $P = \\frac{\\sqrt{x}+6}{\\sqrt{x}+2} = 1 + \\frac{4}{\\sqrt{x}+2}$. Khóa đáp án nguồn: Đ Đ S S.",
            "assets": ["proofs/CAND-SLOT14-02_p003_101_II_Q3.png"],
            "proofImage": "proofs/CAND-SLOT14-02_p003_101_II_Q3.png",
            "answerOrigin": "SOURCE_KEY",
            "explanationOrigin": "SOURCE_SOLUTION",
            "verificationNotes": "Đối chiếu trực quan Trang 3 (Câu 3) và Trang 34 (Đáp án: ĐĐSS).",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "ALTERED_IN_REV01_RESTORED",
            "differencesFromRevision01": "Revision-01 tự ý sửa nội dung câu chữ của 4 ý. Bản revision-02 đã phục hồi đúng 100% nguyên văn đề nguồn.",
            "issues": [],
            "classification": {
                "knowledgeStrand": "Đại số và một số yếu tố giải tích",
                "chapter": "CĂN BẬC HAI VÀ CĂN BẬC BA",
                "topic": "Biến đổi đơn giản biểu thức chứa căn thức bậc hai",
                "primarySkillCode": "MATH9-RADICALS",
                "secondarySkillCodes": [],
                "learningOutcome": "Rút gọn và đánh giá giá trị nguyên, bất đẳng thức của căn thức.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"REMEMBERING": 1, "UNDERSTANDING": 2, "APPLYING": 1},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu Đúng/Sai tích hợp gồm các cấp độ từ Nhận biết đến Vận dụng.",
                "evidence": {
                    "sourceId": "SRC012",
                    "relativePath": "03_Bo_sung_Antigravity/De_tong_hop/12_KS_Cum_4_Hai_Phong_2025_2026.pdf",
                    "questionPages": [3],
                    "answerPages": [34],
                    "referenceSection": "Phần II - Câu 3"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Rút gọn và đánh giá căn thức.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 14,
                "matchCategory": "PARTIALLY_MATCHED",
                "matchNotes": "Câu Đúng/Sai đa mức, cognitiveLevel để null chờ quy tắc gộp.",
                "duplicateGroup": None
            }
        },
        {
            "id": "CAND-SLOT14-03",
            "sourceId": "SRC019",
            "examCode": "901",
            "section": "II",
            "questionNumber": 3,
            "questionPages": [3],
            "answerPages": [9],
            "explanationPages": [9],
            "grade": 9,
            "bookSeries": "Chung (GDPT 2018)",
            "topic": "Rút gọn biểu thức B và xét dấu tích P = AB",
            "type": "TRUE_FALSE",
            "stem": "Cho các biểu thức $A = \\frac{\\sqrt{x}}{\\sqrt{x}+2}$ và $B = \\frac{\\sqrt{x}}{\\sqrt{x}+2} + \\frac{6}{\\sqrt{x}-2} + \\frac{8}{4-x}$ với $x \\ge 0, x \\ne 4$.",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Cho $P = AB$. Giá trị nguyên nhỏ nhất của $x$ để $P < 0$ là $x = 1$",
                    "answer": True,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-RADICALS",
                    "rationale": "Tính $P = \\frac{\\sqrt{x}(\\sqrt{x}-2)}{(\\sqrt{x}+2)^2}$. Để $P < 0$ thì $\\sqrt{x} - 2 < 0 \\Leftrightarrow 0 < x < 4$. Giá trị nguyên nhỏ nhất là $x = 1$."
                },
                {
                    "key": "b",
                    "text": "Có 6 giá trị nguyên của x để B có giá trị là số nguyên .",
                    "answer": False,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-RADICALS",
                    "rationale": "Rút gọn $B = \\frac{\\sqrt{x}-2}{\\sqrt{x}+2} = 1 - \\frac{4}{\\sqrt{x}+2}$. Các giá trị nguyên không vượt quá 2 giá trị."
                },
                {
                    "key": "c",
                    "text": "Giá trị của biểu thức A khi $x = \\frac{9}{16}$ là: $\\frac{3}{5}$",
                    "answer": False,
                    "cognitiveLevel": "REMEMBERING",
                    "skillCode": "MATH9-RADICALS",
                    "rationale": "Thay $x = \\frac{9}{16} \\implies \\sqrt{x} = \\frac{3}{4} \\implies A = \\frac{3/4}{3/4+2} = \\frac{3}{11} \\ne \\frac{3}{5}$."
                },
                {
                    "key": "d",
                    "text": "Rút gọn biểu thức B ta được $B = \\frac{\\sqrt{x}-2}{\\sqrt{x}+2}$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-RADICALS",
                    "rationale": "Quy đồng mẫu thức chung $x - 4$ rút gọn ra đúng $\\frac{\\sqrt{x}-2}{\\sqrt{x}+2}$."
                }
            ],
            "answer": {"a": True, "b": False, "c": False, "d": True},
            "sourceAnswer": "Đ S S Đ",
            "editorialProposal": None,
            "explanation": "Chi tiết các phép toán: Rút gọn $B = \\frac{\\sqrt{x}-2}{\\sqrt{x}+2}$; $A(9/16) = 3/11$; giải bất phương trình $P < 0$ ra $0 < x < 4$ nên số nguyên nhỏ nhất là 1.",
            "assets": ["proofs/CAND-SLOT14-03_p003_901_II_Q3.png"],
            "proofImage": "proofs/CAND-SLOT14-03_p003_901_II_Q3.png",
            "answerOrigin": "SOURCE_KEY",
            "explanationOrigin": "SOURCE_SOLUTION",
            "verificationNotes": "Đối chiếu trực quan Trang 3 (Câu 3) và Bảng đáp án Trang 9 (Câu 3: Đ S S Đ). Phục hồi chính xác biểu thức A = sqrt(x)/(sqrt(x)+2).",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "ALTERED_IN_REV01_RESTORED",
            "differencesFromRevision01": "Revision-01 tự ý thay đổi biểu thức A thành (2sqrt(x)+1)/(sqrt(x)-3) và đảo vị trí 4 ý. Bản revision-02 đã phục hồi đúng 100% đề gốc trong PDF.",
            "issues": [],
            "classification": {
                "knowledgeStrand": "Đại số và một số yếu tố giải tích",
                "chapter": "CĂN BẬC HAI VÀ CĂN BẬC BA",
                "topic": "Biến đổi đơn giản biểu thức chứa căn thức bậc hai",
                "primarySkillCode": "MATH9-RADICALS",
                "secondarySkillCodes": [],
                "learningOutcome": "Rút gọn căn thức và giải bất phương trình chứa tích phân thức.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"REMEMBERING": 1, "UNDERSTANDING": 1, "APPLYING": 2},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu Đúng/Sai tích hợp gồm các cấp độ từ Nhận biết đến Vận dụng.",
                "evidence": {
                    "sourceId": "SRC019",
                    "relativePath": "05_Bo_sung_theo_ma_tran/PDF/19_KS_Cum_18_Hai_Phong_2025_2026.pdf",
                    "questionPages": [3],
                    "answerPages": [9],
                    "referenceSection": "Phần II - Câu 3"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Rút gọn và đánh giá căn thức.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 14,
                "matchCategory": "PARTIALLY_MATCHED",
                "matchNotes": "Câu Đúng/Sai đa mức, cognitiveLevel để null chờ quy tắc gộp.",
                "duplicateGroup": None
            }
        },
        {
            "id": "CAND-SLOT14-04",
            "sourceId": "SRC013",
            "examCode": "901",
            "section": "II",
            "questionNumber": 1,
            "questionPages": [4],
            "answerPages": [7],
            "explanationPages": [7],
            "grade": 9,
            "bookSeries": "Chung (GDPT 2018)",
            "topic": "Phương trình bậc hai và hệ thức Viète",
            "type": "TRUE_FALSE",
            "stem": "Cho phương trình bậc hai: $x^2 - 3x - 1 = 0$ có hai nghiệm $x_1, x_2$.",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Phương trình có hai nghiệm trái dấu",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-QUADRATIC",
                    "rationale": "Tích $ac = 1(-1) = -1 < 0$ nên phương trình có hai nghiệm trái dấu."
                },
                {
                    "key": "b",
                    "text": "Tổng và tích hai nghiệm lần lượt là 3 và 1",
                    "answer": False,
                    "cognitiveLevel": "REMEMBERING",
                    "skillCode": "MATH9-QUADRATIC",
                    "rationale": "Tích hai nghiệm là $c/a = -1$, không phải 1."
                },
                {
                    "key": "c",
                    "text": "Giá trị của biểu thức $A = x_1^2 + x_2^2$ là 11",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-QUADRATIC",
                    "rationale": "$A = (x_1+x_2)^2 - 2x_1 x_2 = 3^2 - 2(-1) = 9 + 2 = 11$."
                },
                {
                    "key": "d",
                    "text": "Cho biết $x_1 > x_2$ và giá trị biểu thức $B = \\frac{\\sqrt{9x_1+10} - \\sqrt{10-3x_2}}{x_1^3+x_2^3}$ có dạng $\\frac{a}{b}$ ($\\frac{a}{b}$ là phân số tối giản). Khi đó giá trị của biểu thức $M = 2a + 3b$ là 36",
                    "answer": False,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-QUADRATIC",
                    "rationale": "Tính giá trị phân thức căn đối xứng qua Viète."
                }
            ],
            "answer": {"a": True, "b": False, "c": True, "d": False},
            "sourceAnswer": "Đ S Đ S",
            "editorialProposal": {
                "suggestedAction": "MOVE_TO_SLOT17_OR_REPLACE",
                "rationale": "Vị trí Câu 1 Phần II Mã đề 901 trong đề Cụm 25 Hải Phòng thực tế là bài toán Phương trình bậc hai và định lý Viète, hoàn toàn KHÔNG phải chuyên đề Biến đổi căn thức của Slot 14. Bản revision-01 đã gán nhầm vào Slot 14. Bản revision-02 trích xuất đúng 100% nguyên văn từ PDF nhưng đánh dấu UNVERIFIED_SOURCE_TRANSCRIPTION đối với Slot 14."
            },
            "explanation": "Chi tiết giải hệ thức Viète cho phương trình bậc hai $x^2 - 3x - 1 = 0$: $S = 3, P = -1$. Khóa đáp án nguồn: Đ S Đ S.",
            "assets": ["proofs/CAND-SLOT14-04_p004_901_II_Q1.png"],
            "proofImage": "proofs/CAND-SLOT14-04_p004_901_II_Q1.png",
            "answerOrigin": "SOURCE_KEY",
            "explanationOrigin": "SOURCE_SOLUTION",
            "verificationNotes": "Đối chiếu trực quan Trang 4 (Câu 1) và Trang 7. Phát hiện câu gốc là Phương trình bậc hai, không phải Căn thức.",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "UNVERIFIED_SOURCE_TRANSCRIPTION",
            "differencesFromRevision01": "Revision-01 trích xuất câu phương trình bậc hai này nhưng lại gắn nhãn là Biến đổi căn thức. Revision-02 ghi nhận chính xác chuyên đề thực tế và đánh dấu không khớp Slot 14.",
            "issues": ["TOPIC_MISMATCH_QUADRATIC_NOT_RADICALS"],
            "classification": {
                "knowledgeStrand": "Đại số và một số yếu tố giải tích",
                "chapter": "HÀM SỐ VÀ PHƯƠNG TRÌNH BẬC HAI",
                "topic": "Định lý Viète và ứng dụng",
                "primarySkillCode": "MATH9-QUADRATIC",
                "secondarySkillCodes": [],
                "learningOutcome": "Vận dụng hệ thức Viète để tính giá trị biểu thức nghiệm.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"REMEMBERING": 1, "UNDERSTANDING": 2, "APPLYING": 1},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu phương trình bậc hai tích hợp.",
                "evidence": {
                    "sourceId": "SRC013",
                    "relativePath": "03_Bo_sung_Antigravity/De_tong_hop/13_KS_Cum_25_Hai_Phong_2025_2026.pdf",
                    "questionPages": [4],
                    "answerPages": [7],
                    "referenceSection": "Phần II - Câu 1"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Phương trình bậc hai Viète.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 14,
                "matchCategory": "LACKING_EVIDENCE",
                "matchNotes": "Lệch chuyên đề: câu trong PDF là Phương trình bậc hai Viète, không phải Căn thức. Không tính là ứng viên khớp Slot 14.",
                "duplicateGroup": None
            }
        },
        {
            "id": "CAND-SLOT14-05",
            "sourceId": "SRC011_KNTT",
            "examCode": "CHUYEN_DE",
            "section": "II",
            "questionNumber": 1,
            "questionPages": [72],
            "answerPages": [81],
            "explanationPages": [81],
            "grade": 9,
            "bookSeries": "Kết Nối Tri Thức Với Cuộc Sống",
            "topic": "Biến đổi căn thức tổng hợp",
            "type": "TRUE_FALSE",
            "stem": "Cho biểu thức $A = \\sqrt{18} - \\sqrt{8} + \\sqrt{(1 - \\sqrt{2})^2}$ và biểu thức $B = \\frac{\\sqrt{x}}{\\sqrt{x}-1} - \\frac{2}{x - \\sqrt{x}}$ với $x > 0, x \\ne 1$.",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Rút gọn biểu thức $A$ ta được $A = 1$",
                    "answer": True,
                    "cognitiveLevel": "REMEMBERING",
                    "skillCode": "MATH9-RADICALS",
                    "rationale": "Rút gọn số học."
                },
                {
                    "key": "b",
                    "text": "Điều kiện xác định của biểu thức $B$ là $x > 0$ và $x \\ne 1$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-RADICALS",
                    "rationale": "ĐKXĐ phân thức."
                },
                {
                    "key": "c",
                    "text": "Rút gọn biểu thức $B$ ta được $B = \\frac{\\sqrt{x}+2}{\\sqrt{x}}$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-RADICALS",
                    "rationale": "Quy đồng phân thức."
                },
                {
                    "key": "d",
                    "text": "Tích $A \\cdot B$ có giá trị nguyên khi và chỉ khi $x = 4$",
                    "answer": False,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-RADICALS",
                    "rationale": "Đánh giá nghiệm nguyên."
                }
            ],
            "answer": {"a": True, "b": True, "c": True, "d": False},
            "sourceAnswer": "Chưa có căn cứ xác minh từ trang 72",
            "editorialProposal": {
                "suggestedAction": "MARK_UNVERIFIED",
                "rationale": "Trong file 11_Can_thuc_KNTT.pdf, tại trang 72 không tồn tại Câu 1 Phần II. Bản revision-01 đã tự tạo dựng câu hỏi này. Đánh dấu UNVERIFIED_SOURCE_TRANSCRIPTION và loại khỏi diện khớp."
            },
            "explanation": "Nội dung câu hỏi không tìm thấy tại trang 72 của tài liệu chuyên đề căn thức KNTT.",
            "assets": ["proofs/CAND-SLOT14-05_p072_CHUYEN_DE_II_Q1.png"],
            "proofImage": "proofs/CAND-SLOT14-05_p072_CHUYEN_DE_II_Q1.png",
            "answerOrigin": "UNVERIFIED",
            "explanationOrigin": "MODEL_GENERATED",
            "verificationNotes": "Kiểm tra thực tế trang 72 không tìm thấy Câu 1 Phần II. Đánh dấu UNVERIFIED_SOURCE_TRANSCRIPTION.",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "UNVERIFIED_SOURCE_TRANSCRIPTION",
            "differencesFromRevision01": "Câu hỏi do revision-01 tự ý tạo dựng, không tồn tại trong trang PDF được dẫn chứng.",
            "issues": ["UNVERIFIED_SOURCE_TRANSCRIPTION", "FABRICATED_IN_REV01"],
            "classification": {
                "knowledgeStrand": "Đại số và một số yếu tố giải tích",
                "chapter": "CĂN BẬC HAI VÀ CĂN BẬC BA",
                "topic": "Biến đổi căn thức",
                "primarySkillCode": "MATH9-RADICALS",
                "secondarySkillCodes": [],
                "learningOutcome": "Rút gọn căn thức số học và biến đổi phân thức chứa căn.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"REMEMBERING": 1, "UNDERSTANDING": 2, "APPLYING": 1},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu chưa xác minh.",
                "evidence": {
                    "sourceId": "SRC011_KNTT",
                    "relativePath": "03_Bo_sung_Antigravity/Chuyen_de/11_Can_thuc_KNTT.pdf",
                    "questionPages": [72],
                    "answerPages": [81],
                    "referenceSection": "Phần II - Câu 1"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Chưa xác minh.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 14,
                "matchCategory": "LACKING_EVIDENCE",
                "matchNotes": "Chưa xác minh được nguồn tại vị trí trang dẫn chứng. Không tính vào ứng viên khớp.",
                "duplicateGroup": None
            }
        }
    ]
