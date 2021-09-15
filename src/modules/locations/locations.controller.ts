import { Controller, Get, Post, Put, Res, Req, HttpException, Param, Body, Query, HttpStatus, UseGuards, HttpCode, Delete } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { IFLocation } from './interface';
import { LocationDto } from './dto/dto'
import { RolesGuard } from '../roles'


@Controller('locations')
export class LocationsController {

    constructor(private readonly locationService: LocationsService) { }

    @Post('/')
    @HttpCode(200)
    @UseGuards(new RolesGuard('Location', 'admin'))
    async createLocation(@Body() LocationData: LocationDto) {
        return this.locationService.create(LocationData)
    }

    @Get('/')
    async GetAllLocation(@Query() query:{filter?:any}) {
        return this.locationService.findAll(query)
    }

    @Get('/:id')
    async GetByIdLocation(@Param('id') id: string) {
        return this.locationService.findById(id)
    }

    @Put('/:id')
    @UseGuards(new RolesGuard('Location', 'admin'))
    async updateLocation(@Param('id') id: string, @Body() LocationData: LocationDto) {
        return this.locationService.update(id, LocationData)
    }

    @Delete('/:id')
    @UseGuards(new RolesGuard('Location', 'admin'))
    async deleteLocation(@Param('id') id: string) {
        return this.locationService.delete(id)
    }
}
