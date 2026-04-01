import { Inject } from '@nestjs/common';
import { UseCaseError } from '../../../../core/errors/use-case-error';
import { SubscriptionCheckoutSession } from '../../enterprise/entities/subscription-checkout-session';
import { SubscriptionCheckoutSessionsRepository } from '../repositories/subscription-checkout-sessions-repository';

export interface GetSubscriptionCheckoutRequest {
    checkoutId: string;
}

export interface GetSubscriptionCheckoutResponse {
    checkoutSession: SubscriptionCheckoutSession;
}

export class SubscriptionCheckoutSessionNotFoundError extends UseCaseError {
    constructor() {
        super('Subscription checkout session not found');
    }
}

export class GetSubscriptionCheckoutUseCase {
    constructor(
        @Inject(SubscriptionCheckoutSessionsRepository)
        private subscriptionCheckoutSessionsRepository: SubscriptionCheckoutSessionsRepository,
    ) { }

    async execute({ checkoutId }: GetSubscriptionCheckoutRequest): Promise<GetSubscriptionCheckoutResponse> {
        const checkoutSession = await this.subscriptionCheckoutSessionsRepository.findById(checkoutId);

        if (!checkoutSession) {
            throw new SubscriptionCheckoutSessionNotFoundError();
        }

        return { checkoutSession };
    }
}
