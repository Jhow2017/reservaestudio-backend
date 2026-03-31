import { Inject } from '@nestjs/common';
import { Booking } from '../../enterprise/entities/booking';
import { BookingsRepository } from '../repositories/bookings-repository';
import { StudiosRepository } from '../repositories/studios-repository';
import { StudioNotFoundError } from './list-public-rooms';
import { Role } from '../../../auth/enterprise/value-objects/role';
import { ensureStudioAdminAccess } from './studio-admin-access';

export interface ListStudioBookingsRequest {
    studioSlug: string;
    requesterUserId: string;
    requesterRole: Role;
}

export interface ListStudioBookingsResponse {
    bookings: Booking[];
}

export class ListStudioBookingsUseCase {
    constructor(
        @Inject(StudiosRepository)
        private studiosRepository: StudiosRepository,
        @Inject(BookingsRepository)
        private bookingsRepository: BookingsRepository,
    ) { }

    async execute({ studioSlug, requesterUserId, requesterRole }: ListStudioBookingsRequest): Promise<ListStudioBookingsResponse> {
        const studio = await this.studiosRepository.findBySlug(studioSlug);

        if (!studio) {
            throw new StudioNotFoundError();
        }
        ensureStudioAdminAccess(studio, requesterRole, requesterUserId);

        const bookings = await this.bookingsRepository.findByStudioId(studio.id.toString());

        return { bookings };
    }
}
