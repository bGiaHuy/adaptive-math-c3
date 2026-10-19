import { IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateInviteCodeDto {
  @ApiProperty({ description: 'Số lượt tham gia tối đa', example: 45, default: 50, required: false })
  @IsInt()
  @Min(1)
  @Max(500)
  @IsOptional()
  maxUses?: number;

  @ApiProperty({ description: 'Số ngày hết hạn', example: 30, default: 30, required: false })
  @IsInt()
  @Min(1)
  @Max(180)
  @IsOptional()
  expiresInDays?: number;
}
