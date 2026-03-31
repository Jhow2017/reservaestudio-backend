export abstract class ResetPasswordTokenGenerator {
    abstract generate(userId: string): Promise<string>;
}