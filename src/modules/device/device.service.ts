import { Injectable } from '@nestjs/common';
import {DeviceRepository} from './device.reponsitory'
import {IFDevice} from './interface'
import { DeviceDto } from './dto/dto'
import { Device } from './model'
import {IFRoom,RoomsRepository} from '../rooms'
import {Room} from '../rooms'
import { CestronService } from '../cestron';

@Injectable()
export class DeviceService {

    constructor(
        private readonly deviceRepo: DeviceRepository,
        private readonly RoomRepo: RoomsRepository,
        private readonly cestronService: CestronService
        ){
            //dinh kem thong bao
            this.deviceRepo.attach(this.cestronService)
        }
        
        async create(DeviceData:DeviceDto){
           return this.deviceRepo.create(DeviceData)
        }

        async getAll({page,limit,search_string}:{ page?: number, limit?: number, search_string?: string}){
            let filter:any = {}

            if(!page || page <= 0){
                page = 1
            }

            if(!limit) {
                limit = 20
            }

            if(search_string) {
                filter.$or = [
                    {device_name:{$regex:new RegExp(["",search_string,""].join(""),"i")}},
                    {note:{$regex:new RegExp(["",search_string,""].join(""),"i")}}
                ]
            }

            return this.deviceRepo.findAllAndPagging({
                page:page,
                limit:limit,
                sort:{created_time:-1}
            },filter)
        }
    
        //lay phong tu thiet bi
        async getRoomById(id:string,{page,limit}:{ page?: number, limit?: number}){
            // let filter:any = {}

            if(!page || page <= 0){
                page = 1
            }

            if(!limit) {
                limit = 20
            }
             // Get room data from id, then use id of this room to filter results
            const room:IFRoom = await this.RoomRepo.getById(id)

            return this.deviceRepo.findAllAndPagging({
                page:page,
                limit:limit,
                sort:{created_time:-1}
            },{room:room.id})
        }

        async getById(id:string){
            return this.deviceRepo.findById(id)
        }
        
        //Ham xu ly cap nhap value voi du lieu
        async updateValue(id:string,{current_value,is_on}:{ current_value:number,is_on:boolean}){
           const device:IFDevice = await this.deviceRepo.updateValue(id,{current_value,is_on})
           return device
        }

        async update(id:string, DeviceData:DeviceDto){
            return this.deviceRepo.update(id, DeviceData,{new:true})
        }

        async delete(id:string){
            return this.deviceRepo.delete(id)
        }
}
