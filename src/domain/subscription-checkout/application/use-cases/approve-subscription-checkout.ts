import { Inject } from '@nestjs/common';
import { UseCaseError } from '../../../../core/errors/use-case-error';
import { SubscriptionCheckoutSession } from '../../enterprise/entities/subscription-checkout-session';
import { SubscriptionCheckoutSessionsRepository } from '../repositories/subscription-checkout-sessions-repository';
import { SubscriptionProvisioningService } from '../services/subscription-provisioning-service';
import { SubscriptionCheckoutSessionNotFoundError } from './get-subscription-checkout';

export interface ApproveSubscriptionCheckoutRequest {
    checkoutId: string;
    paymentReference?: string;
}

export interface ApproveSubscriptionCheckoutResponse {
    checkoutSession: SubscriptionCheckoutSession;
}

export class InvalidSubscriptionCheckoutStatusError extends UseCaseError {
    constructor() {
        super('Subscription checkout cannot be approved in current status');
    }
}

export class ApproveSubscriptionCheckoutUseCase {
    constructor(
        @Inject(SubscriptionCheckoutSessionsRepository)
        private subscriptionCheckoutSessionsRepository: SubscriptionCheckoutSessionsRepository,
        @Inject(SubscriptionProvisioningService)
        private subscriptionProvisioningService: SubscriptionProvisioningService,
    ) { }

    async execute({ checkoutId, paymentReference }: ApproveSubscriptionCheckoutRequest): Promise<ApproveSubscriptionCheckoutResponse> {
        const checkoutSession = await this.subscriptionCheckoutSessionsRepository.findById(checkoutId);

        if (!checkoutSession) {
            throw new SubscriptionCheckoutSessionNotFoundError();
        }

        if (checkoutSession.status !== 'PENDING_PAYMENT') {
            throw new InvalidSubscriptionCheckoutStatusError();
        }

        const provisioning = await this.subscriptionProvisioningService.provisionFromCheckout(checkoutSession);

        checkoutSession.approve(provisioning.studioId, provisioning.subscriberUserId, paymentReference);
        await this.subscriptionCheckoutSessionsRepository.save(checkoutSession);

        return { checkoutSession };
    }
}
