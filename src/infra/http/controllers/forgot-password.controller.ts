import { Controller, Post, Body, HttpCode, HttpStatus, Inject, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ForgotPasswordUseCase } from '../../../domain/auth/application/use-cases/forgot-password';
import { AuditLogger } from '../../../domain/auth/application/services/audit-logger';
import { Public } from '../../../infra/auth/public';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ThrottleForgotPassword } from '../decorators/throttle.decorator';

@ApiTags('Auth')
@Controller('/auth/forgot-password')
export class ForgotPasswordController {
    constructor(
        private forgotPassword: ForgotPasswordUseCase,
        @Inject(AuditLogger) private auditLogger: AuditLogger,
    ) { }

    @Post()
    @Public()
    @ThrottleForgotPassword()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Solicitar recuperação de senha' })
    @ApiBody({ type: ForgotPasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Se o email existir, um link de recuperação foi enviado',
        schema: {
            example: {
                message: 'If this email exists, a password reset link has been sent.',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Dados inválidos',
    })
    @ApiResponse({
        status: 429,
        description: 'Muitas tentativas. Limite de 3 tentativas por minuto excedido',
    })
    async handle(@Body() body: ForgotPasswordDto, @Req() req: Request) {
        const { email } = body;

        const { message } = await this.forgotPassword.execute({
            email,
        });

        // Registrar log de auditoria (userId será null pois não está autenticado)
        const ipAddress = req.ip || req.socket.remoteAddress || null;
        const userAgent = req.get('user-agent') || null;

        await this.auditLogger.log({
            userId: null,
            action: 'FORGOT_PASSWORD_REQUEST',
            entityType: 'User',
            metadata: {
                email,
            },
            ipAddress,
            userAgent,
        });

        return {
            message,
        };
    }
}