import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { HashGenerator } from '../../domain/auth/application/cryptography/hash-generator';
import { HashComparer } from '../../domain/auth/application/cryptography/hash-comparer';

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
    private readonly HASH_SALT_ROUNDS = 8;

    async hash(plain: string): Promise<string> {
        return hash(plain, this.HASH_SALT_ROUNDS);
    }

    async compare(plain: string, hash: string): Promise<boolean> {
        return compare(plain, hash);
    }
}