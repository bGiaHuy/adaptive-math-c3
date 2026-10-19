import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinClassroomDto {
  @ApiProperty({ description: 'Mã mời lớp học gồm 8 ký tự Crockford Base32', example: 'KTR2QX79' })
  @IsString()
  @IsNotEmpty()
  @Length(4, 16)
  code: string;
}
