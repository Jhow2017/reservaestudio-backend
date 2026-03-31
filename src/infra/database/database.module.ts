import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { PrismaBlacklistedTokensRepository } from './prisma/repositories/prisma-blacklisted-tokens-repository';
import { PrismaAuditLogsRepository } from './prisma/repositories/prisma-audit-logs-repository';
import { UsersRepository } from '../../domain/auth/application/repositories/users-repository';
import { BlacklistedTokensRepository } from '../../domain/auth/application/repositories/blacklisted-tokens-repository';
import { AuditLogsRepository } from '../../domain/auth/application/repositories/audit-logs-repository';

@Module({
    providers: [
        PrismaService,
        {
            provide: UsersRepository,
            useClass: PrismaUsersRepository,
        },
        {
            provide: BlacklistedTokensRepository,
            useClass: PrismaBlacklistedTokensRepository,
        },
        {
            provide: AuditLogsRepository,
            useClass: PrismaAuditLogsRepository,
        },
    ],
    exports: [PrismaService, UsersRepository, BlacklistedTokensRepository, AuditLogsRepository],
})
export class DatabaseModule { }