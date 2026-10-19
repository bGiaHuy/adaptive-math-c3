import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TeacherVerificationStatus } from '@prisma/client';

export class ReviewTeacherDto {
  @ApiProperty({
    description: 'Quyết định phê duyệt (VERIFIED hoặc REJECTED)',
    enum: [TeacherVerificationStatus.VERIFIED, TeacherVerificationStatus.REJECTED]
  })
  @IsEnum(TeacherVerificationStatus)
  status: TeacherVerificationStatus;

  @ApiProperty({ description: 'Lý do từ chối nếu không đạt yêu cầu', required: false })
  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
