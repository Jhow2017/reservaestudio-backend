import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { ResetPasswordTokenGenerator } from '../../domain/auth/application/cryptography/reset-password-token-generator';
import { jwtConstants } from '../auth/constants';

@Injectable()
export class JwtResetPasswordTokenGenerator implements ResetPasswordTokenGenerator {
    async generate(userId: string): Promise<string> {
        return sign({ sub: userId, type: 'reset-password' }, jwtConstants.secret, {
            expiresIn: '1h',
        });
    }
}