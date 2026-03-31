import { UseCaseError } from '../use-case-error';

export class ResourceNotFoundError extends UseCaseError {
    constructor(resource: string) {
        super(`${resource} not found`);
    }
}