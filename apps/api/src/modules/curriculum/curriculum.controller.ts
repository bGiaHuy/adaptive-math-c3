import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CurriculumService } from './curriculum.service';

@ApiTags('Curriculum & Skills')
@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get('grades')
  @ApiOperation({ summary: 'Lấy danh sách các khối lớp học' })
  @ApiResponse({ status: 200, description: 'Danh sách khối lớp' })
  getGrades() {
    return this.curriculumService.getGrades();
  }

  @Get('options')
  @ApiOperation({ summary: 'Lấy các tùy chọn thiết lập hồ sơ onboarding (mục tiêu, thời gian, tự đánh giá)' })
  @ApiResponse({ status: 200, description: 'Các bộ tùy chọn thiết lập' })
  getOnboardingOptions() {
    return this.curriculumService.getOnboardingOptions();
  }

  @Get('skills')
  @ApiOperation({ summary: 'Lấy danh sách cây kỹ năng (SkillNodes) gom theo chương của khối lớp' })
  @ApiQuery({ name: 'grade', required: false, type: Number, description: 'Khối lớp (mặc định 10)' })
  @ApiResponse({ status: 200, description: 'Danh sách kỹ năng theo chương' })
  async getSkills(@Query('grade') grade?: string) {
    const gradeNum = grade ? parseInt(grade, 10) : 10;
    return this.curriculumService.getSkillsByGrade(isNaN(gradeNum) ? 10 : gradeNum);
  }
}
