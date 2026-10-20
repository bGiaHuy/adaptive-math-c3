import { THPT_CURRICULUM, THPT_BOOK, learningQuestionWhere, isLearningQuestion } from './thpt-catalog';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurriculumService {
  constructor(private readonly prisma: PrismaService) {}

  getGrades() {
    return THPT_CURRICULUM.map(level => ({ id: level.grade, label: `Lớp ${level.grade}`, chaptersCount: level.chapters.length, desc: `${level.chapters.length} chương SGK ${THPT_BOOK}` }));
  }

  getOnboardingOptions() {
    return {
      goals: [
        { id: 'midterm', title: 'Ôn thi giữa kỳ', desc: 'Tập trung các chủ đề trọng tâm nửa học kỳ.', targetMastery: '75%' },
        { id: 'finalterm', title: 'Ôn thi cuối kỳ', desc: 'Bao quát toàn bộ kiến thức học kỳ.', targetMastery: '80%' },
        { id: 'university', title: 'Ôn thi đại học', desc: 'Dành cho lớp 12: củng cố kiến thức và luyện mục tiêu xét tuyển đại học.', targetMastery: '85%', minGrade: 12 },
        { id: 'advanced', title: 'Học nâng cao / HSG', desc: 'Tiến xa hơn chương trình chuẩn với các chuyên đề khó.', targetMastery: '95%' }
      ],
      dailyTimes: [
        { id: '30m', minutes: 30, title: '30 phút/ngày', desc: 'Nhẹ nhàng, duy trì nhịp học đều đặn.' },
        { id: '45m', minutes: 45, title: '45 phút/ngày', desc: 'Khuyến nghị tiêu chuẩn, cân bằng hiệu quả.' },
        { id: '60m', minutes: 60, title: '60 phút/ngày', desc: 'Tiến độ nhanh, bứt phá năng lực.' },
        { id: '90m', minutes: 90, title: '90 phút/ngày', desc: 'Cường độ cao, giai đoạn nước rút.' }
      ],
      selfAssessments: [
        { id: 'weak', title: 'Yếu', desc: 'Còn hổng nhiều kiến thức nền, cần bắt đầu từ bài căn bản.' },
        { id: 'average', title: 'Trung bình', desc: 'Nắm được lý thuyết nhưng chưa vững khi biến đổi.' },
        { id: 'good', title: 'Khá', desc: 'Làm tốt bài thông hiểu, muốn làm chủ bài vận dụng.' },
        { id: 'excellent', title: 'Giỏi', desc: 'Muốn chinh phục câu phân loại điểm 9-10.' }
      ]
    };
  }

  async getSkillsByGrade(grade: number = 10) {
    if (![10, 11, 12].includes(grade)) return { grade, bankStatus: 'UNSUPPORTED', totalSkills: 0, chapters: [] };
    const skills = await this.prisma.skillNode.findMany({ where: { grade }, orderBy: { orderIndex: 'asc' },
      include: { questions: { where: learningQuestionWhere(), select: { id: true, status: true, source: true, questionType: true } } } });
    if (!skills.length) {
      const level = THPT_CURRICULUM.find(item => item.grade === grade);
      return { grade, book: THPT_BOOK, bankStatus: 'PREPARING', totalSkills: level?.chapters.reduce((sum, c) => sum + c.topics.length, 0) || 0,
        chapters: (level?.chapters || []).map(chapter => ({ chapter: chapter.title, skills: chapter.topics.map((topic, index) => ({ id: topic.id, code: topic.id, title: topic.title, orderIndex: index, questionsCount: 0, persisted: false })) })) };
    }

    // Group by chapter
    const chaptersMap = new Map<string, any[]>();
    for (const s of skills) {
      const questions = s.questions.filter(q => isLearningQuestion({ ...q, skill: { grade } }));
      if (!chaptersMap.has(s.chapter)) {
        chaptersMap.set(s.chapter, []);
      }
      chaptersMap.get(s.chapter)!.push({
        id: s.id,
        code: s.code,
        title: s.title,
        orderIndex: s.orderIndex,
        questionsCount: questions.length, persisted: true,
        canPractice: questions.filter(q => q.questionType === 'SINGLE_CHOICE').length >= 3
      });
    }

    const grouped = Array.from(chaptersMap.entries()).map(([chapterName, skillList]) => ({
      chapter: chapterName,
      skills: skillList
    }));

    return {
      grade,
      book: THPT_BOOK,
      bankStatus: grouped.some(chapter => chapter.skills.some(skill => skill.questionsCount > 0)) ? 'AVAILABLE' : 'PREPARING',
      totalSkills: skills.length,
      chapters: grouped
    };
  }
}
