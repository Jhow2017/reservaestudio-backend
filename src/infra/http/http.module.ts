import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthModule } from '../auth/auth.module';
import { MessagingModule } from '../messaging/messaging.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RegisterUserController } from './controllers/register-user.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { GetProfileController } from './controllers/get-profile.controller';
import { RefreshTokenController } from './controllers/refresh-token.controller';
import { RegisterUserUseCase } from '../../domain/auth/application/use-cases/register-user';
import { AuthenticateUserUseCase } from '../../domain/auth/application/use-cases/authenticate-user';
import { RefreshTokenUseCase } from '../../domain/auth/application/use-cases/refresh-token';
import { ChangePasswordController } from './controllers/change-password.controller';
import { ChangePasswordUseCase } from '../../domain/auth/application/use-cases/change-password';
import { ForgotPasswordController } from './controllers/forgot-password.controller';
import { ResetPasswordController } from './controllers/reset-password.controller';
import { ForgotPasswordUseCase } from '../../domain/auth/application/use-cases/forgot-password';
import { ResetPasswordUseCase } from '../../domain/auth/application/use-cases/reset-password';
import { LogoutController } from './controllers/logout.controller';
import { LogoutUseCase } from '../../domain/auth/application/use-cases/logout';
import { ListUsersController } from './controllers/list-users.controller';
import { ListUsersUseCase } from '../../domain/auth/application/use-cases/list-users';
import { ListAuditLogsController } from './controllers/list-audit-logs.controller';
import { ListAuditLogsUseCase } from '../../domain/auth/application/use-cases/list-audit-logs';
import { AuditLogger } from '../../domain/auth/application/services/audit-logger';
import { AuditLoggerService } from '../../infra/services/audit-logger.service';

@Module({
    imports: [DatabaseModule, CryptographyModule, AuthModule, MessagingModule],
    controllers: [
        RegisterUserController,
        AuthenticateController,
        GetProfileController,
        RefreshTokenController,
        ChangePasswordController,
        ForgotPasswordController,
        ResetPasswordController,
        LogoutController,
        ListUsersController,
        ListAuditLogsController,
    ],
    providers: [
        RegisterUserUseCase,
        AuthenticateUserUseCase,
        RefreshTokenUseCase,
        ChangePasswordUseCase,
        ForgotPasswordUseCase,
        ResetPasswordUseCase,
        LogoutUseCase,
        ListUsersUseCase,
        ListAuditLogsUseCase,
        {
            provide: AuditLogger,
            useClass: AuditLoggerService,
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class HttpModule { }