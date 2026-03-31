export abstract class RefreshTokenGenerator {
    abstract generate(userId: string): Promise<string>;
}