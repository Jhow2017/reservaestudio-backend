import { Inject } from '@nestjs/common';
import { BlacklistedTokensRepository } from '../repositories/blacklisted-tokens-repository';
import { Encrypter } from '../cryptography/encrypter';

export interface LogoutRequest {
    token: string;
}

export interface LogoutResponse {
    message: string;
}

export class LogoutUseCase {
    constructor(
        @Inject(BlacklistedTokensRepository)
        private blacklistedTokensRepository: BlacklistedTokensRepository,
        @Inject(Encrypter) private encrypter: Encrypter,
    ) { }

    async execute({ token }: LogoutRequest): Promise<LogoutResponse> {
        // Decodifica o token para pegar a data de expiração
        const payload = await this.encrypter.decrypt(token);

        // Extrai a data de expiração do payload (exp vem em segundos)
        const expiresAt = new Date((payload.exp as number) * 1000);

        // Adiciona o token à blacklist
        await this.blacklistedTokensRepository.add(token, expiresAt);

        return {
            message: 'Logout realizado com sucesso',
        };
    }
}