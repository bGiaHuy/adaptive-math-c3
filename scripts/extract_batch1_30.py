import fitz
import sys
import json
import os
import re

sys.stdout.reconfigure(encoding='utf-8')

OUT_DIR = 'outputs/thpt-300-papers'

# Load existing candidates to keep the 54 pilot questions
existing_candidates = []
existing_reviewed = []
cand_file = os.path.join(OUT_DIR, 'questions-candidates.jsonl')
rev_file = os.path.join(OUT_DIR, 'questions-reviewed.jsonl')

if os.path.exists(cand_file):
    with open(cand_file, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                existing_candidates.append(json.loads(line))

if os.path.exists(rev_file):
    with open(rev_file, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                existing_reviewed.append(json.loads(line))

print(f"Loaded {len(existing_candidates)} existing pilot questions from {len(set(c['paperId'] for c in existing_candidates))} papers.")

# Metadata for the 27 new papers in Batch 1
NEW_PAPERS_BATCH1 = [
    # Grade 10 (9 papers)
    {
        'grade': 10, 'paperId': 'THPT-10-CUOI_HK1-028', 'file': 'THPT-10-CUOI_HK1-028.pdf',
        'code': '1001', 'school': 'Trường THPT Nguyễn Trãi - Hội An', 'examTitle': 'Kiểm tra cuối kỳ 1 Toán 10 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3], 'ansPage': 7
    },
    {
        'grade': 10, 'paperId': 'THPT-10-CUOI_HK1-035', 'file': 'THPT-10-CUOI_HK1-035.pdf',
        'code': '101', 'school': 'Trường THPT Số 1 Ngô Gia Tự', 'examTitle': 'Kiểm tra cuối học kì 1 môn Toán 10 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3], 'ansPage': 7
    },
    {
        'grade': 10, 'paperId': 'THPT-10-CUOI_HK1-042', 'file': 'THPT-10-CUOI_HK1-042.pdf',
        'code': '1001', 'school': 'Trường THPT Nguyễn Thị Minh Khai', 'examTitle': 'Đề kiểm tra cuối kì 1 Toán 10 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3], 'ansPage': 7
    },
    {
        'grade': 10, 'paperId': 'THPT-10-CUOI_HK1-045', 'file': 'THPT-10-CUOI_HK1-045.pdf',
        'code': '0101', 'school': 'Trường THPT Hướng Hóa - Quảng Trị', 'examTitle': 'Kiểm tra cuối kỳ 1 môn Toán lớp 10 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3, 4], 'ansPage': 17
    },
    {
        'grade': 10, 'paperId': 'THPT-10-CUOI_HK1-048', 'file': 'THPT-10-CUOI_HK1-048.pdf',
        'code': '101', 'school': 'Trường THPT Bình Chiểu - TP.HCM', 'examTitle': 'Đề kiểm tra học kì 1 môn Toán khối 10 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3], 'ansPage': 7
    },
    {
        'grade': 10, 'paperId': 'THPT-10-CUOI_HK2-076', 'file': 'THPT-10-CUOI_HK2-076.pdf',
        'code': '1001', 'school': 'Trường THPT Phú Lộc - Huế', 'examTitle': 'Đề kiểm tra cuối kỳ 2 môn Toán 10 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3], 'ansPage': 7
    },
    {
        'grade': 10, 'paperId': 'THPT-10-CUOI_HK2-084', 'file': 'THPT-10-CUOI_HK2-084.pdf',
        'code': 'A', 'school': 'Trường THPT Bùi Thị Xuân - Huế', 'examTitle': 'Đề kiểm tra cuối kỳ 2 môn Toán lớp 10 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3, 4], 'ansPage': 7
    },
    {
        'grade': 10, 'paperId': 'THPT-10-CUOI_HK2-085', 'file': 'THPT-10-CUOI_HK2-085.pdf',
        'code': '1001', 'school': 'Trường THPT Chuyên Nguyễn Tất Thành - Quảng Ngãi', 'examTitle': 'Kiểm tra cuối kỳ 2 Toán lớp 10 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3], 'ansPage': 8
    },
    {
        'grade': 10, 'paperId': 'THPT-10-CUOI_HK2-089', 'file': 'THPT-10-CUOI_HK2-089.pdf',
        'code': '1001', 'school': 'Trường THPT Núi Thành - Quảng Nam', 'examTitle': 'Đề kiểm tra cuối học kỳ 2 môn Toán 10 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3], 'ansPage': 7
    },

    # Grade 11 (9 papers)
    {
        'grade': 11, 'paperId': 'THPT-11-CUOI_HK1-129', 'file': 'THPT-11-CUOI_HK1-129.pdf',
        'code': '1101', 'school': 'Trường THPT Nguyễn Trãi - Hội An', 'examTitle': 'Kiểm tra cuối kỳ 1 Toán 11 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3], 'ansPage': 9
    },
    {
        'grade': 11, 'paperId': 'THPT-11-CUOI_HK1-136', 'file': 'THPT-11-CUOI_HK1-136.pdf',
        'code': '111', 'school': 'Trường THPT Số 1 Ngô Gia Tự', 'examTitle': 'Kiểm tra cuối học kỳ 1 Toán 11 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3, 4], 'ansPage': 9
    },
    {
        'grade': 11, 'paperId': 'THPT-11-CUOI_HK1-137', 'file': 'THPT-11-CUOI_HK1-137.pdf',
        'code': '101', 'school': 'Trường THPT Hòa Vang - Đà Nẵng', 'examTitle': 'Kiểm tra cuối kì 1 Toán 11 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3], 'ansPage': 4
    },
    {
        'grade': 11, 'paperId': 'THPT-11-CUOI_HK1-138', 'file': 'THPT-11-CUOI_HK1-138.pdf',
        'code': '111', 'school': 'Trường THPT Nguyễn Đình Chiểu - Bến Tre', 'examTitle': 'Đề kiểm tra cuối kỳ 1 môn Toán 11 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3], 'ansPage': 7
    },
    {
        'grade': 11, 'paperId': 'THPT-11-CUOI_HK1-139', 'file': 'THPT-11-CUOI_HK1-139.pdf',
        'code': '111', 'school': 'Trường THPT Chuyên Thoại Ngọc Hầu - An Giang', 'examTitle': 'Kiểm tra cuối kỳ 1 môn Toán 11 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3], 'ansPage': 5
    },
    {
        'grade': 11, 'paperId': 'THPT-11-CUOI_HK1-141', 'file': 'THPT-11-CUOI_HK1-141.pdf',
        'code': '1101', 'school': 'Trường THPT Hướng Hóa - Quảng Trị', 'examTitle': 'Kiểm tra cuối kỳ 1 môn Toán lớp 11 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3], 'ansPage': 6
    },
    {
        'grade': 11, 'paperId': 'THPT-11-CUOI_HK1-147', 'file': 'THPT-11-CUOI_HK1-147.pdf',
        'code': '1101', 'school': 'Trường THPT Bình Chiểu - TP.HCM', 'examTitle': 'Đề kiểm tra học kì 1 Toán khối 11 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3, 4], 'ansPage': 14
    },
    {
        'grade': 11, 'paperId': 'THPT-11-CUOI_HK2-176', 'file': 'THPT-11-CUOI_HK2-176.pdf',
        'code': '1101', 'school': 'Trường THPT Phú Lộc - Huế', 'examTitle': 'Đề kiểm tra cuối kỳ 2 môn Toán 11 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3], 'ansPage': 9
    },
    {
        'grade': 11, 'paperId': 'THPT-11-CUOI_HK2-182', 'file': 'THPT-11-CUOI_HK2-182.pdf',
        'code': '111', 'school': 'Trường THPT Số 1 Ngô Gia Tự', 'examTitle': 'Kiểm tra cuối học kỳ 2 môn Toán khối 11 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3], 'ansPage': 9
    },

    # Grade 12 (9 papers)
    {
        'grade': 12, 'paperId': 'THPT-12-CUOI_HK1-228', 'file': 'THPT-12-CUOI_HK1-228.pdf',
        'code': '1101', 'school': 'Trường THPT Nguyễn Trãi - Hội An', 'examTitle': 'Kiểm tra cuối kỳ 1 Toán 12 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3, 4], 'ansPage': 9
    },
    {
        'grade': 12, 'paperId': 'THPT-12-CUOI_HK1-235', 'file': 'THPT-12-CUOI_HK1-235.pdf',
        'code': '1101', 'school': 'Trường THPT Bình Minh - Vĩnh Long', 'examTitle': 'Đề kiểm tra cuối học kì 1 môn Toán khối 12 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3, 4], 'ansPage': 9
    },
    {
        'grade': 12, 'paperId': 'THPT-12-CUOI_HK1-236', 'file': 'THPT-12-CUOI_HK1-236.pdf',
        'code': '0101', 'school': 'Trường THPT Hòa Vang - Đà Nẵng', 'examTitle': 'Kiểm tra cuối kì 1 Toán lớp 12 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3, 4], 'ansPage': 5
    },
    {
        'grade': 12, 'paperId': 'THPT-12-CUOI_HK1-241', 'file': 'THPT-12-CUOI_HK1-241.pdf',
        'code': '0121', 'school': 'Trường THPT Hướng Hóa - Quảng Trị', 'examTitle': 'Kiểm tra cuối kỳ 1 môn Toán lớp 12 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3, 4], 'ansPage': 9
    },
    {
        'grade': 12, 'paperId': 'THPT-12-CUOI_HK1-247', 'file': 'THPT-12-CUOI_HK1-247.pdf',
        'code': '1211', 'school': 'Trường THPT Bình Chiểu - TP.HCM', 'examTitle': 'Đề kiểm tra học kì 1 môn Toán khối 12 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3, 4, 5], 'ansPage': 21
    },
    {
        'grade': 12, 'paperId': 'THPT-12-CUOI_HK2-281', 'file': 'THPT-12-CUOI_HK2-281.pdf',
        'code': 'A', 'school': 'Trường THPT Vĩnh Linh - Quảng Trị', 'examTitle': 'Đề kiểm tra cuối HK 2 môn Toán lớp 12 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3, 4], 'ansPage': 9
    },
    {
        'grade': 12, 'paperId': 'THPT-12-GIUA_HK1-206', 'file': 'THPT-12-GIUA_HK1-206.pdf',
        'code': '101', 'school': 'Trường THPT Nguyễn Trãi - Hội An', 'examTitle': 'Kiểm tra giữa kỳ 1 Toán 12 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3, 4], 'ansPage': 9
    },
    {
        'grade': 12, 'paperId': 'THPT-12-GIUA_HK1-208', 'file': 'THPT-12-GIUA_HK1-208.pdf',
        'code': '001', 'school': 'Trường THCS-THPT Bàu Hàm - Đồng Nai', 'examTitle': 'Đề kiểm tra giữa học kỳ 1 môn Toán 12 năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3, 4], 'ansPage': 9
    },
    {
        'grade': 12, 'paperId': 'THPT-12-GIUA_HK1-225', 'file': 'THPT-12-GIUA_HK1-225.pdf',
        'code': '1001', 'school': 'Trường THPT Núi Thành - Đà Nẵng', 'examTitle': 'Bài kiểm tra giữa kì 1 lớp 12 môn Toán năm học 2025-2026',
        'academicYear': '2025-2026', 'qPages': [1, 2, 3, 4], 'ansPage': 9
    }
]

print(f"Total papers to process in Batch 1: {len(NEW_PAPERS_BATCH1)} new + 3 pilot = 30 papers.")
