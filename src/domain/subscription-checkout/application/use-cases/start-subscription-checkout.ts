import { Inject } from '@nestjs/common';
import { UseCaseError } from '../../../../core/errors/use-case-error';
import {
    BillingCycle,
    DomainType,
    PaymentMethod,
    PlanTier,
    SubscriptionCheckoutSession,
} from '../../enterprise/entities/subscription-checkout-session';
import { SubscriptionCheckoutSessionsRepository } from '../repositories/subscription-checkout-sessions-repository';
import { SubdomainAvailabilityChecker } from '../services/subdomain-availability-checker';

export interface StartSubscriptionCheckoutRequest {
    subscriberUserId: string;
    subscriberName: string;
    subscriberEmail: string;
    planTier: PlanTier;
    billingCycle: BillingCycle;
    studioName: string;
    domainType: DomainType;
    subdomain?: string;
    customDomain?: string;
    paymentMethod: PaymentMethod;
    totalAmount: number;
}

export interface StartSubscriptionCheckoutResponse {
    checkoutSession: SubscriptionCheckoutSession;
}

export class InvalidCheckoutDomainError extends UseCaseError {
    constructor() { super('Invalid domain configuration'); }
}

export class SubdomainUnavailableError extends UseCaseError {
    constructor() { super('Subdomain is not available'); }
}

export class StartSubscriptionCheckoutUseCase {
    constructor(
        @Inject(SubscriptionCheckoutSessionsRepository)
        private subscriptionCheckoutSessionsRepository: SubscriptionCheckoutSessionsRepository,
        @Inject(SubdomainAvailabilityChecker)
        private subdomainAvailabilityChecker: SubdomainAvailabilityChecker,
    ) { }

    async execute(data: StartSubscriptionCheckoutRequest): Promise<StartSubscriptionCheckoutResponse> {
        if (data.domainType === 'SUBDOMAIN' && !data.subdomain) {
            throw new InvalidCheckoutDomainError();
        }

        if (data.domainType === 'CUSTOM_DOMAIN' && !data.customDomain) {
            throw new InvalidCheckoutDomainError();
        }

        if (data.domainType === 'SUBDOMAIN' && data.subdomain) {
            const isAvailable = await this.subdomainAvailabilityChecker.isAvailable(data.subdomain);
            if (!isAvailable) {
                throw new SubdomainUnavailableError();
            }
        }

        const session = SubscriptionCheckoutSession.create({
            planTier: data.planTier,
            billingCycle: data.billingCycle,
            studioName: data.studioName,
            ownerName: data.subscriberName,
            ownerEmail: data.subscriberEmail,
            domainType: data.domainType,
            subdomain: data.subdomain ?? null,
            customDomain: data.customDomain ?? null,
            paymentMethod: data.paymentMethod,
            totalAmount: data.totalAmount,
            status: 'PENDING_PAYMENT',
            studioId: null,
            subscriberUserId: data.subscriberUserId,
            paymentReference: null,
        });

        await this.subscriptionCheckoutSessionsRepository.create(session);

        return { checkoutSession: session };
    }
}
