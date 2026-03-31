import { Inject } from '@nestjs/common';
import { Client } from '../../enterprise/entities/client';
import { ClientsRepository } from '../repositories/clients-repository';
import { StudiosRepository } from '../repositories/studios-repository';
import { StudioNotFoundError } from './list-public-rooms';
import { Role } from '../../../auth/enterprise/value-objects/role';
import { ensureStudioAdminAccess } from './studio-admin-access';

export interface ListStudioClientsRequest {
    studioSlug: string;
    requesterUserId: string;
    requesterRole: Role;
}

export interface ListStudioClientsResponse {
    clients: Client[];
}

export class ListStudioClientsUseCase {
    constructor(
        @Inject(StudiosRepository)
        private studiosRepository: StudiosRepository,
        @Inject(ClientsRepository)
        private clientsRepository: ClientsRepository,
    ) { }

    async execute({ studioSlug, requesterUserId, requesterRole }: ListStudioClientsRequest): Promise<ListStudioClientsResponse> {
        const studio = await this.studiosRepository.findBySlug(studioSlug);

        if (!studio) {
            throw new StudioNotFoundError();
        }
        ensureStudioAdminAccess(studio, requesterRole, requesterUserId);

        const clients = await this.clientsRepository.findByStudioId(studio.id.toString());

        return { clients };
    }
}
