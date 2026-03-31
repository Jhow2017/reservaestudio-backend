import { User } from '../../enterprise/entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { RefreshTokenGenerator } from '../cryptography/refresh-token-generator';
import { Encrypter } from '../cryptography/encrypter';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error';
import { UseCaseError } from '../../../../core/errors/use-case-error';
import { Inject } from '@nestjs/common';

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export class InvalidRefreshTokenError extends UseCaseError {
    constructor() {
        super('Invalid refresh token');
    }
}

export class RefreshTokenUseCase {
    constructor(
        @Inject(UsersRepository) private usersRepository: UsersRepository,
        @Inject(RefreshTokenGenerator) private refreshTokenGenerator: RefreshTokenGenerator,
        @Inject(Encrypter) private encrypter: Encrypter,
    ) { }

    async execute({
        refreshToken,
    }: RefreshTokenRequest): Promise<RefreshTokenResponse> {
        // Decodifica o refresh token para pegar o userId
        let payload: { sub: string };
        try {
            payload = (await this.encrypter.decrypt(refreshToken)) as { sub: string };
        } catch {
            throw new InvalidRefreshTokenError();
        }

        // Busca o usuário
        const user = await this.usersRepository.findById(payload.sub);

        if (!user) {
            throw new ResourceNotFoundError('User');
        }

        // Verifica se o refresh token do usuário corresponde ao fornecido
        if (user.refreshToken !== refreshToken) {
            throw new InvalidRefreshTokenError();
        }

        // Gera novo access token
        const accessToken = await this.encrypter.encrypt({
            sub: user.id.toString(),
        });

        // Gera novo refresh token
        const newRefreshToken = await this.refreshTokenGenerator.generate(
            user.id.toString(),
        );

        // Atualiza o refresh token no usuário
        user.setRefreshToken(newRefreshToken);
        await this.usersRepository.save(user);

        return {
            accessToken,
            refreshToken: newRefreshToken,
            user,
        };
    }
}

