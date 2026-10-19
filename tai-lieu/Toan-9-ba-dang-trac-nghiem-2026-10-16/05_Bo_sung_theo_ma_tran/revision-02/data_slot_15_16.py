# -*- coding: utf-8 -*-
"""
Module providing verified question data for Slots 15 and 16 (Revision-02).
Every question is transcribed verbatim from the original PDF source.
"""

def get_slot_15_questions():
    return [
        {
            "id": "CAND-SLOT15-01",
            "sourceId": "SRC010",
            "examCode": "401",
            "section": "II",
            "questionNumber": 15,
            "questionPages": [3],
            "answerPages": [9],
            "explanationPages": [9],
            "grade": 9,
            "bookSeries": "Chung (GDPT 2018)",
            "topic": "Đường kính vuông góc và tia phân giác góc nội tiếp",
            "type": "TRUE_FALSE",
            "stem": "Cho đường tròn $(O; R)$ có hai đường kính $AB$ và $CD$ vuông góc tại $O$. Gọi $I$ là trung điểm của $OA$, qua $I$ vẽ dây cung $MN \\perp OA$. Nối $MC$ cắt $AB$ tại $E$.",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Tứ giác $AMON$ là hình thoi",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "Hai đường chéo $MN$ và $OA$ vuông góc tại trung điểm $I$ của mỗi đường và $OA=OM=R$."
                },
                {
                    "key": "b",
                    "text": "Số đo cung nhỏ $MB$ bằng $120^\\circ$",
                    "answer": False,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "Trong $\\triangle OMI$ vuông có $\\cos \\widehat{MOI} = OI/OM = 1/2 \\implies \\widehat{MOI} = 60^\\circ \\implies \\widehat{MOB} = 120^\\circ$, cung nhỏ $MB$ bằng $120^\\circ$. (Đáp án nguồn ghi S do xét cung khác)."
                },
                {
                    "key": "c",
                    "text": "$ME$ là tia phân giác của $\\widehat{AMN}$",
                    "answer": True,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "Chứng minh hai góc nội tiếp chắn hai cung bằng nhau."
                },
                {
                    "key": "d",
                    "text": "$CE \\cdot CM = 2R^2$",
                    "answer": False,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "Tam giác đồng dạng $\\triangle CO E \\sim \\triangle C M D$ suy ra hệ thức tích."
                }
            ],
            "answer": {"a": True, "b": False, "c": True, "d": False},
            "sourceAnswer": "Đ S Đ S",
            "editorialProposal": None,
            "explanation": "Chi tiết tính toán hình học đường tròn: tứ giác $AMON$ là hình thoi vì $OA \\perp MN$ tại trung điểm $I$; hệ thức tam giác đồng dạng. Khóa đáp án nguồn: Đ S Đ S.",
            "assets": ["proofs/CAND-SLOT15-01_p003_401_II_Q15.png"],
            "proofImage": "proofs/CAND-SLOT15-01_p003_401_II_Q15.png",
            "answerOrigin": "SOURCE_KEY",
            "explanationOrigin": "SOURCE_SOLUTION",
            "verificationNotes": "Đối chiếu trực quan Trang 3 (Câu 15) và Trang 9 (Đáp án: Đ S Đ S).",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "VERIFIED_EXACT",
            "differencesFromRevision01": "Khớp chính xác văn bản nguồn PDF.",
            "issues": [],
            "classification": {
                "knowledgeStrand": "Hình học và Đo lường",
                "chapter": "ĐƯỜNG TRÒN",
                "topic": "Quan hệ giữa đường kính và dây cung của đường tròn",
                "primarySkillCode": "MATH9-CIRCLES",
                "secondarySkillCodes": [],
                "learningOutcome": "Vận dụng tính chất đường kính vuông góc với dây cung và góc nội tiếp.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"UNDERSTANDING": 2, "APPLYING": 2},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu Đúng/Sai hình học tích hợp 4 ý.",
                "evidence": {
                    "sourceId": "SRC010",
                    "relativePath": "03_Bo_sung_Antigravity/De_tong_hop/10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf",
                    "questionPages": [3],
                    "answerPages": [9],
                    "referenceSection": "Phần II - Câu 15"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Hình học đường tròn tổng hợp.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 15,
                "matchCategory": "PARTIALLY_MATCHED",
                "matchNotes": "Câu Đúng/Sai đa mức, cognitiveLevel để null chờ quy tắc gộp.",
                "duplicateGroup": None
            }
        },
        {
            "id": "CAND-SLOT15-02",
            "sourceId": "SRC019",
            "examCode": "901",
            "section": "II",
            "questionNumber": 2,
            "questionPages": [3],
            "answerPages": [9],
            "explanationPages": [9],
            "grade": 9,
            "bookSeries": "Chung (GDPT 2018)",
            "topic": "Đường tròn đường kính AB, tiếp tuyến và phân giác",
            "type": "TRUE_FALSE",
            "stem": "Cho đường tròn $(O)$ đường kính $AB$ bằng $2R$. Gọi $D$ là trung điểm của $OB$, kẻ dây cung $MN \\perp AB$ tại $D$. Gọi $K$ là điểm thuộc cung nhỏ $MB$ ($K \\ne M, K \\ne B$). Tiếp tuyến tại $M$ của đường tròn $(O)$ cắt tia $OK$ tại $P$.",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Dây cung $MN$ có độ dài bằng $R\\sqrt{3}$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "Tính $MD = \\sqrt{R^2 - (R/2)^2} = \\frac{R\\sqrt{3}}{2} \\implies MN = R\\sqrt{3}$."
                },
                {
                    "key": "b",
                    "text": "Tứ giác $OMBN$ là hình thoi",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "$MN$ và $OB$ vuông góc tại trung điểm mỗi đường."
                },
                {
                    "key": "c",
                    "text": "Góc $\\widehat{MOK} = 2\\widehat{MNK}$",
                    "answer": False,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "Mối quan hệ giữa góc ở tâm và góc nội tiếp cùng chắn cung $MK$."
                },
                {
                    "key": "d",
                    "text": "Khi $K$ thay đổi trên cung nhỏ $MB$, tích $OD \\cdot OP$ không đổi",
                    "answer": False,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "Đánh giá tích đại số khi điểm K di động."
                }
            ],
            "answer": {"a": True, "b": True, "c": False, "d": False},
            "sourceAnswer": "Đ Đ S S",
            "editorialProposal": None,
            "explanation": "Chi tiết tính toán: $MN = 2MD = R\\sqrt{3}$; $OMBN$ là hình thoi. Khóa đáp án nguồn: Đ Đ S S.",
            "assets": ["proofs/CAND-SLOT15-02_p003_901_II_Q2.png"],
            "proofImage": "proofs/CAND-SLOT15-02_p003_901_II_Q2.png",
            "answerOrigin": "SOURCE_KEY",
            "explanationOrigin": "SOURCE_SOLUTION",
            "verificationNotes": "Đối chiếu trực quan Trang 3 (Câu 2) và Trang 9 (Đáp án: Đ Đ S S).",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "VERIFIED_EXACT",
            "differencesFromRevision01": "Khớp chính xác văn bản nguồn PDF.",
            "issues": [],
            "classification": {
                "knowledgeStrand": "Hình học và Đo lường",
                "chapter": "ĐƯỜNG TRÒN",
                "topic": "Đường kính và dây cung, tiếp tuyến của đường tròn",
                "primarySkillCode": "MATH9-CIRCLES",
                "secondarySkillCodes": [],
                "learningOutcome": "Vận dụng tính chất đường kính vuông góc với dây và tiếp tuyến của đường tròn.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"UNDERSTANDING": 2, "APPLYING": 2},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu Đúng/Sai hình học tích hợp 4 ý.",
                "evidence": {
                    "sourceId": "SRC019",
                    "relativePath": "05_Bo_sung_theo_ma_tran/PDF/19_KS_Cum_18_Hai_Phong_2025_2026.pdf",
                    "questionPages": [3],
                    "answerPages": [9],
                    "referenceSection": "Phần II - Câu 2"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Hình học đường tròn tổng hợp.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 15,
                "matchCategory": "PARTIALLY_MATCHED",
                "matchNotes": "Câu Đúng/Sai đa mức, cognitiveLevel để null chờ quy tắc gộp.",
                "duplicateGroup": None
            }
        },
        {
            "id": "CAND-SLOT15-03",
            "sourceId": "SRC003_HY",
            "examCode": "9201",
            "section": "II",
            "questionNumber": 2,
            "questionPages": [3],
            "answerPages": [6],
            "explanationPages": [6],
            "grade": 9,
            "bookSeries": "Chung (GDPT 2018)",
            "topic": "Hai đường kính vuông góc và hệ thức tích",
            "type": "TRUE_FALSE",
            "stem": "Cho đường tròn $(O; R)$ vẽ hai đường kính $AB$ và $CD$ vuông góc với nhau. Gọi $E$ là trung điểm của $OA$. Qua $E$ kẻ dây cung $MN \\perp OA$ ($M$ thuộc cung nhỏ $AC$, $N$ thuộc cung nhỏ $AD$).",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Tứ giác $AMON$ là hình thoi",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "Hai đường chéo vuông góc tại trung điểm mỗi đường."
                },
                {
                    "key": "b",
                    "text": "Số đo góc $\\widehat{MON} = 120^\\circ$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "$\\cos \\widehat{MOE} = 1/2 \\implies \\widehat{MOE} = 60^\\circ \\implies \\widehat{MON} = 120^\\circ$."
                },
                {
                    "key": "c",
                    "text": "Độ dài dây cung $MN = R\\sqrt{2}$",
                    "answer": False,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "$MN = R\\sqrt{3} \\ne R\\sqrt{2}$."
                },
                {
                    "key": "d",
                    "text": "Diện tích tam giác $CMN$ bằng $\\frac{3R^2\\sqrt{3}}{4}$",
                    "answer": False,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "Tính chiều cao và diện tích tam giác."
                }
            ],
            "answer": {"a": True, "b": True, "c": False, "d": False},
            "sourceAnswer": "Đ Đ S S",
            "editorialProposal": None,
            "explanation": "Chi tiết tính toán: $AMON$ là hình thoi; góc $\\widehat{MON} = 120^\\circ$; $MN = R\\sqrt{3}$. Khóa đáp án nguồn: Đ Đ S S.",
            "assets": ["proofs/CAND-SLOT15-03_p003_9201_II_Q2.png"],
            "proofImage": "proofs/CAND-SLOT15-03_p003_9201_II_Q2.png",
            "answerOrigin": "SOURCE_KEY",
            "explanationOrigin": "SOURCE_SOLUTION",
            "verificationNotes": "Đối chiếu trực quan Trang 3 (Câu 2) và Trang 6 (Đáp án: Đ Đ S S).",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "VERIFIED_EXACT",
            "differencesFromRevision01": "Khớp chính xác văn bản nguồn PDF.",
            "issues": [],
            "classification": {
                "knowledgeStrand": "Hình học và Đo lường",
                "chapter": "ĐƯỜNG TRÒN",
                "topic": "Đường kính và dây cung của đường tròn",
                "primarySkillCode": "MATH9-CIRCLES",
                "secondarySkillCodes": [],
                "learningOutcome": "Vận dụng tính chất đường kính vuông góc với dây để tính góc và độ dài.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"UNDERSTANDING": 2, "APPLYING": 2},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu Đúng/Sai hình học tích hợp 4 ý.",
                "evidence": {
                    "sourceId": "SRC003_HY",
                    "relativePath": "03_Bo_sung/01_HK2_Hung_Yen_2025_2026.pdf",
                    "questionPages": [3],
                    "answerPages": [6],
                    "referenceSection": "Phần II - Câu 2"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Hình học đường tròn tổng hợp.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 15,
                "matchCategory": "PARTIALLY_MATCHED",
                "matchNotes": "Câu Đúng/Sai đa mức, cognitiveLevel để null chờ quy tắc gộp.",
                "duplicateGroup": None
            }
        },
        {
            "id": "CAND-SLOT15-04",
            "sourceId": "SRC012",
            "examCode": "102",
            "section": "II",
            "questionNumber": 4,
            "questionPages": [7],
            "answerPages": [36],
            "explanationPages": [36],
            "grade": 9,
            "bookSeries": "Chung (GDPT 2018)",
            "topic": "Tiếp tuyến cắt nhau và cát tuyến đường tròn",
            "type": "TRUE_FALSE",
            "stem": "Cho đường tròn $(O; R)$ và điểm $A$ nằm ngoài đường tròn. Vẽ hai tiếp tuyến $AB, AC$ với $(O)$ ($B, C$ là các tiếp điểm). Kẻ cát tuyến $ADE$ không đi qua $O$ ($D$ nằm giữa $A$ và $E$).",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Tứ giác $ABOC$ nội tiếp đường tròn đường kính $AO$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "Hai góc vuông đối diện."
                },
                {
                    "key": "b",
                    "text": "$AB^2 = AD \\cdot AE$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "Phương tích tiếp tuyến cát tuyến."
                },
                {
                    "key": "c",
                    "text": "Đoạn thẳng $AO$ vuông góc với dây $BC$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "Tính chất hai tiếp tuyến cắt nhau."
                },
                {
                    "key": "d",
                    "text": "Khi cát tuyến $ADE$ quay quanh $A$, tích $AD \\cdot AE$ thay đổi",
                    "answer": False,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "Tích luôn bằng $AB^2$ không đổi."
                }
            ],
            "answer": {"a": True, "b": True, "c": True, "d": False},
            "sourceAnswer": "Chưa có căn cứ xác minh từ trang 7",
            "editorialProposal": {
                "suggestedAction": "MARK_UNVERIFIED",
                "rationale": "Trong file 12_KS_Cum_4_Hai_Phong_2025_2026.pdf tại trang 7 Câu 4 là biểu thức căn thức P (Mã đề 102), không phải bài toán hình học đường tròn. Bản revision-01 đã tự tạo dựng câu hỏi này. Đánh dấu UNVERIFIED_SOURCE_TRANSCRIPTION và loại khỏi diện khớp."
            },
            "explanation": "Nội dung câu hỏi không tìm thấy tại trang 7 của tài liệu khảo sát Cụm 4 Hải Phòng.",
            "assets": ["proofs/CAND-SLOT15-04_p007_102_II_Q4.png"],
            "proofImage": "proofs/CAND-SLOT15-04_p007_102_II_Q4.png",
            "answerOrigin": "UNVERIFIED",
            "explanationOrigin": "MODEL_GENERATED",
            "verificationNotes": "Kiểm tra thực tế trang 7 Câu 4 là bài toán rút gọn căn thức P, không phải hình học đường tròn. Đánh dấu UNVERIFIED_SOURCE_TRANSCRIPTION.",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "UNVERIFIED_SOURCE_TRANSCRIPTION",
            "differencesFromRevision01": "Câu hỏi do revision-01 tự ý tạo dựng, không tồn tại trong trang PDF được dẫn chứng.",
            "issues": ["UNVERIFIED_SOURCE_TRANSCRIPTION", "FABRICATED_IN_REV01"],
            "classification": {
                "knowledgeStrand": "Hình học và Đo lường",
                "chapter": "ĐƯỜNG TRÒN",
                "topic": "Tiếp tuyến và cát tuyến",
                "primarySkillCode": "MATH9-CIRCLES",
                "secondarySkillCodes": [],
                "learningOutcome": "Chưa xác minh.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"UNDERSTANDING": 3, "APPLYING": 1},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu chưa xác minh.",
                "evidence": {
                    "sourceId": "SRC012",
                    "relativePath": "03_Bo_sung_Antigravity/De_tong_hop/12_KS_Cum_4_Hai_Phong_2025_2026.pdf",
                    "questionPages": [7],
                    "answerPages": [36],
                    "referenceSection": "Phần II - Câu 4"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Chưa xác minh.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 15,
                "matchCategory": "LACKING_EVIDENCE",
                "matchNotes": "Chưa xác minh được nguồn tại vị trí trang dẫn chứng. Không tính vào ứng viên khớp.",
                "duplicateGroup": None
            }
        },
        {
            "id": "CAND-SLOT15-05",
            "sourceId": "SRC015_CD",
            "examCode": "CHUYEN_DE",
            "section": "II",
            "questionNumber": 1,
            "questionPages": [230],
            "answerPages": [332],
            "explanationPages": [332],
            "grade": 9,
            "bookSeries": "Cánh Diều",
            "topic": "Đường kính, dây cung và vị trí tương đối",
            "type": "TRUE_FALSE",
            "stem": "Cho đường tròn $(O; R)$ và dây $AB$ không đi qua tâm. Kẻ $OH \\perp AB$ tại $H$. Tia $OH$ cắt đường tròn tại $C$.",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Điểm $H$ là trung điểm của dây $AB$",
                    "answer": True,
                    "cognitiveLevel": "REMEMBERING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "Định lý đường kính vuông góc với dây."
                },
                {
                    "key": "b",
                    "text": "Tam giác $CAB$ là tam giác cân tại $C$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "$CH$ vừa là đường cao vừa là trung tuyến."
                },
                {
                    "key": "c",
                    "text": "$OH = \\sqrt{R^2 - \\frac{AB^2}{4}}$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "Định lý Pythagoras trong tam giác vuông $OHA$."
                },
                {
                    "key": "d",
                    "text": "Khi khoảng cách $OH$ tăng thì độ dài dây $AB$ tăng",
                    "answer": False,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-CIRCLES",
                    "rationale": "Dây càng gần tâm thì càng lớn."
                }
            ],
            "answer": {"a": True, "b": True, "c": True, "d": False},
            "sourceAnswer": "Chưa có căn cứ xác minh từ trang 230",
            "editorialProposal": {
                "suggestedAction": "MARK_UNVERIFIED",
                "rationale": "Trong file 15_Duong_tron_Canh_Dieu.pdf tại trang 230 không tồn tại Câu 1 Phần II. Bản revision-01 đã tự tạo dựng câu hỏi này. Đánh dấu UNVERIFIED_SOURCE_TRANSCRIPTION và loại khỏi diện khớp."
            },
            "explanation": "Nội dung câu hỏi không tìm thấy tại trang 230 của tài liệu đường tròn Cánh Diều.",
            "assets": ["proofs/CAND-SLOT15-05_p230_CHUYEN_DE_II_Q1.png"],
            "proofImage": "proofs/CAND-SLOT15-05_p230_CHUYEN_DE_II_Q1.png",
            "answerOrigin": "UNVERIFIED",
            "explanationOrigin": "MODEL_GENERATED",
            "verificationNotes": "Kiểm tra thực tế trang 230 không tìm thấy Câu 1 Phần II. Đánh dấu UNVERIFIED_SOURCE_TRANSCRIPTION.",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "UNVERIFIED_SOURCE_TRANSCRIPTION",
            "differencesFromRevision01": "Câu hỏi do revision-01 tự ý tạo dựng, không tồn tại trong trang PDF được dẫn chứng.",
            "issues": ["UNVERIFIED_SOURCE_TRANSCRIPTION", "FABRICATED_IN_REV01"],
            "classification": {
                "knowledgeStrand": "Hình học và Đo lường",
                "chapter": "ĐƯỜNG TRÒN",
                "topic": "Đường kính và dây cung",
                "primarySkillCode": "MATH9-CIRCLES",
                "secondarySkillCodes": [],
                "learningOutcome": "Chưa xác minh.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"REMEMBERING": 1, "UNDERSTANDING": 3},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu chưa xác minh.",
                "evidence": {
                    "sourceId": "SRC015_CD",
                    "relativePath": "03_Bo_sung_Antigravity/Chuyen_de/15_Duong_tron_Canh_Dieu.pdf",
                    "questionPages": [230],
                    "answerPages": [332],
                    "referenceSection": "Phần II - Câu 1"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Chưa xác minh.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 15,
                "matchCategory": "LACKING_EVIDENCE",
                "matchNotes": "Chưa xác minh được nguồn tại vị trí trang dẫn chứng. Không tính vào ứng viên khớp.",
                "duplicateGroup": None
            }
        }
    ]

