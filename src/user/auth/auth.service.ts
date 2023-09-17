import * as bcryptjs from 'bcryptjs';
import { UserType } from '@prisma/client'
import { Injectable, ConflictException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

interface SignupParams {
    email: string;
    password: string;
    name: string;
    phone: string;
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

        const hash_password = await bcryptjs.hash(password, 10);

        const user = await this.prismaService.user.create({
            data: {
                email,
                name,
                phone,
                password: hash_password,
                user_type: UserType.BUYER,
            },
        });

        return user;
    }
}
