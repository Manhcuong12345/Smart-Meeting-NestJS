import { Controller,Post,Put,Get,Body, HttpCode } from '@nestjs/common';
import {RegisterService} from './register.service'
import {RegisterDto} from './dto/dto'
import {ApiCreatedResponse} from '@nestjs/swagger'

@Controller('register')
export class RegisterController {
    
    constructor(private readonly registerServ: RegisterService){}

    @Post('/')
    //dinh dang thong bao
    @ApiCreatedResponse({description: 'User Register'})
    @HttpCode(200)
    async register(@Body() userData:RegisterDto){
        return this.registerServ.register(userData)
    }
}
