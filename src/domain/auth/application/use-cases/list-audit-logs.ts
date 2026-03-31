import { Inject } from '@nestjs/common';
import { AuditLogsRepository } from '../repositories/audit-logs-repository';
import { AuditLog } from '../../enterprise/entities/audit-log';

export interface ListAuditLogsRequest {
    userId?: string;
    action?: string;
}

export interface ListAuditLogsResponse {
    auditLogs: AuditLog[];
}

export class ListAuditLogsUseCase {
    constructor(
        @Inject(AuditLogsRepository)
        private auditLogsRepository: AuditLogsRepository,
    ) {}

    async execute(
        request?: ListAuditLogsRequest,
    ): Promise<ListAuditLogsResponse> {
        let auditLogs: AuditLog[];

        if (request?.userId) {
            auditLogs = await this.auditLogsRepository.findByUserId(
                request.userId,
            );
        } else if (request?.action) {
            auditLogs = await this.auditLogsRepository.findByAction(
                request.action,
            );
        } else {
            auditLogs = await this.auditLogsRepository.findAll();
        }

        return {
            auditLogs,
        };
    }
}

