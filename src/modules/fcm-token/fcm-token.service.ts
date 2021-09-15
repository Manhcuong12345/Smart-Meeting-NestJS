import { Injectable } from '@nestjs/common';
import {UserRepository} from '../users'
import {FcmTokenDto} from './dto/dto'

@Injectable()
export class FcmTokenService {

    constructor(private readonly userRepo:UserRepository){}

    //Tao tokens push fcm_token
    async create(id:string,fcm_token:string){
        const user = await this.userRepo.findById(id)

        // Nếu người dùng đã có mã thông báo này, nó sẽ không được thêm vào
        // Điều này sẽ tiết kiệm không gian lưu trữ trên cơ sở dữ liệu
        if(!user.fcm_token.includes(fcm_token)){
            user.fcm_token.push(fcm_token);
            user.save()
        }
        return user
    }

    //xoa token
    async remove(id:string,fcm_token:string){
        const user = await this.userRepo.findById(id)
        user.fcm_token = user.fcm_token.filter(item => item!== fcm_token)

        return user
    }
}
