import { Injectable } from '@nestjs/common';
import {IFMeetingType} from './interface'
import {MeetingType} from './model'
import {MeetingTypeReponsitory} from './meeting-type.reponsitory'

@Injectable()
export class MeetingTypeService {

    constructor(private readonly MeetingTypeRepo:MeetingTypeReponsitory){}

    async findAll({page,limit}:{ page?: number, limit?: number}){
        let filter:any = {}
        if(!page || page <= 0){
            page = 1
        }
        if(!limit){
            limit = 20
        }

        return this.MeetingTypeRepo.findAllAndPagging({
            page:page,
            limit:limit,
            sort:({created_time:-1})
        },filter)
    }

    async getByID(id:string){
        return this.MeetingTypeRepo.getById(id)
    }
}
