import { AuditLog } from '../../../../domain/auth/enterprise/entities/audit-log';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import { AuditLog as PrismaAuditLog } from '@prisma/client';

export class PrismaAuditLogMapper {
    static toDomain(raw: PrismaAuditLog): AuditLog {
        return AuditLog.create(
            {
                userId: raw.userId,
                action: raw.action,
                entityType: raw.entityType,
                entityId: raw.entityId,
                metadata: raw.metadata as Record<string, any> | null,
                ipAddress: raw.ipAddress,
                userAgent: raw.userAgent,
            },
            new UniqueEntityID(raw.id),
        );
    }

    static toPrisma(auditLog: AuditLog): PrismaAuditLog {
        return {
            id: auditLog.id.toString(),
            userId: auditLog.userId,
            action: auditLog.action,
            entityType: auditLog.entityType,
            entityId: auditLog.entityId,
            metadata: auditLog.metadata as any,
            ipAddress: auditLog.ipAddress,
            userAgent: auditLog.userAgent,
            createdAt: auditLog.createdAt,
        };
    }
}