import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOnboardingDto {
  @ApiProperty({ description: 'Khối lớp học (10 - 12)', example: 10, required: false })
  @IsInt()
  @Min(10)
  @Max(12)
  @IsOptional()
  grade?: number;

  @ApiProperty({ description: 'Mục tiêu học tập', example: 'Ôn thi tốt nghiệp THPT', required: false })
  @IsString()
  @IsOptional()
  targetGoal?: string;

  @ApiProperty({ description: 'Thời gian học mỗi ngày (phút)', example: 45, required: false })
  @IsInt()
  @Min(15)
  @Max(240)
  @IsOptional()
  dailyMinutes?: number;

  @ApiProperty({ description: 'Ngày thi dự kiến (DD/MM/YYYY)', example: '05/06/2027', required: false })
  @IsString()
  @IsOptional()
  examDate?: string;

  @ApiProperty({ description: 'Tự đánh giá năng lực hiện tại', example: 'Khá', required: false })
  @IsString()
  @IsOptional()
  selfAssessment?: string;
}
