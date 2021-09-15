import { Injectable,HttpException } from '@nestjs/common';
import {IFResponse, ResponseRepository} from '../response'
import {IFMeetingType} from './interface'
import {MeetingType} from './model'
import {AbstractSubject} from '../observer'

@Injectable()
export class MeetingTypeReponsitory{

    constructor(private responseRepo:ResponseRepository){}

    async findAllAndPagging({page,limit,sort }: { page: number, limit: number, sort?: any},filter?:any)
    :Promise<IFResponse<IFMeetingType>>{
       let skip: number = 0
       skip = (page-1) * limit
       
       const meeting_type = await MeetingType.find(filter)
       .limit(+limit)
       .skip(skip)
       .sort(sort)
       const totalRecords:number =await MeetingType.countDocuments(filter)

       return this.responseRepo.getResponse(meeting_type,totalRecords,page,limit)

    }

    //lay get all
    async getAll(filter?:any):Promise<IFMeetingType[]> {
         const meeting_type = await MeetingType.find(filter)
         return meeting_type
    }

    async getById(id:string):Promise<IFMeetingType>{
        try{
           const meeting_type = await MeetingType.findById(id)
           if(!meeting_type) throw new HttpException({ error_code: '401', error_message: 'MeetingType not found' }, 401)
           return meeting_type
        }catch(error) {
            throw new HttpException({ error_code:'401', error_message: 'Meeting_type not found'},401)
        }
    }
}
