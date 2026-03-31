import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';
import { ListUsersUseCase } from '../../../domain/auth/application/use-cases/list-users';

@ApiTags('Users')
@Controller('/users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class ListUsersController {
    constructor(private listUsersUseCase: ListUsersUseCase) { }

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Listar todos os usuários (apenas administradores)' })
    @ApiResponse({
        status: 200,
        description: 'Lista de usuários',
        schema: {
            example: {
                users: [
                    {
                        id: 'uuid-aqui',
                        name: 'João Silva',
                        email: 'joao@email.com',
                        role: 'USER',
                        createdAt: '2024-12-08T00:00:00.000Z',
                    },
                ],
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Não autenticado',
    })
    @ApiResponse({
        status: 403,
        description: 'Acesso negado (apenas administradores)',
    })
    async handle() {
        const { users } = await this.listUsersUseCase.execute();

        return {
            users: users.map((user) => ({
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            })),
        };
    }
}