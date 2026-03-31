import { Injectable, Inject } from '@nestjs/common';
import { AuditLogsRepository } from '../../domain/auth/application/repositories/audit-logs-repository';
import { AuditLogData, AuditLogger } from '../../domain/auth/application/services/audit-logger';
import { AuditLog } from '../../domain/auth/enterprise/entities/audit-log';


@Injectable()
export class AuditLoggerService implements AuditLogger {
    constructor(
        @Inject(AuditLogsRepository)
        private auditLogsRepository: AuditLogsRepository,
    ) { }

    async log(data: AuditLogData): Promise<void> {
        const auditLog = AuditLog.create({
            userId: data.userId ?? null,
            action: data.action,
            entityType: data.entityType ?? null,
            entityId: data.entityId ?? null,
            metadata: data.metadata ?? null,
            ipAddress: data.ipAddress ?? null,
            userAgent: data.userAgent ?? null,
        });

        await this.auditLogsRepository.create(auditLog);
    }
}