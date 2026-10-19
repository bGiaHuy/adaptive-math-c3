import { PrismaClient, UserRole, UserStatus, TeacherVerificationStatus, CognitiveLevel, QuestionStatus } from '@prisma/client';
import * as argon2 from '@node-rs/argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial database data...');

  // Default secure dev password hashed with Argon2id
  const defaultPassword = 'P@ssword123!';
  const passwordHash = await argon2.hash(defaultPassword, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });

  // 1. Create Super Admin (Mock Data)
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: { fullName: 'Hệ Thống Quản Trị (Mock Data)' },
    create: {
      username: 'admin',
      email: 'admin@adaptivemath.vn',
      fullName: 'Hệ Thống Quản Trị (Mock Data)',
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      permissionVersion: 1
    }
  });

  // 2. Create Verified Teacher (Mock Data)
  const teacherUser = await prisma.user.upsert({
    where: { username: 'thaynam' },
    update: { fullName: 'Thầy Nguyễn Văn Nam (Mock Data)' },
    create: {
      username: 'thaynam',
      email: 'thaynam@adaptivemath.vn',
      fullName: 'Thầy Nguyễn Văn Nam (Mock Data)',
      passwordHash,
      role: UserRole.TEACHER,
      status: UserStatus.ACTIVE,
      permissionVersion: 1,
      teacherProfile: {
        create: {
          schoolName: 'THCS Chu Văn An, Hà Nội',
          city: 'Hà Nội',
          verificationStatus: TeacherVerificationStatus.VERIFIED,
          verifiedAt: new Date(),
          verifiedByAdminId: adminUser.id
        }
      }
    }
  });

  // 3. Create Teacher Applicant (Pending Verification - Mock Data)
  await prisma.user.upsert({
    where: { username: 'teacher_pending' },
    update: { fullName: 'Cô Lê Thị Mai (Mock Data)' },
    create: {
      username: 'teacher_pending',
      email: 'teacher.applicant@adaptivemath.vn',
      fullName: 'Cô Lê Thị Mai (Mock Data)',
      passwordHash,
      role: UserRole.TEACHER_APPLICANT,
      status: UserStatus.ACTIVE,
      permissionVersion: 1,
      teacherProfile: {
        create: {
          schoolName: 'THCS Giảng Võ, Hà Nội',
          city: 'Hà Nội',
          verificationStatus: TeacherVerificationStatus.PENDING_REVIEW
        }
      }
    }
  });

  // 4. Create Student (Mock Data)
  const studentUser = await prisma.user.upsert({
    where: { username: 'duc_nguyen' },
    update: { fullName: 'Nguyễn Minh Đức (Mock Data)' },
    create: {
      username: 'duc_nguyen',
      email: 'hocsinh.demo4564@adaptivemath.vn',
      fullName: 'Nguyễn Minh Đức (Mock Data)',
      passwordHash,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      permissionVersion: 1,
      studentProfile: {
        create: {
          grade: 9,
          targetGoal: 'Ôn thi vào lớp 10',
          dailyMinutes: 45,
          examDate: '05/06/2027',
          selfAssessment: 'Khá'
        }
      }
    }
  });

  // 5. Create 8 Pilot Skills (from CONTENT-READINESS.md)
  const skillsData = [
    { code: 'SKILL-01', title: 'Căn bậc hai và căn thức cơ bản', chapter: 'CĂN BẬC HAI VÀ CĂN BẬC BA', orderIndex: 1 },
    { code: 'SKILL-02', title: 'Biến đổi và tính toán với căn thức', chapter: 'CĂN BẬC HAI VÀ CĂN BẬC BA', orderIndex: 2 },
    { code: 'SKILL-03', title: 'Phương trình bậc nhất 2 ẩn và Giải hệ phương trình', chapter: 'PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH', orderIndex: 3 },
    { code: 'SKILL-04', title: 'Giải bài toán bằng cách lập hệ phương trình', chapter: 'PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH', orderIndex: 4 },
    { code: 'SKILL-05', title: 'Phương trình bậc hai một ẩn', chapter: 'HÀM SỐ BẬC HAI VÀ PHƯƠNG TRÌNH BẬC HAI', orderIndex: 5 },
    { code: 'SKILL-06', title: 'Định lý Viète và ứng dụng', chapter: 'HÀM SỐ BẬC HAI VÀ PHƯƠNG TRÌNH BẬC HAI', orderIndex: 6 },
    { code: 'SKILL-07', title: 'Tỉ số lượng giác của góc nhọn', chapter: 'HỆ THỨC LƯỢNG TRONG TAM GIÁC VUÔNG', orderIndex: 7 },
    { code: 'SKILL-08', title: 'Đường tròn và góc nội tiếp', chapter: 'ĐƯỜNG TRÒN', orderIndex: 8 }
  ];

  for (const s of skillsData) {
    const skill = await prisma.skillNode.upsert({
      where: { code: s.code },
      update: {},
      create: {
        code: s.code,
        title: s.title,
        grade: 9,
        chapter: s.chapter,
        orderIndex: s.orderIndex
      }
    });

    // Questions seed data map
    const questionsBySkill: Record<string, any[]> = {
      'SKILL-01': [
        {
          content: 'Căn bậc hai số học của 81 là:',
          cognitiveLevel: CognitiveLevel.REMEMBERING,
          explanation: 'Theo định nghĩa, căn bậc hai số học của số dương a là số không âm x sao cho x^2 = a. Do đó căn bậc hai số học của 81 là 9.',
          options: [
            { optionKey: 'A', content: '-9', isCorrect: false },
            { optionKey: 'B', content: '9', isCorrect: true },
            { optionKey: 'C', content: '$\\pm 9$', isCorrect: false },
            { optionKey: 'D', content: '81', isCorrect: false }
          ]
        },
        {
          content: 'Biểu thức $\\sqrt{2x - 6}$ có nghĩa khi và chỉ khi:',
          cognitiveLevel: CognitiveLevel.UNDERSTANDING,
          explanation: 'Căn thức \\sqrt{A} có nghĩa khi A \\ge 0. Ta có $2x - 6 \\ge 0 \\iff 2x \\ge 6 \\iff x \\ge 3$.',
          options: [
            { optionKey: 'A', content: '$x \\ge 3$', isCorrect: true },
            { optionKey: 'B', content: '$x > 3$', isCorrect: false },
            { optionKey: 'C', content: '$x \\le 3$', isCorrect: false },
            { optionKey: 'D', content: '$x < 3$', isCorrect: false }
          ]
        }
      ],
      'SKILL-02': [
        {
          content: 'Rút gọn $\\sqrt{245}$ được kết quả là:',
          cognitiveLevel: CognitiveLevel.REMEMBERING,
          explanation: 'Ta có $245 = 49 \\times 5 = 7^2 \\times 5$. Do đó $\\sqrt{245} = \\sqrt{7^2 \\times 5} = 7\\sqrt{5}$.',
          options: [
            { optionKey: 'A', content: '$\\sqrt{35}$', isCorrect: false },
            { optionKey: 'B', content: '$7\\sqrt{5}$', isCorrect: true },
            { optionKey: 'C', content: '$5\\sqrt{7}$', isCorrect: false },
            { optionKey: 'D', content: '$49\\sqrt{5}$', isCorrect: false }
          ]
        },
        {
          content: 'Trục căn thức ở mẫu của biểu thức $\\frac{6}{\\sqrt{3}}$ ta được:',
          cognitiveLevel: CognitiveLevel.UNDERSTANDING,
          explanation: 'Nhân cả tử và mẫu với $\\sqrt{3}$, ta có: $\\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}$.',
          options: [
            { optionKey: 'A', content: '$2\\sqrt{3}$', isCorrect: true },
            { optionKey: 'B', content: '$3\\sqrt{2}$', isCorrect: false },
            { optionKey: 'C', content: '$\\sqrt{3}$', isCorrect: false },
            { optionKey: 'D', content: '$6\\sqrt{3}$', isCorrect: false }
          ]
        }
      ],
      'SKILL-03': [
        {
          content: 'Nghiệm của hệ phương trình $\\begin{cases} 2x + y = 5 \\\\ x - y = 1 \\end{cases}$ là cặp số $(x; y)$:',
          cognitiveLevel: CognitiveLevel.UNDERSTANDING,
          explanation: 'Cộng hai vế ta được: $(2x+y) + (x-y) = 5+1 \\iff 3x = 6 \\iff x = 2$. Thay $x = 2$ vào $x - y = 1 \\implies y = 1$. Vậy nghiệm là $(2; 1)$.',
          options: [
            { optionKey: 'A', content: '$(2;\\; 1)$', isCorrect: true },
            { optionKey: 'B', content: '$(1;\\; 2)$', isCorrect: false },
            { optionKey: 'C', content: '$(3;\\; -1)$', isCorrect: false },
            { optionKey: 'D', content: '$(2;\\; 3)$', isCorrect: false }
          ]
        },
        {
          content: 'Hệ phương trình $\\begin{cases} x + 2y = 4 \\\\ 2x + 4y = 8 \\end{cases}$ có bao nhiêu nghiệm?',
          cognitiveLevel: CognitiveLevel.UNDERSTANDING,
          explanation: 'Ta thấy tỉ số các hệ số: $\\frac{1}{2} = \\frac{2}{4} = \\frac{4}{8}$, hai đường thẳng trùng nhau nên hệ có vô số nghiệm.',
          options: [
            { optionKey: 'A', content: 'Vô số nghiệm', isCorrect: true },
            { optionKey: 'B', content: 'Vô nghiệm', isCorrect: false },
            { optionKey: 'C', content: 'Một nghiệm duy nhất', isCorrect: false },
            { optionKey: 'D', content: 'Hai nghiệm', isCorrect: false }
          ]
        }
      ],
      'SKILL-04': [
        {
          content: 'Hai bạn An và Bình có tổng cộng 50 viên bi. Biết số bi của An nhiều hơn số bi của Bình 10 viên. Số bi của An là:',
          cognitiveLevel: CognitiveLevel.APPLYING,
          explanation: 'Gọi số bi của An là x, Bình là y (x, y > 0). Ta có hệ: $\\begin{cases} x + y = 50 \\\\ x - y = 10 \\end{cases}$. Cộng 2 phương trình: $2x = 60 \\implies x = 30$. An có 30 viên bi.',
          options: [
            { optionKey: 'A', content: '30 viên', isCorrect: true },
            { optionKey: 'B', content: '20 viên', isCorrect: false },
            { optionKey: 'C', content: '35 viên', isCorrect: false },
            { optionKey: 'D', content: '25 viên', isCorrect: false }
          ]
        }
      ],
      'SKILL-05': [
        {
          content: 'Tập nghiệm của phương trình bậc hai $x^2 - 5x + 6 = 0$ là:',
          cognitiveLevel: CognitiveLevel.UNDERSTANDING,
          explanation: 'Ta có $\\Delta = (-5)^2 - 4(1)(6) = 25 - 24 = 1 > 0$. Nghiệm là $x_1 = \\frac{5 + 1}{2} = 3$ và $x_2 = \\frac{5 - 1}{2} = 2$.',
          options: [
            { optionKey: 'A', content: '$S = \\{2;\\; 3\\}$', isCorrect: true },
            { optionKey: 'B', content: '$S = \\{-2;\\; -3\\}$', isCorrect: false },
            { optionKey: 'C', content: '$S = \\{1;\\; 6\\}$', isCorrect: false },
            { optionKey: 'D', content: '$S = \\{-1;\\; -6\\}$', isCorrect: false }
          ]
        }
      ],
      'SKILL-06': [
        {
          content: 'Cho phương trình $x^2 - 7x + 10 = 0$. Tổng và tích hai nghiệm $S = x_1 + x_2$ và $P = x_1 \\cdot x_2$ là:',
          cognitiveLevel: CognitiveLevel.REMEMBERING,
          explanation: 'Theo định lý Viète: $S = x_1 + x_2 = -\\frac{b}{a} = -\\frac{-7}{1} = 7$ và $P = x_1 x_2 = \\frac{c}{a} = \\frac{10}{1} = 10$.',
          options: [
            { optionKey: 'A', content: '$S = 7;\\; P = 10$', isCorrect: true },
            { optionKey: 'B', content: '$S = -7;\\; P = 10$', isCorrect: false },
            { optionKey: 'C', content: '$S = 7;\\; P = -10$', isCorrect: false },
            { optionKey: 'D', content: '$S = -7;\\; P = -10$', isCorrect: false }
          ]
        }
      ],
      'SKILL-07': [
        {
          content: 'Cho tam giác $ABC$ vuông tại $A$ có $AB = 6$ cm, $AC = 8$ cm. Giá trị $\\sin B$ bằng:',
          cognitiveLevel: CognitiveLevel.APPLYING,
          explanation: 'Áp dụng định lý Pythagoras: $BC = \\sqrt{6^2 + 8^2} = 10\\text{ cm}$. Tỉ số $\\sin B = \\frac{\\text{đối}}{\\text{huyền}} = \\frac{AC}{BC} = \\frac{8}{10} = \\frac{4}{5}$.',
          options: [
            { optionKey: 'A', content: '$\\frac{3}{5}$', isCorrect: false },
            { optionKey: 'B', content: '$\\frac{4}{5}$', isCorrect: true },
            { optionKey: 'C', content: '$\\frac{3}{4}$', isCorrect: false },
            { optionKey: 'D', content: '$\\frac{4}{3}$', isCorrect: false }
          ]
        },
        {
          content: 'Trong tam giác $ABC$ vuông tại $A$ có $\\widehat{C} = 30^\\circ$ và cạnh huyền $BC = 12$ cm. Độ dài cạnh $AB$ là:',
          cognitiveLevel: CognitiveLevel.UNDERSTANDING,
          explanation: 'Ta có $\\sin C = \\frac{AB}{BC} \\implies AB = BC \\times \\sin 30^\\circ = 12 \\times \\frac{1}{2} = 6\\text{ cm}$.',
          options: [
            { optionKey: 'A', content: '$6$ cm', isCorrect: true },
            { optionKey: 'B', content: '$6\\sqrt{3}$ cm', isCorrect: false },
            { optionKey: 'C', content: '$8$ cm', isCorrect: false },
            { optionKey: 'D', content: '$4$ cm', isCorrect: false }
          ]
        }
      ],
      'SKILL-08': [
        {
          content: 'Số đo của góc nội tiếp chắn nửa đường tròn luôn bằng:',
          cognitiveLevel: CognitiveLevel.REMEMBERING,
          explanation: 'Theo định lý về góc nội tiếp trong hình học 9: Góc nội tiếp chắn nửa đường tròn là góc vuông ($90^\\circ$).',
          options: [
            { optionKey: 'A', content: '$90^\\circ$', isCorrect: true },
            { optionKey: 'B', content: '$180^\\circ$', isCorrect: false },
            { optionKey: 'C', content: '$60^\\circ$', isCorrect: false },
            { optionKey: 'D', content: '$45^\\circ$', isCorrect: false }
          ]
        }
      ]
    };

    const questions = questionsBySkill[s.code] || [];
    for (const q of questions) {
      const existingQ = await prisma.question.findFirst({
        where: { content: q.content }
      });

      if (!existingQ) {
        await prisma.question.create({
          data: {
            skillId: skill.id,
            versionNumber: 1,
            cognitiveLevel: q.cognitiveLevel,
            content: q.content,
            explanation: q.explanation,
            status: QuestionStatus.PUBLISHED,
            authorId: teacherUser.id,
            reviewerId: adminUser.id,
            options: {
              create: q.options
            }
          }
        });
      }
    }
  }

  // 6. Create Classroom for Verified Teacher with Crockford code KTR2QX79 if not exists
  const existingClass = await prisma.classroom.findFirst({
    where: { name: 'Toán 9A1 - Thầy Nguyễn Văn Nam' }
  });

  if (!existingClass) {
    await prisma.classroom.create({
      data: {
        teacherId: teacherUser.id,
        name: 'Toán 9A1 - Thầy Nguyễn Văn Nam',
        grade: 9,
        academicYear: '2026-2027',
        isActive: true,
        inviteCodes: {
          create: {
            codeHash: 'HMAC_HASH_KTR2QX79',
            codePlainPrefix: 'KTR',
            maxUses: 45,
            usedCount: 0,
            expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000)
          }
        }
      }
    });
  }

  console.log('Database seeded successfully!');
  console.log('Sample Accounts created:');
  console.log('- Admin: admin / P@ssword123!');
  console.log('- Verified Teacher: thaynam / P@ssword123!');
  console.log('- Teacher Applicant: teacher_pending / P@ssword123!');
  console.log('- Student: duc_nguyen / P@ssword123!');
  console.log('- Class code: KTR2QX79');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
