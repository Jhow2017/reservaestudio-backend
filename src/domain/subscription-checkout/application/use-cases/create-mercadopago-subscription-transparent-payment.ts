import { Inject } from '@nestjs/common';
import { UseCaseError } from '../../../../core/errors/use-case-error';
import { Role } from '../../../auth/enterprise/value-objects/role';
import { MercadoPagoPaymentMissingIdError } from '../../../../core/errors/mercadopago-payment-missing-id.error';
import { MercadoPagoPlatformSubscriptionGateway } from '../services/mercadopago-platform-subscription-gateway';
import { MercadoPagoBoletoBankIdConfig } from '../services/mercadopago-boleto-bank-id-config';
import { SubscriptionCheckoutSessionsRepository } from '../repositories/subscription-checkout-sessions-repository';
import { SubscriptionCheckoutAccessDeniedError, SubscriptionCheckoutSessionNotFoundError } from './get-subscription-checkout';
import { SubscriptionCheckoutAlreadyApprovedError } from './create-subscription-checkout-stripe-session';
import { SubscriptionCheckoutNotMercadoPagoProviderError } from './create-mercadopago-subscription-preapproval';

export class SubscriptionCheckoutTransparentPaymentWrongMethodError extends UseCaseError {
    constructor() {
        super('Use transparent payment for PIX, BOLETO or CARD token on Mercado Pago checkout');
    }
}

export interface CreateMercadoPagoSubscriptionTransparentPaymentRequest {
    checkoutId: string;
    requesterUserId: string;
    requesterRole: Role;
    payerIdentificationType: string;
    payerIdentificationNumber: string;
}

export interface CreateMercadoPagoSubscriptionTransparentPaymentResponse {
    mercadoPagoPaymentId: string;
    status: string;
    pointOfInteraction?: unknown;
}

export class CreateMercadoPagoSubscriptionTransparentPaymentUseCase {
    constructor(
        @Inject(SubscriptionCheckoutSessionsRepository)
        private checkoutSessionsRepository: SubscriptionCheckoutSessionsRepository,
        @Inject(MercadoPagoPlatformSubscriptionGateway)
        private mercadoPagoGateway: MercadoPagoPlatformSubscriptionGateway,
        @Inject(MercadoPagoBoletoBankIdConfig)
        private boletoBankIdConfig: MercadoPagoBoletoBankIdConfig,
    ) { }

    private paymentMethodIdForCheckout(paymentMethod: 'CARD' | 'PIX' | 'BOLETO'): string {
        if (paymentMethod === 'PIX') return 'pix';
        if (paymentMethod === 'BOLETO') {
            return this.boletoBankIdConfig.getBoletoBankPaymentMethodId();
        }
        return '';
    }

    async execute(
        req: CreateMercadoPagoSubscriptionTransparentPaymentRequest,
    ): Promise<CreateMercadoPagoSubscriptionTransparentPaymentResponse> {
        const checkout = await this.checkoutSessionsRepository.findById(req.checkoutId);
        if (!checkout) throw new SubscriptionCheckoutSessionNotFoundError();

        if (req.requesterRole !== Role.OWNER && checkout.subscriberUserId !== req.requesterUserId) {
            throw new SubscriptionCheckoutAccessDeniedError();
        }

        if (checkout.status !== 'PENDING_PAYMENT') {
            throw new SubscriptionCheckoutAlreadyApprovedError();
        }

        if (checkout.platformPaymentProvider !== 'MERCADOPAGO') {
            throw new SubscriptionCheckoutNotMercadoPagoProviderError();
        }

        if (checkout.paymentMethod === 'CARD') {
            throw new SubscriptionCheckoutTransparentPaymentWrongMethodError();
        }

        const pmId = this.paymentMethodIdForCheckout(checkout.paymentMethod);
        const description = `Assinatura Reserva Estúdio — ${checkout.planTier} (${checkout.billingCycle})`;

        if (!pmId) {
            throw new SubscriptionCheckoutTransparentPaymentWrongMethodError();
        }

        const payment = await this.mercadoPagoGateway.createTransparentPayment({
            checkoutId: checkout.id.toString(),
            ownerEmail: checkout.ownerEmail,
            amountReais: checkout.totalAmount,
            paymentMethodId: pmId,
            payerIdentificationType: req.payerIdentificationType,
            payerIdentificationNumber: req.payerIdentificationNumber,
            description,
        });

        const idRaw = payment.id;
        const mercadoPagoPaymentId = idRaw !== undefined ? String(idRaw) : '';
        if (!mercadoPagoPaymentId) {
            throw new MercadoPagoPaymentMissingIdError();
        }

        checkout.bindMercadoPagoPayment(mercadoPagoPaymentId);
        await this.checkoutSessionsRepository.save(checkout);

        const status = typeof payment.status === 'string' ? payment.status : 'unknown';

        return {
            mercadoPagoPaymentId,
            status,
            pointOfInteraction: payment.point_of_interaction,
        };
    }
}
