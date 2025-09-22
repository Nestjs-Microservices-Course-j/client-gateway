import { IsString, IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsStrongPassword()
    password: string;
}