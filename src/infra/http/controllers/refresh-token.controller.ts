import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RefreshTokenUseCase } from '../../../domain/auth/application/use-cases/refresh-token';
import { Public } from '../../../infra/auth/public';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class RefreshTokenDto {
    @ApiProperty({
        description: 'Refresh token para renovar o access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @IsNotEmpty({ message: 'Refresh token is required' })
    @IsString({ message: 'Refresh token must be a string' })
    refreshToken: string;
}

@ApiTags('Auth')
@Controller('/auth/refresh')
export class RefreshTokenController {
    constructor(private refreshToken: RefreshTokenUseCase) { }

    @Post()
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Renovar access token usando refresh token' })
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({
        status: 200,
        description: 'Tokens renovados com sucesso',
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: 'uuid-aqui',
                    name: 'João Silva',
                    email: 'joao@email.com',
                    createdAt: '2024-12-08T00:00:00.000Z',
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Dados inválidos',
    })
    @ApiResponse({
        status: 401,
        description: 'Refresh token inválido',
    })
    async handle(@Body() body: RefreshTokenDto) {
        const { refreshToken } = body;

        const { accessToken, refreshToken: newRefreshToken, user } =
            await this.refreshToken.execute({
                refreshToken,
            });

        return {
            accessToken,
            refreshToken: newRefreshToken,
            user: {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        };
    }
}

