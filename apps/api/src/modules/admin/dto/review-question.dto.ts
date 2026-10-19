import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionStatus } from '@prisma/client';

export class ReviewQuestionDto {
  @ApiProperty({
    description: 'Trạng thái phê duyệt mới cho câu hỏi (PUBLISHED, IN_REVIEW, hoặc RETIRED)',
    enum: [QuestionStatus.PUBLISHED, QuestionStatus.IN_REVIEW, QuestionStatus.RETIRED]
  })
  @IsEnum(QuestionStatus)
  status: QuestionStatus;

  @ApiProperty({ description: 'Nhận xét khi thẩm định câu hỏi', required: false })
  @IsString()
  @IsOptional()
  comments?: string;
}
