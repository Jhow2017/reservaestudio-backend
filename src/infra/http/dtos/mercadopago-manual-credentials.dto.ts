import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class MercadoPagoManualCredentialsDto {
    @ApiProperty({ description: 'Access token do vendedor (conta Mercado Pago)', minLength: 16 })
    @IsString()
    @MinLength(16)
    accessToken!: string;

    @ApiProperty({ description: 'Public key para checkout no front', minLength: 8 })
    @IsString()
    @MinLength(8)
    publicKey!: string;
}
