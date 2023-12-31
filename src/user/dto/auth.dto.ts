import {
    IsEnum,
    IsEmail,
    Matches,
    IsString,
    MinLength,
    IsNotEmpty,
    IsOptional,
} from "class-validator"
import { UserType } from "@prisma/client"

export class SignupDto {
    @IsString({
        message: "Por favor digite um nome de usuário válido!",
    })
    @IsNotEmpty({
        message: "Nome não pode ficar vazio!",
    })
    name: string

    @Matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/, {
        message: "Por favor digite um número de telefone válido!",
    })
    phone: string

    @IsEmail({
        allow_display_name: true,
        allow_utf8_local_part: false,
        require_tld: true,
    })
    email: string

    @IsString({
        message: "Senha obrigatório!",
    })
    @MinLength(6, {
        message: "A senha deve ter pelo menos 6 caracteres!",
    })
    password: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    productKey?: string;
}

export class SigninDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class GenerateProductKeyDto {
    @IsEmail()
    email: string;

    @IsEnum(UserType)
    useType: UserType;
}
