import { IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  userName: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;
}
