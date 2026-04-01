import { Entity } from '../../../../core/entities/entity';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';

export type PlanTier = 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
export type BillingCycle = 'MONTHLY' | 'ANNUAL';
export type DomainType = 'SUBDOMAIN' | 'CUSTOM_DOMAIN';
export type PaymentMethod = 'CARD' | 'PIX' | 'BOLETO';
export type SubscriptionCheckoutStatus = 'PENDING_PAYMENT' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface SubscriptionCheckoutSessionProps {
    planTier: PlanTier;
    billingCycle: BillingCycle;
    studioName: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    ownerDocument: string;
    domainType: DomainType;
    subdomain: string | null;
    customDomain: string | null;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    status: SubscriptionCheckoutStatus;
    studioId: string | null;
    subscriberUserId: string | null;
    paymentReference: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export class SubscriptionCheckoutSession extends Entity<SubscriptionCheckoutSessionProps> {
    get planTier(): PlanTier { return this.props.planTier; }
    get billingCycle(): BillingCycle { return this.props.billingCycle; }
    get studioName(): string { return this.props.studioName; }
    get ownerName(): string { return this.props.ownerName; }
    get ownerEmail(): string { return this.props.ownerEmail; }
    get ownerPhone(): string { return this.props.ownerPhone; }
    get ownerDocument(): string { return this.props.ownerDocument; }
    get domainType(): DomainType { return this.props.domainType; }
    get subdomain(): string | null { return this.props.subdomain; }
    get customDomain(): string | null { return this.props.customDomain; }
    get paymentMethod(): PaymentMethod { return this.props.paymentMethod; }
    get totalAmount(): number { return this.props.totalAmount; }
    get status(): SubscriptionCheckoutStatus { return this.props.status; }
    get studioId(): string | null { return this.props.studioId; }
    get subscriberUserId(): string | null { return this.props.subscriberUserId; }
    get paymentReference(): string | null { return this.props.paymentReference; }
    get createdAt(): Date { return this.props.createdAt; }
    get updatedAt(): Date { return this.props.updatedAt; }

    approve(studioId: string, subscriberUserId: string, paymentReference?: string): void {
        this.props.studioId = studioId;
        this.props.subscriberUserId = subscriberUserId;
        this.props.paymentReference = paymentReference ?? null;
        this.props.status = 'APPROVED';
        this.props.updatedAt = new Date();
    }

    static create(
        props: Omit<SubscriptionCheckoutSessionProps, 'createdAt' | 'updatedAt'> & {
            createdAt?: Date;
            updatedAt?: Date;
        },
        id?: UniqueEntityID,
    ): SubscriptionCheckoutSession {
        return new SubscriptionCheckoutSession(
            {
                ...props,
                paymentReference: props.paymentReference ?? null,
                createdAt: props.createdAt ?? new Date(),
                updatedAt: props.updatedAt ?? new Date(),
            },
            id,
        );
    }
}
