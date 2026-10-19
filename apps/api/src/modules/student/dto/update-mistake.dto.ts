import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMistakeDto {
  @ApiProperty({ description: 'Đánh dấu đã hiểu rõ/thành thạo câu hỏi này', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isMastered?: boolean;

  @ApiProperty({ description: 'Ghi chú cá nhân của học sinh', example: 'Cần chú ý dấu âm khi nhân hai vế', required: false })
  @IsString()
  @IsOptional()
  userNotes?: string;
}
