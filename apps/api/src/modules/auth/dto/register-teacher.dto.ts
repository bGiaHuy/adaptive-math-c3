import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterTeacherDto {
  @ApiProperty({ example: 'Thầy Nguyễn Văn Nam', description: 'Họ và tên giáo viên' })
  @IsString()
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @MinLength(2, { message: 'Họ tên phải có ít nhất 2 ký tự' })
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ example: 'thaynam@adaptivemath.vn', description: 'Email công tác của giáo viên' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: 'P@ssword123!', description: 'Mật khẩu bảo vệ' })
  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  password: string;

  @ApiPropertyOptional({ example: 'THCS Chu Văn An', description: 'Tên trường công tác' })
  @IsOptional()
  @IsString()
  schoolName?: string;

  @ApiPropertyOptional({ example: 'Hà Nội', description: 'Tỉnh / Thành phố' })
  @IsOptional()
  @IsString()
  city?: string;
}
