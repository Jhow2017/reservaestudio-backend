import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BlacklistedTokensRepository } from '../../../../domain/auth/application/repositories/blacklisted-tokens-repository';

@Injectable()
export class PrismaBlacklistedTokensRepository
    implements BlacklistedTokensRepository {
    constructor(private prisma: PrismaService) { }

    async add(token: string, expiresAt: Date): Promise<void> {
        await this.prisma.blacklistedToken.create({
            data: {
                token,
                expiresAt,
            },
        });
    }

    async exists(token: string): Promise<boolean> {
        const blacklistedToken = await this.prisma.blacklistedToken.findUnique({
            where: {
                token,
            },
        });

        return !!blacklistedToken;
    }
}