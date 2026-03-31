import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [PassportModule, DatabaseModule],
    providers: [JwtStrategy],
    exports: [PassportModule],
})
export class AuthModule { }