export abstract class MercadoPagoSellerBookingPaymentReader {
    abstract getPayment(sellerAccessToken: string, paymentId: string): Promise<Record<string, unknown>>;
}
