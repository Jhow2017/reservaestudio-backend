import type { MercadoPagoConnectionType } from '../../../auth/enterprise/entities/user';

export type MercadoPagoSellerAccessTokenResult =
    | {
        ok: true;
        accessToken: string;
        publicKey: string;
        connectionType: MercadoPagoConnectionType | null;
    }
    | { ok: false };

export abstract class MercadoPagoSellerAccessTokenResolver {
    abstract resolve(ownerUserId: string): Promise<MercadoPagoSellerAccessTokenResult>;
}
