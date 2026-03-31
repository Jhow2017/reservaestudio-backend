export interface AuditLogData {
    userId?: string | null;
    action: string;
    entityType?: string | null;
    entityId?: string | null;
    metadata?: Record<string, any> | null;
    ipAddress?: string | null;
    userAgent?: string | null;
}

export abstract class AuditLogger {
    abstract log(data: AuditLogData): Promise<void>;
}