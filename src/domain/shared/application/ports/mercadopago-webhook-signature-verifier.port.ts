export abstract class MercadoPagoWebhookSignatureVerifierPort {
    abstract isValid(rawBodyForSigning: string, signatureHeader: string | undefined): boolean;
}
