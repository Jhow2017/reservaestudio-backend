import { UseCaseError } from './use-case-error';

export class MercadoPagoPaymentMissingIdError extends UseCaseError {
    constructor() {
        super('Mercado Pago payment response missing id');
    }
}
