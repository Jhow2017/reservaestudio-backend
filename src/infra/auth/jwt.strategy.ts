import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { jwtConstants } from './constants';
import { UsersRepository } from '../../domain/auth/application/repositories/users-repository';
import { BlacklistedTokensRepository } from '../../domain/auth/application/repositories/blacklisted-tokens-repository';
import { User } from '../../domain/auth/enterprise/entities/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private usersRepository: UsersRepository,
        private blacklistedTokensRepository: BlacklistedTokensRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
            passReqToCallback: true, // Permite passar o request para o validate
        });
    }

    async validate(
        request: Request,
        payload: { sub: string },
    ): Promise<User> {
        // Extrai o token da requisição
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

        // Verifica se o token está na blacklist
        if (token && (await this.blacklistedTokensRepository.exists(token))) {
            throw new UnauthorizedException('Token invalidado');
        }

        const user = await this.usersRepository.findById(payload.sub);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}