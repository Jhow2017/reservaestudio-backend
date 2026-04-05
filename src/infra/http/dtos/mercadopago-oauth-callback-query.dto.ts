import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/** Query do callback MP; campos opcionais porque o MP pode redirecionar com `error` sem `code`. */
export class MercadoPagoOauthCallbackQueryDto {
    @ApiPropertyOptional({ description: 'Código OAuth retornado pelo Mercado Pago' })
    @IsOptional()
    @IsString()
    code?: string;

    @ApiPropertyOptional({ description: 'State PKCE emitido em /auth/mercadopago/connect' })
    @IsOptional()
    @IsString()
    state?: string;
}
