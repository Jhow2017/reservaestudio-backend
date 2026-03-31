import { Entity } from '../../../../core/entities/entity';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';

export interface AuditLogProps {
    userId: string | null;
    action: string;
    entityType: string | null;
    entityId: string | null;
    metadata: Record<string, any> | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
}

export class AuditLog extends Entity<AuditLogProps> {
    get userId(): string | null {
        return this.props.userId;
    }

    get action(): string {
        return this.props.action;
    }

    get entityType(): string | null {
        return this.props.entityType;
    }

    get entityId(): string | null {
        return this.props.entityId;
    }

    get metadata(): Record<string, any> | null {
        return this.props.metadata;
    }

    get ipAddress(): string | null {
        return this.props.ipAddress;
    }

    get userAgent(): string | null {
        return this.props.userAgent;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    static create(
        props: Omit<AuditLogProps, 'createdAt'>,
        id?: UniqueEntityID,
    ): AuditLog {
        return new AuditLog(
            {
                ...props,
                createdAt: new Date(),
            },
            id,
        );
    }
}