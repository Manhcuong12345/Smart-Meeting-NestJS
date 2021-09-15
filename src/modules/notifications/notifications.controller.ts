import { Controller,Get,Req,Res,Query } from '@nestjs/common';
import {NotificationsService } from './notifications.service'

@Controller('notifications')
export class NotificationsController {
   
    constructor(private readonly notificationService: NotificationsService){}

    @Get('/')
    async getAll(@Query() query:{page?:number, limit?: number},@Req() req){
    return this.notificationService.getAll(query, req.user._id)
    }
}
