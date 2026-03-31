import { AuditLog } from '../../enterprise/entities/audit-log';

export abstract class AuditLogsRepository {
    abstract create(auditLog: AuditLog): Promise<void>;
    abstract findByUserId(userId: string): Promise<AuditLog[]>;
    abstract findByAction(action: string): Promise<AuditLog[]>;
    abstract findAll(): Promise<AuditLog[]>;
}