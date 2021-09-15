import { Controller, Res, Req, Get, Post, Put, Delete, HttpException, NotFoundException,UseGuards, Body, Query,Param,HttpCode } from '@nestjs/common';
import { Room } from './model'
import { IFRoom } from './interface'
import { RoomsService } from './rooms.service'
import {RoomDto} from './dto/dto'
import {RolesGuard} from '../roles'

@Controller('rooms')
export class RoomsController {

    constructor(private roomsService: RoomsService){}

    @Post('/')
    @HttpCode(200)
    @UseGuards(new RolesGuard('Room','admin'))
    async createRoom(@Body() RoomData:RoomDto){
        return this.roomsService.create(RoomData)
    }

    @Get('/')
    async getAllRoom(@Query() query:{page?:number, limit?: number, search_string?: string}){
        return this.roomsService.getAll(query)
    }

    @Get('/:id')
    async getByIdRoom(@Param('id') id:string){
        return this.roomsService.GetById(id)
    }

    @Put('/:id')
    @UseGuards(new RolesGuard('User','admin'))
    async updateRoom(@Param('id') id:string,@Body() RoomData:RoomDto){
        return this.roomsService.update(id, RoomData)
    }

    @Delete('/:id')
    @UseGuards(new RolesGuard('User','admin'))
    async deleteRoom(@Param('id') id:string){
        return this.roomsService.delete(id)
    }
}
