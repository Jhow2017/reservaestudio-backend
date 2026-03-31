import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { AuditLogsRepository } from '../../../../domain/auth/application/repositories/audit-logs-repository';
import { AuditLog } from '../../../../domain/auth/enterprise/entities/audit-log';
import { PrismaAuditLogMapper } from '../mappers/prisma-audit-log-mapper';

@Injectable()
export class PrismaAuditLogsRepository implements AuditLogsRepository {
    constructor(private prisma: PrismaService) { }

    async create(auditLog: AuditLog): Promise<void> {
        const data = PrismaAuditLogMapper.toPrisma(auditLog);

        await this.prisma.auditLog.create({
            data: {
                ...data,
                metadata: data.metadata === null ? Prisma.JsonNull : data.metadata,
            },
        });
    }

    async findByUserId(userId: string): Promise<AuditLog[]> {
        const auditLogs = await this.prisma.auditLog.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return auditLogs.map(PrismaAuditLogMapper.toDomain);
    }

    async findByAction(action: string): Promise<AuditLog[]> {
        const auditLogs = await this.prisma.auditLog.findMany({
            where: {
                action,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return auditLogs.map(PrismaAuditLogMapper.toDomain);
    }

    async findAll(): Promise<AuditLog[]> {
        const auditLogs = await this.prisma.auditLog.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return auditLogs.map(PrismaAuditLogMapper.toDomain);
    }
}