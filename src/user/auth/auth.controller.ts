import {
    Post,
    Body,
    Param,
    Controller,
    ParseEnumPipe,
    UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserType } from '@prisma/client';

import { AuthService } from './auth.service';
import { GenerateProductKeyDto, SigninDto, SignupDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post("/signup/:userType")
    async signup(
        @Body() body: SignupDto,
        @Param("userType", new ParseEnumPipe(UserType)) userType: UserType
    ) {
        if (userType !== UserType.BUYER) {
            if (!body.productKey) {
                throw new UnauthorizedException();
            }

            const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

            const isValidProductKey = await bcrypt.compare(validProductKey, body.productKey);

            if (!isValidProductKey) {
                throw new UnauthorizedException();
            }
        }
        return this.authService.signup(body);
    }

    @Post("/signin")
    signin(@Body() body: SigninDto) {
        return this.authService.signin(body);
    }

    @Post("/key")
    generateProductKey(@Body() { email, useType }: GenerateProductKeyDto) {
        return this.authService.generateProductKey(email, useType);
    }
}
