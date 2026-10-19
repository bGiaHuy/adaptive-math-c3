import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'duc_nguyen', description: 'Tên đăng nhập hoặc Email' })
  @IsString()
  @IsNotEmpty({ message: 'Tên đăng nhập hoặc email không được để trống' })
  identifier: string;

  @ApiProperty({ example: 'P@ssword123!', description: 'Mật khẩu' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;
}
