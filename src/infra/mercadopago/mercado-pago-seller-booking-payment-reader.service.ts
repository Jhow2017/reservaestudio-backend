import { Injectable } from '@nestjs/common';
import { MercadoPagoSellerBookingPaymentReader } from '../../domain/booking/application/services/mercado-pago-seller-booking-payment-reader';
import { MercadoPagoBookingPaymentService } from './mercado-pago-booking-payment.service';

@Injectable()
export class MercadoPagoSellerBookingPaymentReaderService extends MercadoPagoSellerBookingPaymentReader {
    constructor(private readonly bookingPayment: MercadoPagoBookingPaymentService) {
        super();
    }

    async getPayment(sellerAccessToken: string, paymentId: string): Promise<Record<string, unknown>> {
        return this.bookingPayment.getPayment(sellerAccessToken, paymentId);
    }
}
