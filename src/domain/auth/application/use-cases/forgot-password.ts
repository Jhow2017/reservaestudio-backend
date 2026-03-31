import { Inject } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { ResetPasswordTokenGenerator } from '../cryptography/reset-password-token-generator';
import { EmailSender } from '../messaging/email-sender';

export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export class ForgotPasswordUseCase {
    constructor(
        @Inject(UsersRepository) private usersRepository: UsersRepository,
        @Inject(ResetPasswordTokenGenerator)
        private resetPasswordTokenGenerator: ResetPasswordTokenGenerator,
        @Inject(EmailSender) private emailSender: EmailSender,
    ) { }

    async execute({
        email,
    }: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            // Por segurança, não revelamos se o email existe ou não
            return {
                message: 'If this email exists, a password reset link has been sent.',
            };
        }

        const resetToken = await this.resetPasswordTokenGenerator.generate(
            user.id.toString(),
        );

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // Expira em 1 hora

        user.setResetPasswordToken(resetToken, expiresAt);
        await this.usersRepository.save(user);

        // Envia email com o token de recuperação
        await this.emailSender.sendResetPasswordEmail(
            user.email,
            user.name,
            resetToken,
        );

        return {
            message: 'If this email exists, a password reset link has been sent.',
        };
    }
}