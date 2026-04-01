import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ApproveSubscriptionCheckoutDto {
    @ApiPropertyOptional({ example: 'evt_payment_ok_123', description: 'Referência opcional do evento de pagamento' })
    @IsOptional()
    @IsString()
    paymentReference?: string;
}
