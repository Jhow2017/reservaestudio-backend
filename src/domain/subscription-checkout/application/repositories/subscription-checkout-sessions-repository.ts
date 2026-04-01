import { SubscriptionCheckoutSession } from '../../enterprise/entities/subscription-checkout-session';

export abstract class SubscriptionCheckoutSessionsRepository {
    abstract create(session: SubscriptionCheckoutSession): Promise<void>;
    abstract findById(id: string): Promise<SubscriptionCheckoutSession | null>;
    abstract save(session: SubscriptionCheckoutSession): Promise<void>;
}
