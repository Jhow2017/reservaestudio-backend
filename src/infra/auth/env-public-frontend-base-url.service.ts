import { Injectable } from '@nestjs/common';
import { PublicFrontendBaseUrl } from '../../domain/auth/application/services/public-frontend-base-url';

@Injectable()
export class EnvPublicFrontendBaseUrlService extends PublicFrontendBaseUrl {
    get(): string {
        return (process.env.FRONTEND_URL ?? 'http://localhost:3000').replace(/\/$/, '');
    }
}
