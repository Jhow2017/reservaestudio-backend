import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../domain/auth/application/repositories/users-repository';
import {
    MercadoPagoSellerAccessTokenResolver,
    MercadoPagoSellerAccessTokenResult,
} from '../../domain/booking/application/services/mercado-pago-seller-access-token-resolver';
import { MercadoPagoOauthService } from './mercado-pago-oauth.service';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class MercadoPagoSellerAccessTokenResolverService extends MercadoPagoSellerAccessTokenResolver {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly mercadoPagoOauthService: MercadoPagoOauthService,
    ) {
        super();
    }

    async resolve(ownerUserId: string): Promise<MercadoPagoSellerAccessTokenResult> {
        const user = await this.usersRepository.findById(ownerUserId);
        if (!user?.mercadoPagoAccessToken || !user.mercadoPagoPublicKey) {
            return { ok: false };
        }

        if (
            user.mercadoPagoConnectionType === 'OAUTH'
            && user.mercadoPagoRefreshToken
            && user.mercadoPagoTokenExpiresAt
            && user.mercadoPagoTokenExpiresAt.getTime() - Date.now() < SEVEN_DAYS_MS
        ) {
            const refreshed = await this.mercadoPagoOauthService.refreshAccessToken(user.mercadoPagoRefreshToken);
            const expiresInSec = refreshed.expires_in ?? 15_552_000;
            const tokenExpiresAt = new Date(Date.now() + expiresInSec * 1000);
            user.updateMercadoPagoOAuthTokens({
                accessToken: refreshed.access_token,
                refreshToken: refreshed.refresh_token ?? user.mercadoPagoRefreshToken,
                tokenExpiresAt,
            });
            await this.usersRepository.save(user);
            return {
                ok: true,
                accessToken: refreshed.access_token,
                publicKey: user.mercadoPagoPublicKey,
                connectionType: user.mercadoPagoConnectionType,
            };
        }

        return {
            ok: true,
            accessToken: user.mercadoPagoAccessToken,
            publicKey: user.mercadoPagoPublicKey,
            connectionType: user.mercadoPagoConnectionType,
        };
    }
}
