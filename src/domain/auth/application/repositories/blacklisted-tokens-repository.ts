export abstract class BlacklistedTokensRepository {
    abstract add(token: string, expiresAt: Date): Promise<void>;
    abstract exists(token: string): Promise<boolean>;
}