import { Inject } from '@nestjs/common';
import { User } from '../../enterprise/entities/user';
import { UsersRepository } from '../repositories/users-repository';

export interface ListUsersResponse {
    users: User[];
}

export class ListUsersUseCase {
    constructor(
        @Inject(UsersRepository)
        private usersRepository: UsersRepository,
    ) { }

    async execute(): Promise<ListUsersResponse> {
        const users = await this.usersRepository.findAll();

        return {
            users,
        };
    }
}