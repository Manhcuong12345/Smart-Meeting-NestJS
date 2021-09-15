import { Controller,HttpException,UseGuards,Get,Post,Delete ,Put,Param,Query,Body, HttpCode} from '@nestjs/common';
import {IFDevice} from './interface'
import {Device} from './model'
import {DeviceDto} from './dto/dto'
import {DeviceService} from './device.service'
import {RolesGuard} from '../roles'
import { UpdateValueDto } from './dto/update-value-dto';
import { query } from 'express';

@Controller('device')
export class DeviceController {

    constructor(private readonly deviceServ:DeviceService){}

    @Post('/')
    @HttpCode(200)
    @UseGuards(new RolesGuard('Device','admin'))
    async createDevice(@Body() DeviceData:DeviceDto){
        return this.deviceServ.create(DeviceData)
    }

    @Get('/')
    async getAllDevice(@Query() query:{page?:number,limit?:number,search_string?: string}){
        return this.deviceServ.getAll(query)
    }
    
    @Get('/:id')
    async getByIdDevice(@Param('id') id: string){
        return this.deviceServ.getById(id)
    }

    @Get('/room/:id')
    async getRoomId(@Param('id') id: string,@Query() query:{page?: number, limit?: number}){
        return this.deviceServ.getRoomById(id,query)
    }

    @Put('/:id')
    @UseGuards(new RolesGuard('Device','admin'))
    async updateDevice(@Param('id') id: string,@Body() DeviceData:DeviceDto){
        return this.deviceServ.update(id, DeviceData)
    }

    @Put('/:id')
    updateDeviceValue(@Param('id') id: string,@Body() UpdateValueData:UpdateValueDto){
       return this.deviceServ.updateValue(id, UpdateValueData)
    }

    @Delete('/:id')
    @UseGuards(new RolesGuard('Device','admin'))
    async deleteDevice(@Param('id') id: string){
        return this.deviceServ.delete(id)
    }

}
