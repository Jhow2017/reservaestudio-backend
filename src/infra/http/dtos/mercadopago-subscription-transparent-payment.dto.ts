import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class MercadoPagoSubscriptionTransparentPaymentDto {
    @ApiProperty({ example: 'CPF' })
    @IsString()
    @MinLength(1)
    payerIdentificationType!: string;

    @ApiProperty({ example: '12345678909' })
    @IsString()
    @MinLength(1)
    payerIdentificationNumber!: string;
}
