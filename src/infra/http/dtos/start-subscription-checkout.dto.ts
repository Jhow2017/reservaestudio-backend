import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';
import { BillingCycle, DomainType, PaymentMethod, PlanTier } from '../../../domain/subscription-checkout/enterprise/entities/subscription-checkout-session';

export class StartSubscriptionCheckoutDto {
    @ApiProperty({ enum: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'] })
    @IsIn(['STARTER', 'PROFESSIONAL', 'ENTERPRISE'])
    planTier: PlanTier;

    @ApiProperty({ enum: ['MONTHLY', 'ANNUAL'] })
    @IsIn(['MONTHLY', 'ANNUAL'])
    billingCycle: BillingCycle;

    @ApiProperty({ example: 'Rock Valley Studio' })
    @IsString()
    @IsNotEmpty()
    studioName: string;

    @ApiProperty({ enum: ['SUBDOMAIN', 'CUSTOM_DOMAIN'] })
    @IsIn(['SUBDOMAIN', 'CUSTOM_DOMAIN'])
    domainType: DomainType;

    @ApiPropertyOptional({ example: 'seuestudio' })
    @IsOptional()
    @IsString()
    @Matches(/^[a-z0-9-]+$/)
    subdomain?: string;

    @ApiPropertyOptional({ example: 'www.seuestudio.com.br' })
    @IsOptional()
    @IsString()
    customDomain?: string;

    @ApiProperty({ enum: ['CARD', 'PIX', 'BOLETO'] })
    @IsIn(['CARD', 'PIX', 'BOLETO'])
    paymentMethod: PaymentMethod;

    @ApiProperty({ example: 1970 })
    @IsNumber()
    @Min(0)
    totalAmount: number;
}
