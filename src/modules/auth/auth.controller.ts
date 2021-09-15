import { Controller,Post,Put,Get,Body, HttpCode,Res,UsePipes,ValidationPipe } from '@nestjs/common';
import {AuthService} from './auth.service'
import {Response} from 'express'
import {LoginDto} from './dto/dto'
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'

@Controller('login')
export class AuthController {
    constructor(private readonly authService:AuthService){}
    
    @Post('/')
    @ApiOkResponse({description: 'User Login'})
    @ApiUnauthorizedResponse({description: 'Invail email or password'})
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
   async login(@Body() LoginData:LoginDto,@Res() res) {
        return this.authService.login(LoginData,res)
   }
}
