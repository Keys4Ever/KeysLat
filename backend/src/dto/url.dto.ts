import { IsArray, isNotEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUrlDto {
    @IsNotEmpty()
    @IsString()
    user_id: string;
  
    @IsNotEmpty()
    @IsString()
    original_url: string;
  
    @IsOptional()
    @IsString()
    short_url: string;
  
    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsArray()
    url_tags: number[];
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
    new_short_url: string;
  
    @IsOptional()
    @IsString()
    new_original_url: string;
  
    @IsOptional()
    @IsString()
    new_description: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsArray()
    tags: number[];

    @IsOptional()
    @IsArray()
    new_tags: number[];
}