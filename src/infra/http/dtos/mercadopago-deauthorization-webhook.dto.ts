import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MercadoPagoDeauthorizationWebhookDto {
    @ApiPropertyOptional({ example: 'application.deauthorized' })
    @IsOptional()
    @IsString()
    action?: string;

    @ApiPropertyOptional({ description: 'ID do usuário MP (snake_case do payload)' })
    @IsOptional()
    user_id?: string | number;
}
