import type { PaymentMethod } from '../../enterprise/entities/subscription-checkout-session';

export interface CreateSubscriptionCheckoutSessionRequest {
    checkoutId: string;
    customerEmail: string;
    customerName: string;
    planTier: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
    billingCycle: 'MONTHLY' | 'ANNUAL';
    domainType: 'SUBDOMAIN' | 'CUSTOM_DOMAIN';
    /** Escolha do usuário no start do checkout; define os tipos aceitos na sessão Stripe. */
    paymentMethod: PaymentMethod;
    metadata: Record<string, string>;
}

/** Checkout hospedado na Stripe (redirect); o front abre `url` no navegador. */
export interface CreateSubscriptionCheckoutSessionResponse {
    sessionId: string;
    url: string;
    customerId?: string | null;
}

export interface StripeWebhookEvent {
    id: string;
    type: string;
    data: {
        object: Record<string, unknown>;
    };
}

export abstract class StripeSubscriptionGateway {
    abstract createSubscriptionCheckoutSession(
        input: CreateSubscriptionCheckoutSessionRequest,
    ): Promise<CreateSubscriptionCheckoutSessionResponse>;

    abstract constructEvent(payload: Buffer | string, signature: string): StripeWebhookEvent;
}
