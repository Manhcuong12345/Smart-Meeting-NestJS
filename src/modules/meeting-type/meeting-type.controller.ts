import { Controller,Param,Get,Query, Res, Put } from '@nestjs/common';
import {MeetingTypeService } from './meeting-type.service'

@Controller('meeting-type')
export class MeetingTypeController {
    constructor(private readonly MeetingTypeSer:MeetingTypeService){}

    @Get('/')
    async getAll(@Res() res,@Query() query:{page?:number, limit?: number}){
        return this.MeetingTypeSer.findAll(query)
    }

    @Put('/:id')
    async getById(@Param('id') id: string){
        return this.MeetingTypeSer.getByID(id)
    }
}
