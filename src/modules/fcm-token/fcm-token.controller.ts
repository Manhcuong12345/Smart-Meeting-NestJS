import { Controller,Get,Post,Delete, HttpCode,Param, Body,Req } from '@nestjs/common';
import { FcmTokenService } from './fcm-token.service';
import {FcmTokenDto} from './dto/dto'

@Controller('fcm-token')
export class FcmTokenController {

    constructor(private fcmTokenService: FcmTokenService){}

    @Post('/')
    @HttpCode(200)
    create(@Param('id') id:string,@Body('') body:FcmTokenDto,@Req() req){
        return this.fcmTokenService.create(req.user._id,body.fcm_token)
    }

    @Delete('/')
    @HttpCode(200)
    remove(@Param('id') id:string,@Body('') body:FcmTokenDto,@Req() req){
        return this.fcmTokenService.remove(req.user._id,body.fcm_token)
    }
}
