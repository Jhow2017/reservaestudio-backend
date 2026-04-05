import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { User } from '../../../domain/auth/enterprise/entities/user';
import { ProcessMercadoPagoOauthCallbackUseCase } from '../../../domain/auth/application/use-cases/process-mercadopago-oauth-callback';
import { SaveMercadoPagoManualCredentialsUseCase } from '../../../domain/auth/application/use-cases/save-mercadopago-manual-credentials';
import { StartMercadoPagoOauthConnectUseCase } from '../../../domain/auth/application/use-cases/start-mercadopago-oauth-connect';
import { PublicFrontendBaseUrl } from '../../../domain/auth/application/services/public-frontend-base-url';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Public } from '../../auth/public';
import { MercadoPagoManualCredentialsDto } from '../dtos/mercadopago-manual-credentials.dto';
import { MercadoPagoOauthCallbackQueryDto } from '../dtos/mercadopago-oauth-callback-query.dto';

@ApiTags('Mercado Pago — conta do vendedor')
@Controller('auth/mercadopago')
export class MercadoPagoAuthController {
    constructor(
        private readonly startMercadoPagoOauthConnect: StartMercadoPagoOauthConnectUseCase,
        private readonly processMercadoPagoOauthCallback: ProcessMercadoPagoOauthCallbackUseCase,
        private readonly saveMercadoPagoManualCredentials: SaveMercadoPagoManualCredentialsUseCase,
        @Inject(PublicFrontendBaseUrl)
        private readonly publicFrontendBaseUrl: PublicFrontendBaseUrl,
    ) { }

    @Get('connect')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Iniciar OAuth Mercado Pago (PKCE) para receber reservas na conta do vendedor' })
    @ApiResponse({ status: 200, description: 'URL de autorização gerada' })
    @ApiResponse({ status: 401, description: 'Não autenticado' })
    async connect(@Req() req: Request) {
        const user = req.user as User;
        const { authorizationUrl, state } = await this.startMercadoPagoOauthConnect.execute({ user });
        return { mercadoPago: { authorizationUrl, state } };
    }

    @Get('callback')
    @Public()
    @ApiOperation({ summary: 'Callback OAuth (público); redireciona para o frontend' })
    @ApiQuery({ name: 'code', required: false, description: 'Código de troca (ausente se o MP retornar erro)' })
    @ApiQuery({ name: 'state', required: false, description: 'State PKCE (deve bater com o armazenado)' })
    @ApiResponse({ status: 302, description: 'Redirect para /configuracoes/financeiro?mp=connected ou ?mp=error' })
    async callback(
        @Query() query: MercadoPagoOauthCallbackQueryDto,
        @Res() res: Response,
    ): Promise<void> {
        const { code, state } = query;
        const base = this.publicFrontendBaseUrl.get().replace(/\/$/, '');
        try {
            if (!code?.trim() || !state?.trim()) {
                throw new Error('missing oauth params');
            }
            await this.processMercadoPagoOauthCallback.execute({ code: code.trim(), state: state.trim() });
            res.redirect(302, `${base}/configuracoes/financeiro?mp=connected`);
        } catch {
            res.redirect(302, `${base}/configuracoes/financeiro?mp=error`);
        }
    }

    @Post('manual-credentials')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Salvar access token + public key manualmente (alternativa ao OAuth)' })
    @ApiBody({ type: MercadoPagoManualCredentialsDto })
    @ApiResponse({ status: 200, description: 'Credenciais salvas' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 401, description: 'Não autenticado' })
    async manualCredentials(@Body() body: MercadoPagoManualCredentialsDto, @Req() req: Request) {
        const user = req.user as User;
        await this.saveMercadoPagoManualCredentials.execute({
            user,
            accessToken: body.accessToken,
            publicKey: body.publicKey,
        });
        return { ok: true };
    }
}
