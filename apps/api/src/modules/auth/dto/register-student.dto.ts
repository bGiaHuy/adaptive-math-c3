import { IsString, IsNotEmpty, MinLength, MaxLength, Matches, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterStudentDto {
  @ApiProperty({ example: 'Nguyễn Minh Đức', description: 'Họ và tên học sinh' })
  @IsString()
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @MinLength(2, { message: 'Họ tên phải có ít nhất 2 ký tự' })
  @MaxLength(100, { message: 'Họ tên tối đa 100 ký tự' })
  fullName: string;

  @ApiProperty({ example: 'duc_nguyen9', description: 'Tên đăng nhập duy nhất' })
  @IsString()
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @MinLength(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự' })
  @MaxLength(30, { message: 'Tên đăng nhập tối đa 30 ký tự' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới' })
  username: string;

  @ApiProperty({ example: 'P@ssword123!', description: 'Mật khẩu bảo vệ tài khoản' })
  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  password: string;

  @ApiPropertyOptional({ example: 'hocsinh@adaptivemath.vn', description: 'Email cá nhân của học sinh' })
  @IsOptional()
  @IsEmail({}, { message: 'Email học sinh không hợp lệ' })
  email?: string;

  @ApiPropertyOptional({ example: 'phuhuynh@example.com', description: 'Email phụ huynh nhận báo cáo tiến độ' })
  @IsOptional()
  @IsEmail({}, { message: 'Email phụ huynh không hợp lệ' })
  parentEmail?: string;
}
