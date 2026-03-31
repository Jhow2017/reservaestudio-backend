import { IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthBaseDto } from './auth-base.dto';

export class RegisterUserDto extends AuthBaseDto {
    @ApiProperty({
        description: 'Nome completo do usuário',
        example: 'João Silva',
    })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @ApiProperty({
        description: 'Senha do usuário (mínimo 6 caracteres)',
        example: 'senha123',
        minLength: 6,
    })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}