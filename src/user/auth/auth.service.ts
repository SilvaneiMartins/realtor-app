import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UserType } from '@prisma/client'
import { Injectable, ConflictException, HttpException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

interface SignupParams {
    email: string;
    password: string;
    name: string;
    phone: string;
}

interface SigninParams {
    email: string;
    password: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async signup({ email, password, name, phone }: SignupParams) {
        const user_exists = await this.prismaService.user.findUnique({
            where: { email },
        })

        if (user_exists) {
            throw new ConflictException();
        }

        const hash_password = await bcrypt.hash(password, 10);

        const user = await this.prismaService.user.create({
            data: {
                email,
                name,
                phone,
                password: hash_password,
                user_type: UserType.BUYER,
            },
        });

        const token = this.generateJWT(user.name, user.id);

        return {
            user,
            token,
        };
    }

    async signin({ email, password }: SigninParams) {
        const user = await this.prismaService.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new HttpException("Credenciais inválidas", 400);
        }

        const hashedPassword = user.password;
        const isValidPassword = await bcrypt.compare(password, hashedPassword);

        if (!isValidPassword) {
            throw new HttpException("Credenciais inválidas", 400);
        }

        const token = this.generateJWT(user.name, user.id);

        return {
            user,
            token,
        };
    }

    private generateJWT(name: string, id: number) {
        return jwt.sign({
            name,
            id,
        }, process.env.JSON_TOKEN_KEY, {
            expiresIn: 3600000,
        });
    }
}
