import { Inject } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { HashComparer } from '../cryptography/hash-comparer';
import { HashGenerator } from '../cryptography/hash-generator';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { UseCaseError } from '../../../../core/errors/use-case-error';

export interface ChangePasswordRequest {
    userId: string;
    currentPassword: string;
    newPassword: string;
}

export interface ChangePasswordResponse {
    success: boolean;
}

export class WrongCurrentPasswordError extends UseCaseError {
    constructor() {
        super('Current password is incorrect');
    }
}

export class ChangePasswordUseCase {
    constructor(
        @Inject(UsersRepository) private usersRepository: UsersRepository,
        @Inject(HashComparer) private hashComparer: HashComparer,
        @Inject(HashGenerator) private hashGenerator: HashGenerator,
    ) { }

    async execute({
        userId,
        currentPassword,
        newPassword,
    }: ChangePasswordRequest): Promise<ChangePasswordResponse> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError('User');
        }

        const isCurrentPasswordValid = await this.hashComparer.compare(
            currentPassword,
            user.password,
        );

        if (!isCurrentPasswordValid) {
            throw new WrongCurrentPasswordError();
        }

        const hashedNewPassword = await this.hashGenerator.hash(newPassword);

        user.setPassword(hashedNewPassword);
        await this.usersRepository.save(user);

        return {
            success: true,
        };
    }
}