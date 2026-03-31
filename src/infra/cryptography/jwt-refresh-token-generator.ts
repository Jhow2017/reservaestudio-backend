import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { RefreshTokenGenerator } from '../../domain/auth/application/cryptography/refresh-token-generator';
import { jwtConstants } from '../auth/constants';

@Injectable()
export class JwtRefreshTokenGenerator implements RefreshTokenGenerator {
    async generate(userId: string): Promise<string> {
        return sign({ sub: userId }, jwtConstants.secret, {
            expiresIn: '30d',
        });
    }
}