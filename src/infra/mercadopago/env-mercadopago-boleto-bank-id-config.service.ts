import { Injectable } from '@nestjs/common';
import { MercadoPagoBoletoBankIdConfig } from '../../domain/subscription-checkout/application/services/mercadopago-boleto-bank-id-config';

@Injectable()
export class EnvMercadoPagoBoletoBankIdConfigService extends MercadoPagoBoletoBankIdConfig {
    getBoletoBankPaymentMethodId(): string {
        return (process.env.MERCADOPAGO_BOLETO_BANK_ID ?? 'bolbradesco').trim();
    }
}
