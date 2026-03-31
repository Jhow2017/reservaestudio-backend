import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { jwtConstants } from '../auth/constants';
import { Encrypter } from '../../domain/auth/application/cryptography/encrypter';

@Injectable()
export class JwtEncrypter implements Encrypter {
    async encrypt(payload: Record<string, unknown>): Promise<string> {
        return sign(payload, jwtConstants.secret, {
            expiresIn: '7d',
        });
    }

    async decrypt(token: string): Promise<Record<string, unknown>> {
        return verify(token, jwtConstants.secret) as Record<string, unknown>;
    }
}