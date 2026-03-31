export abstract class EmailSender {
    abstract sendResetPasswordEmail(
        email: string,
        name: string,
        token: string,
    ): Promise<void>;
}