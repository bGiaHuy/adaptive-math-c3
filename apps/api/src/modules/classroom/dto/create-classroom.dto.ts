import { IsString, IsNotEmpty, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassroomDto {
  @ApiProperty({ description: 'Tên lớp học', example: 'Toán 10A2' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Khối lớp', example: 10, default: 10 })
  @IsInt()
  @Min(10)
  @Max(12)
  @IsOptional()
  grade?: number;

  @ApiProperty({ description: 'Năm học', example: '2026-2027', default: '2026-2027' })
  @IsString()
  @IsOptional()
  academicYear?: string;
}
