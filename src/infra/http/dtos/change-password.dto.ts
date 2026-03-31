import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
    @ApiProperty({
        description: 'Senha atual do usuário',
        example: 'senhaAtual123',
    })
    @IsNotEmpty({ message: 'Current password is required' })
    @IsString({ message: 'Current password must be a string' })
    currentPassword: string;

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