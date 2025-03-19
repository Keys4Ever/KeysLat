import { IsNotEmpty, IsEmail, IsOptional, IsString } from 'class-validator';
import { AuthProvider } from 'src/entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  provider_id: string;

  @IsOptional()
  @IsString()
  auth_provider: AuthProvider;

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
    provider_id?: string; 
  
    @IsOptional()
    @IsString()
    auth_provider?: AuthProvider; 
  
    @IsOptional()
    @IsString()
    password?: string;
  
    @IsOptional()
    @IsString()
    profile_picture?: string;
}
