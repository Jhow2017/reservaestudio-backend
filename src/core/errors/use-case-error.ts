export abstract class UseCaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}