import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUrlDto {
    @IsNotEmpty()
    @IsString()
    user_id: string;
  
    @IsNotEmpty()
    @IsString()
    original_url: string;
  
    @IsOptional()
    @IsString()
    short_url?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
}

export class UpdateUrlDto {
    @IsNotEmpty()
    @IsString()
    current_short_url: string;
  
    @IsNotEmpty()
    @IsString()
    current_original_url: string;
  
    @IsOptional()
    @IsString()
    new_short_url?: string;
  
    @IsOptional()
    @IsString()
    new_original_url?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
}