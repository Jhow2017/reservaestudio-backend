import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AttachMercadoPagoPreapprovalCardDto {
    @ApiProperty({ description: 'Token de cartão gerado no front (Mercado Pago.js)' })
    @IsString()
    @MinLength(1)
    cardTokenId!: string;
}
