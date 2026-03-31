import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({
        description: 'Token de recuperação de senha recebido por email',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @IsNotEmpty({ message: 'Token is required' })
    @IsString({ message: 'Token must be a string' })
    token: string;

    @ApiProperty({
        description: 'Nova senha do usuário (mínimo 6 caracteres)',
        example: 'novaSenha123',
        minLength: 6,
    })
    @IsNotEmpty({ message: 'New password is required' })
    @IsString({ message: 'New password must be a string' })
    @MinLength(6, { message: 'New password must be at least 6 characters long' })
    newPassword: string;
}