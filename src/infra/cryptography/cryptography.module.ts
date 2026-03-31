import { Module } from '@nestjs/common';
import { BcryptHasher } from './bcrypt-hasher';
import { JwtEncrypter } from './jwt-encrypter';
import { HashGenerator } from '../../domain/auth/application/cryptography/hash-generator';
import { HashComparer } from '../../domain/auth/application/cryptography/hash-comparer';
import { Encrypter } from 'src/domain/auth/application/cryptography/encrypter';
import { RefreshTokenGenerator } from 'src/domain/auth/application/cryptography/refresh-token-generator';
import { JwtRefreshTokenGenerator } from './jwt-refresh-token-generator';
import { ResetPasswordTokenGenerator } from '../../domain/auth/application/cryptography/reset-password-token-generator';
import { JwtResetPasswordTokenGenerator } from './jwt-reset-password-token-generator';

@Module({
    providers: [
        {
            provide: HashGenerator,
            useClass: BcryptHasher,
        },
        {
            provide: HashComparer,
            useClass: BcryptHasher,
        },
        {
            provide: Encrypter,
            useClass: JwtEncrypter,
        },
        {
            provide: RefreshTokenGenerator,
            useClass: JwtRefreshTokenGenerator,
        },
        {
            provide: ResetPasswordTokenGenerator,
            useClass: JwtResetPasswordTokenGenerator,
        },
        JwtEncrypter,
    ],
    exports: [HashGenerator, HashComparer, Encrypter, RefreshTokenGenerator, ResetPasswordTokenGenerator, JwtEncrypter],
})
export class CryptographyModule { }