def get_slot_16_questions():
    return [
        {
            "id": "CAND-SLOT16-01",
            "sourceId": "SRC019",
            "examCode": "901",
            "section": "II",
            "questionNumber": 4,
            "questionPages": [3],
            "answerPages": [9],
            "explanationPages": [9],
            "grade": 9,
            "bookSeries": "Chung (GDPT 2018)",
            "topic": "Bảng thống kê số đề thi học sinh hoàn thành",
            "type": "TRUE_FALSE",
            "stem": "Trong quá trình ôn thi vào lớp 10, giáo viên bộ môn Toán đã giao cho học sinh lớp 9A tự luyện các đề kiểm tra trong một tuần. Sau đó, giáo viên tiến hành thống kê số lượng đề mà mỗi học sinh đã hoàn thành để đánh giá mức độ tự học và chuẩn bị bài của các em. Dữ liệu thu được ghi lại trong bảng sau:\n\n| Số đề hoàn thành | 3 | 4 | 5 | 6 | 7 |\n|---|---:|---:|---:|---:|---:|\n| Số học sinh | 4 | 8 | 15 | 10 | 3 |",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Lớp 9A có tổng số 40 học sinh",
                    "answer": True,
                    "cognitiveLevel": "REMEMBERING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Cộng tổng tần số: $4 + 8 + 15 + 10 + 3 = 40$ học sinh."
                },
                {
                    "key": "b",
                    "text": "Số đề hoàn thành phổ biến nhất (mốt) của học sinh là 5 đề",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Giá trị có tần số lớn nhất là 5 (tần số 15)."
                },
                {
                    "key": "c",
                    "text": "Tần số tương đối của số học sinh hoàn thành từ 6 đề trở lên là $32{,}5\\%$",
                    "answer": True,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Số học sinh làm từ 6 đề trở lên là $10 + 3 = 13$. Tần số tương đối là $\\frac{13}{40} \\times 100\\% = 32{,}5\\%$."
                },
                {
                    "key": "d",
                    "text": "Số học sinh hoàn thành ít hơn 5 đề chiếm nhiều hơn một nửa tổng số học sinh của lớp",
                    "answer": False,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Số học sinh làm ít hơn 5 đề là $4 + 8 = 12$ học sinh ($30\\%$), ít hơn một nửa ($20$ học sinh)."
                }
            ],
            "answer": {"a": True, "b": True, "c": True, "d": False},
            "sourceAnswer": "Đ Đ Đ S",
            "editorialProposal": None,
            "explanation": "Chi tiết các chỉ số thống kê: cỡ mẫu $N = 40$; mốt $M_o = 5$; tần số tương đối từ 6 đề là $13/40 = 32{,}5\\%$; số học sinh làm ít hơn 5 đề là 12 (nhỏ hơn 20). Khóa đáp án nguồn: Đ Đ Đ S.",
            "assets": ["proofs/CAND-SLOT16-01_p003_901_II_Q4.png"],
            "proofImage": "proofs/CAND-SLOT16-01_p003_901_II_Q4.png",
            "answerOrigin": "SOURCE_KEY",
            "explanationOrigin": "SOURCE_SOLUTION",
            "verificationNotes": "Đối chiếu trực quan Trang 3 (Câu 4) và Trang 9 (Đáp án: Đ Đ Đ S).",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "VERIFIED_EXACT",
            "differencesFromRevision01": "Khớp chính xác văn bản nguồn PDF.",
            "issues": [],
            "classification": {
                "knowledgeStrand": "Thống kê và xác suất",
                "chapter": "MỘT SỐ YẾU TỐ THỐNG KÊ",
                "topic": "Đọc và phân tích dữ liệu thống kê",
                "primarySkillCode": "MATH9-DATA-ANALYSIS",
                "secondarySkillCodes": [],
                "learningOutcome": "Đọc bảng số liệu, tính tần số tương đối tích lũy và so sánh tỷ lệ.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"REMEMBERING": 1, "UNDERSTANDING": 2, "APPLYING": 1},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu Đúng/Sai thống kê gồm các mức từ Nhận biết đến Vận dụng.",
                "evidence": {
                    "sourceId": "SRC019",
                    "relativePath": "05_Bo_sung_theo_ma_tran/PDF/19_KS_Cum_18_Hai_Phong_2025_2026.pdf",
                    "questionPages": [3],
                    "answerPages": [9],
                    "referenceSection": "Phần II - Câu 4"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Phân tích bảng số liệu.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 16,
                "matchCategory": "PARTIALLY_MATCHED",
                "matchNotes": "Câu Đúng/Sai đa mức, cognitiveLevel để null chờ quy tắc gộp.",
                "duplicateGroup": None
            }
        },
        {
            "id": "CAND-SLOT16-02",
            "sourceId": "SRC008_HY",
            "examCode": "9101",
            "section": "II",
            "questionNumber": 4,
            "questionPages": [3],
            "answerPages": [5],
            "explanationPages": [5],
            "grade": 9,
            "bookSeries": "Chung (GDPT 2018)",
            "topic": "Bảng phân phối điểm kiểm tra môn Toán",
            "type": "TRUE_FALSE",
            "stem": "Bảng điểm kiểm tra học kỳ I môn Toán của $40$ học sinh lớp 9 được thống kê như sau:\n\n| Điểm | [0; 5) | [5; 7) | [7; 8) | [8; 9) | [9; 10] |\n|---|---:|---:|---:|---:|---:|\n| Số học sinh | 4 | 12 | 14 | 7 | 3 |",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Số học sinh đạt điểm từ 7 trở lên là 24 học sinh",
                    "answer": True,
                    "cognitiveLevel": "REMEMBERING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Cộng tần số các nhóm."
                },
                {
                    "key": "b",
                    "text": "Tần số tương đối của nhóm điểm [7; 8) là $35\\%$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Tính $14/40 = 35\\%$."
                },
                {
                    "key": "c",
                    "text": "Tỷ lệ học sinh đạt điểm giỏi (từ 8 điểm trở lên) lớn hơn $30\\%$",
                    "answer": False,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "$10/40 = 25\\% < 30\\%$."
                },
                {
                    "key": "d",
                    "text": "Số học sinh có điểm dưới trung bình (dưới 5) chiếm $15\\%$ cả lớp",
                    "answer": False,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "$4/40 = 10\\% \\ne 15\\%$."
                }
            ],
            "answer": {"a": True, "b": True, "c": False, "d": False},
            "sourceAnswer": "Chưa có căn cứ xác minh từ trang 3",
            "editorialProposal": {
                "suggestedAction": "MARK_UNVERIFIED",
                "rationale": "Trong file 01_HK1_Hung_Yen_2025_2026.pdf tại trang 3 không có Câu 4 Phần II (chỉ có Phần I trắc nghiệm đến câu 26 và Phần II chỉ có câu 1-2). Câu 4 ở trang 4 là câu trả lời ngắn tìm giá trị nhỏ nhất của P. Bản revision-01 đã tự tạo dựng câu hỏi này. Đánh dấu UNVERIFIED_SOURCE_TRANSCRIPTION và loại khỏi diện khớp."
            },
            "explanation": "Nội dung câu hỏi không tìm thấy tại trang 3 của tài liệu đề HK1 Hưng Yên.",
            "assets": ["proofs/CAND-SLOT16-02_p004_9101_II_Q4.png"],
            "proofImage": "proofs/CAND-SLOT16-02_p004_9101_II_Q4.png",
            "answerOrigin": "UNVERIFIED",
            "explanationOrigin": "MODEL_GENERATED",
            "verificationNotes": "Kiểm tra thực tế trang 3 không có Câu 4 Phần II. Đánh dấu UNVERIFIED_SOURCE_TRANSCRIPTION.",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "UNVERIFIED_SOURCE_TRANSCRIPTION",
            "differencesFromRevision01": "Câu hỏi do revision-01 tự ý tạo dựng, không tồn tại trong trang PDF được dẫn chứng.",
            "issues": ["UNVERIFIED_SOURCE_TRANSCRIPTION", "FABRICATED_IN_REV01"],
            "classification": {
                "knowledgeStrand": "Thống kê và xác suất",
                "chapter": "MỘT SỐ YẾU TỐ THỐNG KÊ",
                "topic": "Bảng tần số ghép nhóm",
                "primarySkillCode": "MATH9-DATA-ANALYSIS",
                "secondarySkillCodes": [],
                "learningOutcome": "Chưa xác minh.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"REMEMBERING": 1, "UNDERSTANDING": 3},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu chưa xác minh.",
                "evidence": {
                    "sourceId": "SRC008_HY",
                    "relativePath": "02_De_tong_hop/01_HK1_Hung_Yen_2025_2026.pdf",
                    "questionPages": [3],
                    "answerPages": [5],
                    "referenceSection": "Phần II - Câu 4"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Chưa xác minh.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 16,
                "matchCategory": "LACKING_EVIDENCE",
                "matchNotes": "Chưa xác minh được nguồn tại vị trí trang dẫn chứng. Không tính vào ứng viên khớp.",
                "duplicateGroup": None
            }
        },
        {
            "id": "CAND-SLOT16-03",
            "sourceId": "SRC002_HP",
            "examCode": "101",
            "section": "II",
            "questionNumber": 2,
            "questionPages": [2],
            "answerPages": [9],
            "explanationPages": [9],
            "grade": 9,
            "bookSeries": "Chung (GDPT 2018)",
            "topic": "Bảng tần số ghép nhóm số giờ công suất cao điểm",
            "type": "TRUE_FALSE",
            "stem": "Một cửa hàng tiện lợi thống kê số lượng khách hàng ghé thăm mỗi giờ trong suốt 24 giờ của một ngày. Kết quả được ghi lại trong bảng tần số ghép nhóm sau:\n\n| Số khách mỗi giờ | [0; 10) | [10; 20) | [20; 30) | [30; 40) | [40; 50] |\n|---|---:|---:|---:|---:|---:|\n| Số giờ (tần số) | 4 | 7 | 8 | 3 | 2 |",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Số giờ có từ 20 khách trở lên trong ngày là 13 giờ",
                    "answer": True,
                    "cognitiveLevel": "REMEMBERING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Cộng tần số các nhóm: $8 + 3 + 2 = 13$ giờ."
                },
                {
                    "key": "b",
                    "text": "Tần số tương đối của nhóm giờ có ít hơn 10 khách là khoảng $16{,}7\\%$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Tính $\\frac{4}{24} \\times 100\\% \\approx 16{,}67\\% \\approx 16{,}7\\%$."
                },
                {
                    "key": "c",
                    "text": "Nhóm chứa mốt của mẫu số liệu là nhóm [10; 20)",
                    "answer": False,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Nhóm có tần số lớn nhất là [20; 30) với tần số 8, không phải [10; 20)."
                },
                {
                    "key": "d",
                    "text": "Khoảng biến thiên của mẫu số liệu ghép nhóm là 40",
                    "answer": False,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Khoảng biến thiên là $50 - 0 = 50$, không phải 40."
                }
            ],
            "answer": {"a": True, "b": True, "c": False, "d": False},
            "sourceAnswer": "Đ Đ S S",
            "editorialProposal": None,
            "explanation": "Chi tiết các chỉ số thống kê: số giờ $\\ge 20$ khách là 13; tần số tương đối nhóm $[0; 10)$ là $16{,}7\\%$; nhóm mốt là $[20; 30)$; khoảng biến thiên là 50. Khóa đáp án nguồn: Đ Đ S S.",
            "assets": ["proofs/CAND-SLOT16-03_p002_101_II_Q2.png"],
            "proofImage": "proofs/CAND-SLOT16-03_p002_101_II_Q2.png",
            "answerOrigin": "SOURCE_KEY",
            "explanationOrigin": "SOURCE_SOLUTION",
            "verificationNotes": "Đối chiếu trực quan Trang 2 (Câu 2) và Trang 9 (Đáp án: Đ Đ S S).",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "VERIFIED_EXACT",
            "differencesFromRevision01": "Khớp chính xác văn bản nguồn PDF.",
            "issues": [],
            "classification": {
                "knowledgeStrand": "Thống kê và xác suất",
                "chapter": "MỘT SỐ YẾU TỐ THỐNG KÊ",
                "topic": "Bảng tần số ghép nhóm",
                "primarySkillCode": "MATH9-DATA-ANALYSIS",
                "secondarySkillCodes": [],
                "learningOutcome": "Đọc bảng tần số ghép nhóm, xác định nhóm mốt và tần số tương đối.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"REMEMBERING": 1, "UNDERSTANDING": 3},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu Đúng/Sai thống kê gồm 1 ý Nhận biết và 3 ý Thông hiểu.",
                "evidence": {
                    "sourceId": "SRC002_HP",
                    "relativePath": "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf",
                    "questionPages": [2],
                    "answerPages": [9],
                    "referenceSection": "Phần II - Câu 2"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Phân tích bảng ghép nhóm.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 16,
                "matchCategory": "PARTIALLY_MATCHED",
                "matchNotes": "Câu Đúng/Sai đa mức, cognitiveLevel để null chờ quy tắc gộp.",
                "duplicateGroup": None
            }
        },
        {
            "id": "CAND-SLOT16-04",
            "sourceId": "SRC012",
            "examCode": "102",
            "section": "II",
            "questionNumber": 2,
            "questionPages": [6],
            "answerPages": [35],
            "explanationPages": [35],
            "grade": 9,
            "bookSeries": "Chung (GDPT 2018)",
            "topic": "Một trang trại trồng hoa lan theo dõi nồng độ bụi mịn PM2.5",
            "type": "TRUE_FALSE",
            "stem": "Một trang trại trồng hoa lan theo dõi nồng độ bụi mịn PM2.5 (đơn vị: $\\mu\\text{g/m}^3$) trong 30 ngày để điều chỉnh hệ thống lọc không khí. Số liệu ghi nhận được biểu diễn qua bảng tần số ghép nhóm sau:\n\n| Nồng độ PM2.5 | [0; 15) | [15; 30) | [30; 45) | [45; 60) | [60; 75] |\n|---|---:|---:|---:|---:|---:|\n| Số ngày (tần số) | 5 | 11 | 8 | 4 | 2 |",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Số ngày có nồng độ bụi mịn PM2.5 ở mức tốt (dưới $30\\mu\\text{g/m}^3$) là 16 ngày",
                    "answer": True,
                    "cognitiveLevel": "REMEMBERING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Cộng tần số hai nhóm đầu: $5 + 11 = 16$ ngày."
                },
                {
                    "key": "b",
                    "text": "Tần số tương đối của những ngày có nồng độ từ 30 đến dưới 45 $\\mu\\text{g/m}^3$ là khoảng $26{,}7\\%$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Tính $\\frac{8}{30} \\times 100\\% \\approx 26{,}67\\% \\approx 26{,}7\\%$."
                },
                {
                    "key": "c",
                    "text": "Nhóm chứa mốt của nồng độ bụi mịn là [30; 45)",
                    "answer": False,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Nhóm có tần số lớn nhất là [15; 30) với 11 ngày."
                },
                {
                    "key": "d",
                    "text": "Tỷ lệ số ngày có nồng độ bụi mịn vượt quá $45\\mu\\text{g/m}^3$ chiếm $20\\%$ cả đợt",
                    "answer": True,
                    "cognitiveLevel": "APPLYING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Số ngày vượt quá 45 là $4 + 2 = 6$ ngày. Tỷ lệ $\\frac{6}{30} \\times 100\\% = 20\\%$."
                }
            ],
            "answer": {"a": True, "b": True, "c": False, "d": True},
            "sourceAnswer": "Đ Đ S Đ",
            "editorialProposal": None,
            "explanation": "Chi tiết các chỉ số thống kê nồng độ bụi mịn PM2.5: số ngày $< 30$ là 16; tần số tương đối nhóm $[30; 45)$ là $26{,}7\\%$; nhóm mốt là $[15; 30)$; tỷ lệ ngày $> 45$ là $20\\%$. Khóa đáp án nguồn: Đ Đ S Đ.",
            "assets": ["proofs/CAND-SLOT16-04_p006_102_II_Q2.png"],
            "proofImage": "proofs/CAND-SLOT16-04_p006_102_II_Q2.png",
            "answerOrigin": "SOURCE_KEY",
            "explanationOrigin": "SOURCE_SOLUTION",
            "verificationNotes": "Đối chiếu trực quan Trang 6 (Mã 102, Câu 2) và Trang 35 (Đáp án: Đ Đ S Đ).",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "VERIFIED_EXACT",
            "differencesFromRevision01": "Khớp chính xác văn bản nguồn PDF.",
            "issues": [],
            "classification": {
                "knowledgeStrand": "Thống kê và xác suất",
                "chapter": "MỘT SỐ YẾU TỐ THỐNG KÊ",
                "topic": "Bảng tần số ghép nhóm",
                "primarySkillCode": "MATH9-DATA-ANALYSIS",
                "secondarySkillCodes": [],
                "learningOutcome": "Đọc và phân tích số liệu bảng tần số ghép nhóm về môi trường.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"REMEMBERING": 1, "UNDERSTANDING": 2, "APPLYING": 1},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu Đúng/Sai thống kê gồm 4 ý.",
                "evidence": {
                    "sourceId": "SRC012",
                    "relativePath": "03_Bo_sung_Antigravity/De_tong_hop/12_KS_Cum_4_Hai_Phong_2025_2026.pdf",
                    "questionPages": [6],
                    "answerPages": [35],
                    "referenceSection": "Phần II - Câu 2"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Phân tích số liệu ghép nhóm.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 16,
                "matchCategory": "PARTIALLY_MATCHED",
                "matchNotes": "Câu Đúng/Sai đa mức, cognitiveLevel để null chờ quy tắc gộp.",
                "duplicateGroup": None
            }
        },
        {
            "id": "CAND-SLOT16-05",
            "sourceId": "SRC010_KNTT",
            "examCode": "CHUYEN_DE",
            "section": "II",
            "questionNumber": 1,
            "questionPages": [128],
            "answerPages": [150],
            "explanationPages": [150],
            "grade": 9,
            "bookSeries": "Kết Nối Tri Thức Với Cuộc Sống",
            "topic": "Phân tích bảng tần số ghép nhóm thời gian tự học",
            "type": "TRUE_FALSE",
            "stem": "Một khảo sát về thời gian tự học ở nhà mỗi ngày của $50$ học sinh lớp 9 cho kết quả như sau:\n\n| Thời gian (giờ) | [0; 1) | [1; 2) | [2; 3) | [3; 4) | [4; 5] |\n|---|---:|---:|---:|---:|---:|\n| Số học sinh | 5 | 15 | 18 | 9 | 3 |",
            "options": None,
            "statements": [
                {
                    "key": "a",
                    "text": "Số học sinh tự học từ 2 giờ trở lên mỗi ngày là 30 học sinh",
                    "answer": True,
                    "cognitiveLevel": "REMEMBERING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Cộng tần số các nhóm."
                },
                {
                    "key": "b",
                    "text": "Nhóm chứa mốt của mẫu số liệu là [2; 3)",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Nhóm có tần số lớn nhất là 18."
                },
                {
                    "key": "c",
                    "text": "Tần số tương đối của số học sinh học ít hơn 1 giờ mỗi ngày là $10\\%$",
                    "answer": True,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Tính $5/50 = 10\\%$."
                },
                {
                    "key": "d",
                    "text": "Đa số học sinh trong mẫu dành từ 3 giờ trở lên mỗi ngày để tự học",
                    "answer": False,
                    "cognitiveLevel": "UNDERSTANDING",
                    "skillCode": "MATH9-DATA-ANALYSIS",
                    "rationale": "Số học sinh học từ 3 giờ trở lên là $9+3=12$ học sinh ($24\\%$)."
                }
            ],
            "answer": {"a": True, "b": True, "c": True, "d": False},
            "sourceAnswer": "Chưa có căn cứ xác minh từ trang 128",
            "editorialProposal": {
                "suggestedAction": "MARK_UNVERIFIED",
                "rationale": "Trong file 10_Thong_ke_tan_so_KNTT.pdf tại trang 128 không tồn tại Câu 1 Phần II. Bản revision-01 đã tự tạo dựng câu hỏi này. Đánh dấu UNVERIFIED_SOURCE_TRANSCRIPTION và loại khỏi diện khớp."
            },
            "explanation": "Nội dung câu hỏi không tìm thấy tại trang 128 của tài liệu chuyên đề thống kê KNTT.",
            "assets": ["proofs/CAND-SLOT16-05_p128_CHUYEN_DE_II_Q1.png"],
            "proofImage": "proofs/CAND-SLOT16-05_p128_CHUYEN_DE_II_Q1.png",
            "answerOrigin": "UNVERIFIED",
            "explanationOrigin": "MODEL_GENERATED",
            "verificationNotes": "Kiểm tra thực tế trang 128 không tìm thấy Câu 1 Phần II. Đánh dấu UNVERIFIED_SOURCE_TRANSCRIPTION.",
            "reviewStatus": "NEEDS_REVIEW",
            "comparisonResult": "UNVERIFIED_SOURCE_TRANSCRIPTION",
            "differencesFromRevision01": "Câu hỏi do revision-01 tự ý tạo dựng, không tồn tại trong trang PDF được dẫn chứng.",
            "issues": ["UNVERIFIED_SOURCE_TRANSCRIPTION", "FABRICATED_IN_REV01"],
            "classification": {
                "knowledgeStrand": "Thống kê và xác suất",
                "chapter": "MỘT SỐ YẾU TỐ THỐNG KÊ",
                "topic": "Phân tích bảng tần số ghép nhóm",
                "primarySkillCode": "MATH9-DATA-ANALYSIS",
                "secondarySkillCodes": [],
                "learningOutcome": "Chưa xác minh.",
                "cognitiveLevel": None,
                "statementLevelDistribution": {"REMEMBERING": 1, "UNDERSTANDING": 3},
                "sourceLevel": None,
                "classificationOrigin": "MODEL_PROPOSED",
                "rationale": "Câu chưa xác minh.",
                "evidence": {
                    "sourceId": "SRC010_KNTT",
                    "relativePath": "03_Bo_sung_Antigravity/Chuyen_de/10_Thong_ke_tan_so_KNTT.pdf",
                    "questionPages": [128],
                    "answerPages": [150],
                    "referenceSection": "Phần II - Câu 1"
                },
                "difficulty": "MEDIUM",
                "difficultyStatus": "PROVISIONAL",
                "difficultyRationale": "Chưa xác minh.",
                "calibrationStatus": "UNCALIBRATED",
                "labelReviewStatus": "NEEDS_REVIEW"
            },
            "auditReview": {
                "targetSlot": 16,
                "matchCategory": "LACKING_EVIDENCE",
                "matchNotes": "Chưa xác minh được nguồn tại vị trí trang dẫn chứng. Không tính vào ứng viên khớp.",
                "duplicateGroup": None
            }
        }
    ]
