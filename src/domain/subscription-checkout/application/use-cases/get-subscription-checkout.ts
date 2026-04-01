import { Inject } from '@nestjs/common';
import { UseCaseError } from '../../../../core/errors/use-case-error';
import { Role } from '../../../auth/enterprise/value-objects/role';
import { SubscriptionCheckoutSession } from '../../enterprise/entities/subscription-checkout-session';
import { SubscriptionCheckoutSessionsRepository } from '../repositories/subscription-checkout-sessions-repository';

export interface GetSubscriptionCheckoutRequest {
    checkoutId: string;
    requesterUserId: string;
    requesterRole: Role;
}

export interface GetSubscriptionCheckoutResponse {
    checkoutSession: SubscriptionCheckoutSession;
}

export class SubscriptionCheckoutSessionNotFoundError extends UseCaseError {
    constructor() {
        super('Subscription checkout session not found');
    }
}

export class SubscriptionCheckoutAccessDeniedError extends UseCaseError {
    constructor() {
        super('You do not have permission to access this checkout');
    }
}

export class GetSubscriptionCheckoutUseCase {
    constructor(
        @Inject(SubscriptionCheckoutSessionsRepository)
        private subscriptionCheckoutSessionsRepository: SubscriptionCheckoutSessionsRepository,
    ) { }

    async execute({ checkoutId, requesterUserId, requesterRole }: GetSubscriptionCheckoutRequest): Promise<GetSubscriptionCheckoutResponse> {
        const checkoutSession = await this.subscriptionCheckoutSessionsRepository.findById(checkoutId);

        if (!checkoutSession) {
            throw new SubscriptionCheckoutSessionNotFoundError();
        }

        if (requesterRole !== Role.OWNER && checkoutSession.subscriberUserId !== requesterUserId) {
            throw new SubscriptionCheckoutAccessDeniedError();
        }

        return { checkoutSession };
    }
}
