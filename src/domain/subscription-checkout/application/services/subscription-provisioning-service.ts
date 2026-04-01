import { SubscriptionCheckoutSession } from '../../enterprise/entities/subscription-checkout-session';

export interface SubscriptionProvisioningResult {
    studioId: string;
    subscriberUserId: string;
}

export abstract class SubscriptionProvisioningService {
    abstract provisionFromCheckout(session: SubscriptionCheckoutSession): Promise<SubscriptionProvisioningResult>;
}
