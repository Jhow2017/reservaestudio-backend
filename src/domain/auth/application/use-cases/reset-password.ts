import { Inject } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { Encrypter } from '../cryptography/encrypter';
import { UseCaseError } from '../../../../core/errors/use-case-error';

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    userId: string;
}

export class InvalidResetTokenError extends UseCaseError {
    constructor() {
        super('Invalid or expired reset token');
    }
}

export class ResetPasswordUseCase {
    constructor(
        @Inject(UsersRepository) private usersRepository: UsersRepository,
        @Inject(HashGenerator) private hashGenerator: HashGenerator,
        @Inject(Encrypter) private encrypter: Encrypter,
    ) { }

    async execute({
        token,
        newPassword,
    }: ResetPasswordRequest): Promise<ResetPasswordResponse> {
        // Decodifica e valida o token
        let payload: { sub: string; type?: string };
        try {
            payload = (await this.encrypter.decrypt(token)) as {
                sub: string;
                type?: string;
            };
        } catch {
            throw new InvalidResetTokenError();
        }

        // Verifica se é um token de reset de senha
        if (payload.type !== 'reset-password') {
            throw new InvalidResetTokenError();
        }

        const userId = payload.sub;
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new InvalidResetTokenError();
        }

        // Verifica se o token salvo no banco corresponde e se não expirou
        if (
            !user.resetPasswordToken ||
            user.resetPasswordToken !== token ||
            !user.resetPasswordExpires ||
            user.resetPasswordExpires < new Date()
        ) {
            throw new InvalidResetTokenError();
        }

        // Hash da nova senha
        const hashedPassword = await this.hashGenerator.hash(newPassword);

        // Atualiza a senha e limpa o token de reset
        user.setPassword(hashedPassword);
        user.setResetPasswordToken(null, null);
        await this.usersRepository.save(user);

        return {
            success: true,
            userId: user.id.toString(),
        };
    }
}