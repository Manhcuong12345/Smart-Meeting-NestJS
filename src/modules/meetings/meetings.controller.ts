import { Controller, HttpException,Post,Put,Delete,Get,Res,Req,Query,Body,Param,UseGuards} from '@nestjs/common';
import {MeetingsService} from './meetings.service'
import { IFMeeting } from './interface';
import {MeetingDto} from './dto/dto'
import {Meeting} from './model'

@Controller('meetings')
export class MeetingsController {

    constructor(private readonly meetingService: MeetingsService){}

    @Post('/')
    async create(@Body() MeetingData: MeetingDto,@Req() req){
        return await this.meetingService.create({
            ...MeetingData,
            user_booked: req.user._id
        })
    }

    @Get('/my-meeting')
    async getByMe(@Req() req,@Query() query:{start_time?: number, end_time?: number}) {
       return this.meetingService.getMyMeeting(req.user._id,query)
    }
    
    //Nguoi khong tao duoc phep xem
    @Get('/booked')
    async getBooked(@Req() req,@Query() query:{start_time?: number, end_time?: number}){
        return this.meetingService.getMeetingIBooked(req.user._id,query)
    }
    
    @Get('/room/:id')
    async getByRom(@Param('id') id: string){
        return this.meetingService.getByIdRoom(id)
    }
    
    @Get('/:id')
    async getById(@Param('id') id: string,@Req() req) {
        return this.meetingService.getById(id,{
            userId:req.user._id,
            isAdmin:req.user.admin
        })
    }

    @Put('/:id')
    async update(@Param('id') id: string,@Req() req,@Body() MeetingData:MeetingDto){
        return this.meetingService.updateMeeting(id,MeetingData,{
            userId:req.user._id,
            isAdmin:req.user.admin
        })
    }

    @Delete('/:id')
    async delete(@Param('id') id: string,@Req() req) {
        return this.meetingService.delete(id,{
            userId:req.user._id,
            isAdmin:req.user.admin
        })
    }


}
