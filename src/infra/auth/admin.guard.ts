import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { User } from '../../domain/auth/enterprise/entities/user';
import { Role } from '../../domain/auth/enterprise/value-objects/role';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        if (user.role !== Role.ADMIN) {
            throw new ForbiddenException('Only administrators can access this resource');
        }

        return true;
    }
}