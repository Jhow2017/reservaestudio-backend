import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';
import { ListAuditLogsUseCase } from '../../../domain/auth/application/use-cases/list-audit-logs';

@ApiTags('Audit')
@Controller('/audit-logs')
@UseGuards(JwtAuthGuard, AdminGuard)
export class ListAuditLogsController {
    constructor(private listAuditLogsUseCase: ListAuditLogsUseCase) {}

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Listar logs de auditoria (apenas administradores)' })
    @ApiResponse({
        status: 200,
        description: 'Lista de logs de auditoria',
        schema: {
            example: {
                auditLogs: [
                    {
                        id: 'uuid-aqui',
                        userId: 'user-uuid',
                        action: 'LOGIN',
                        entityType: 'User',
                        entityId: 'user-uuid',
                        metadata: { email: 'user@email.com' },
                        ipAddress: '127.0.0.1',
                        userAgent: 'Mozilla/5.0...',
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
    async handle(
        @Query('userId') userId?: string,
        @Query('action') action?: string,
    ) {
        const { auditLogs } = await this.listAuditLogsUseCase.execute({
            userId,
            action,
        });

        return {
            auditLogs: auditLogs.map((log) => ({
                id: log.id.toString(),
                userId: log.userId,
                action: log.action,
                entityType: log.entityType,
                entityId: log.entityId,
                metadata: log.metadata,
                ipAddress: log.ipAddress,
                userAgent: log.userAgent,
                createdAt: log.createdAt,
            })),
        };
    }
}

