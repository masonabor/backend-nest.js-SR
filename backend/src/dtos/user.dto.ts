import { IsEmail, IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CreateUserDto {
  @IsInt()
  @IsOptional()
  userId: number

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class BanUserDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  banReason?: string;
}

export class GetUserDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  id: number;
}

