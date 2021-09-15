import { Injectable,Inject,forwardRef } from '@nestjs/common';
import { RoomsRepository } from './rooms.repository';
import { RoomDto } from './dto/dto'
import {Room} from './model'
import {IFRoom} from './interface'
import {CestronService} from '../cestron'


@Injectable()
export class RoomsService {

    constructor(private readonly RoomRepo: RoomsRepository,
        @Inject(forwardRef(() => CestronService))
        private readonly cestronService: CestronService) {
            this.RoomRepo.attach(this.cestronService)
        }

    async create(RoomData:RoomDto){
        return this.RoomRepo.create(RoomData)
    }

    async getAll({page,limit,search_string}:{ page?: number, limit?: number, search_string?: string}){
        let filter:any = {}

        if(!page || page < 0){
            page = 1
        }

        if(!limit){
            limit = 20
        }

        if(search_string){
            filter.$or = [
                {name:{$regex:new RegExp(["",search_string,""].join(""),"i")}},
                {area:{$regex:new RegExp(["",search_string,""].join(""),"i")}}
            ]
        }

        return this.RoomRepo.findAllAndPagging({
            page,
            limit,
            sort:{created_time:-1}
        },filter)
    }

    async update(id:string,RoomData:RoomDto) {
          return this.RoomRepo.updateById(id,RoomData,{new:true})
    }

    async GetById(id:string){
        return this.RoomRepo.getById(id)
    }

    async delete(id:string){
        return this.RoomRepo.deleteById(id)
    }
}
