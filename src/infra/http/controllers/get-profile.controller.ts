import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/current-user-decorator';
import { User } from '../../../domain/auth/enterprise/entities/user';

@ApiTags('Profile')
@Controller('/profile')
export class GetProfileController {
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Buscar perfil do usuário autenticado' })
    @ApiResponse({
        status: 200,
        description: 'Perfil do usuário',
        schema: {
            example: {
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
        status: 401,
        description: 'Não autenticado',
    })
    async handle(@CurrentUser() user: User) {
        return {
            user: {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        };
    }
}