import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTeacherProfileDto {
  @ApiProperty({ description: 'Tên trường công tác', example: 'THPT Giảng Võ' })
  @IsString({ message: 'Tên trường phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Vui lòng nhập tên trường công tác.' })
  @MaxLength(200, { message: 'Tên trường tối đa 200 ký tự.' })
  schoolName: string;

  @ApiPropertyOptional({ description: 'Tỉnh / Thành phố', example: 'Hà Nội' })
  @IsString({ message: 'Tỉnh/thành phố phải là chuỗi ký tự.' })
  @IsOptional()
  @MaxLength(100, { message: 'Tỉnh/thành phố tối đa 100 ký tự.' })
  city?: string;
}
