import { Inject } from '@nestjs/common';
import { User } from '../../enterprise/entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { HashComparer } from '../cryptography/hash-comparer';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { UseCaseError } from '../../../../core/errors/use-case-error';

export interface AuthenticateUserRequest {
    email: string;
    password: string;
}

export interface AuthenticateUserResponse {
    user: User;
}

export class WrongCredentialsError extends UseCaseError {
    constructor() {
        super('Email or password is incorrect');
    }
}

export class AuthenticateUserUseCase {
    constructor(
        @Inject(UsersRepository)
        private usersRepository: UsersRepository,
        @Inject(HashComparer)
        private hashComparer: HashComparer,
    ) {}

    async execute({
        email,
        password,
    }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
        const user = await this.usersRepository.findByEmail(email);

        // Por segurança, sempre retorna a mesma mensagem genérica
        // Não revela se o email existe ou se a senha está errada
        if (!user) {
            throw new WrongCredentialsError();
        }

        const isPasswordValid = await this.hashComparer.compare(
            password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new WrongCredentialsError();
        }

        return {
            user,
        };
    }
}