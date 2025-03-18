import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTagDto {
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsNotEmpty()
    @IsString()
    user_id: string;
}

export class UpdateTagDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
}