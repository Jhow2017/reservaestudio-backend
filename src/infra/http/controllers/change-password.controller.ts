import { Controller, Put, Body, HttpCode, HttpStatus, Inject, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ChangePasswordUseCase } from '../../../domain/auth/application/use-cases/change-password';
import { AuditLogger } from '../../../domain/auth/application/services/audit-logger';
import { CurrentUser } from '../../../infra/auth/current-user-decorator';
import { User } from '../../../domain/auth/enterprise/entities/user';
import { ChangePasswordDto } from '../dtos/change-password.dto';

@ApiTags('Auth')
@Controller('/auth/change-password')
export class ChangePasswordController {
    constructor(
        private changePassword: ChangePasswordUseCase,
        @Inject(AuditLogger) private auditLogger: AuditLogger,
    ) { }

    @Put()
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Alterar senha do usuário autenticado' })
    @ApiBody({ type: ChangePasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Senha alterada com sucesso',
        schema: {
            example: {
                success: true,
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Dados inválidos',
    })
    @ApiResponse({
        status: 401,
        description: 'Senha atual incorreta ou não autenticado',
    })
    async handle(
        @CurrentUser() user: User,
        @Body() body: ChangePasswordDto,
        @Req() req: Request,
    ) {
        const { currentPassword, newPassword } = body;

        await this.changePassword.execute({
            userId: user.id.toString(),
            currentPassword,
            newPassword,
        });

        // Registrar log de auditoria
        const ipAddress = req.ip || req.socket.remoteAddress || null;
        const userAgent = req.get('user-agent') || null;

        await this.auditLogger.log({
            userId: user.id.toString(),
            action: 'PASSWORD_CHANGE',
            entityType: 'User',
            entityId: user.id.toString(),
            ipAddress,
            userAgent,
        });

        return {
            success: true,
        };
    }
}