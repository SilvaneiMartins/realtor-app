import {
    Post,
    Body,
    Controller,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post("/signup")
    signup(@Body() body: SignupDto) {
        return this.authService.signup(body);
    }

    @Post("/signin")
    signin(@Body() body: SigninDto) {
        return this.authService.signin(body);
    }
}
