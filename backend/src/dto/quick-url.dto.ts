import { IsNotEmpty, IsString } from "class-validator";

export class CreateQuickUrlDto {
    @IsNotEmpty()
    @IsString()
    short_url: string;
  
    @IsNotEmpty()
    @IsString()
    secret_key: string;
}
