import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateStudioPayoutProviderDto {
    @ApiProperty({ enum: ['MERCADOPAGO', 'STRIPE'], example: 'MERCADOPAGO' })
    @IsEnum(['MERCADOPAGO', 'STRIPE'])
    payoutProvider!: 'MERCADOPAGO' | 'STRIPE';
}
