import { Controller, Post, Req, UseGuards, UnauthorizedException, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LogoutUseCase } from '../../../domain/auth/application/use-cases/logout';
import { AuditLogger } from '../../../domain/auth/application/services/audit-logger';
import { CurrentUser } from '../../auth/current-user-decorator';
import { User } from '../../../domain/auth/enterprise/entities/user';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class LogoutController {
    constructor(
        private logoutUseCase: LogoutUseCase,
        @Inject(AuditLogger) private auditLogger: AuditLogger,
    ) { }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Fazer logout' })
    @ApiResponse({
        status: 200,
        description: 'Logout realizado com sucesso',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Logout realizado com sucesso' },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async handle(@Req() request: Request, @CurrentUser() user: User) {
        // Extrai o token do header Authorization
        const authHeader = request.headers.authorization;
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            throw new UnauthorizedException('Token não encontrado');
        }

        const result = await this.logoutUseCase.execute({ token });

        // Registrar log de auditoria
        const ipAddress = request.ip || request.socket.remoteAddress || null;
        const userAgent = request.get('user-agent') || null;

        await this.auditLogger.log({
            userId: user.id.toString(),
            action: 'LOGOUT',
            entityType: 'User',
            entityId: user.id.toString(),
            ipAddress,
            userAgent,
        });

        return result;
    }
}