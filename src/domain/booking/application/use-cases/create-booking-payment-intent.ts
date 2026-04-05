import { Inject } from '@nestjs/common';
import { UseCaseError } from '../../../../core/errors/use-case-error';
import { MercadoPagoSellerNotConnectedError } from '../../../auth/application/errors/mercadopago-seller-not-connected.error';
import { BookingPaymentGateway } from '../services/booking-payment-gateway';
import { BookingsRepository } from '../repositories/bookings-repository';
import { StudiosRepository } from '../repositories/studios-repository';
import { MercadoPagoSellerAccessTokenResolver } from '../services/mercado-pago-seller-access-token-resolver';

export interface CreateBookingPaymentIntentRequest {
    studioSlug: string;
    bookingId: string;
}

export type CreateBookingPaymentIntentResponse =
    | {
        provider: 'stripe';
        paymentIntentId: string;
        clientSecret: string;
    }
    | {
        provider: 'mercadopago';
        publicKey: string;
        amountReais: number;
        bookingId: string;
        studioSlug: string;
    };

export class BookingNotFoundForPaymentError extends UseCaseError {
    constructor() {
        super('Booking not found for payment');
    }
}

export class CreateBookingPaymentIntentUseCase {
    constructor(
        @Inject(BookingsRepository)
        private bookingsRepository: BookingsRepository,
        @Inject(StudiosRepository)
        private studiosRepository: StudiosRepository,
        @Inject(MercadoPagoSellerAccessTokenResolver)
        private sellerAccessTokenResolver: MercadoPagoSellerAccessTokenResolver,
        @Inject(BookingPaymentGateway)
        private bookingPaymentGateway: BookingPaymentGateway,
    ) { }

    async execute({ studioSlug, bookingId }: CreateBookingPaymentIntentRequest): Promise<CreateBookingPaymentIntentResponse> {
        const studio = await this.studiosRepository.findBySlug(studioSlug);
        if (!studio) throw new BookingNotFoundForPaymentError();

        const booking = await this.bookingsRepository.findById(bookingId);
        if (!booking) throw new BookingNotFoundForPaymentError();
        if (booking.studioId !== studio.id.toString()) throw new BookingNotFoundForPaymentError();
        if (booking.paymentStatus === 'PAID') throw new BookingNotFoundForPaymentError();

        if (studio.payoutProvider === 'MERCADOPAGO') {
            if (!studio.ownerUserId) {
                throw new MercadoPagoSellerNotConnectedError();
            }
            const tokenResult = await this.sellerAccessTokenResolver.resolve(studio.ownerUserId);
            if (!tokenResult.ok) {
                throw new MercadoPagoSellerNotConnectedError();
            }
            return {
                provider: 'mercadopago',
                publicKey: tokenResult.publicKey,
                amountReais: booking.totalPrice,
                bookingId: booking.id.toString(),
                studioSlug: studio.slug,
            };
        }

        if (!studio.stripeConnectedAccountId || !studio.stripeChargesEnabled || !studio.stripePayoutsEnabled) {
            throw new BookingNotFoundForPaymentError();
        }

        const result = await this.bookingPaymentGateway.createPaymentIntent({
            bookingId: booking.id.toString(),
            amountInCents: Math.round(booking.totalPrice * 100),
            currency: 'brl',
            destinationAccountId: studio.stripeConnectedAccountId,
            applicationFeeAmountInCents: Math.round(booking.totalPrice * 100 * 0.08),
            metadata: {
                bookingId: booking.id.toString(),
                studioId: booking.studioId,
            },
        });

        return {
            provider: 'stripe',
            paymentIntentId: result.paymentIntentId,
            clientSecret: result.clientSecret,
        };
    }
}
