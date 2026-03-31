import { Controller, Post, Body, HttpCode, HttpStatus, Inject, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ResetPasswordUseCase } from '../../../domain/auth/application/use-cases/reset-password';
import { AuditLogger } from '../../../domain/auth/application/services/audit-logger';
import { Public } from '../../../infra/auth/public';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

@ApiTags('Auth')
@Controller('/auth/reset-password')
export class ResetPasswordController {
    constructor(
        private resetPassword: ResetPasswordUseCase,
        @Inject(AuditLogger) private auditLogger: AuditLogger,
    ) { }

    @Post()
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Redefinir senha usando token de recuperação' })
    @ApiBody({ type: ResetPasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Senha redefinida com sucesso',
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
        description: 'Token inválido ou expirado',
    })
    async handle(@Body() body: ResetPasswordDto, @Req() req: Request) {
        const { token, newPassword } = body;

        const { userId } = await this.resetPassword.execute({
            token,
            newPassword,
        });

        // Registrar log de auditoria
        const ipAddress = req.ip || req.socket.remoteAddress || null;
        const userAgent = req.get('user-agent') || null;

        await this.auditLogger.log({
            userId,
            action: 'PASSWORD_RESET',
            entityType: 'User',
            entityId: userId,
            ipAddress,
            userAgent,
        });

        return {
            success: true,
        };
    }
}