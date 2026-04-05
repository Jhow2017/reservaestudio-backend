import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateBookingMercadoPagoPaymentDto {
    @ApiProperty({ example: 'cliente@email.com' })
    @IsEmail()
    payerEmail!: string;

    @ApiProperty({ description: 'ID do meio de pagamento (ex.: visa)', example: 'visa' })
    @IsString()
    @MinLength(1)
    paymentMethodId!: string;

    @ApiProperty({ example: 'CPF' })
    @IsString()
    @MinLength(1)
    payerIdentificationType!: string;

    @ApiProperty({ example: '12345678909' })
    @IsString()
    @MinLength(1)
    payerIdentificationNumber!: string;

    @ApiPropertyOptional({ description: 'Token do cartão (Mercado Pago.js)' })
    @IsOptional()
    @IsString()
    token?: string;

    @ApiPropertyOptional({ description: 'Parcelas (cartão)', minimum: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    installments?: number;

    @ApiPropertyOptional({ description: 'ID do emissor (cartão), quando exigido' })
    @IsOptional()
    @IsString()
    issuerId?: string;
}
