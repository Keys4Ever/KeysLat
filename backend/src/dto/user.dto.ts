import { IsNotEmpty, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional() // because of github auth
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;
  
    @IsOptional()
    @IsString()
    username?: string;

    
    @IsOptional()
    @IsString()
    password: string;

  
    @IsOptional()
    @IsString()
    profile_picture?: string;
}
