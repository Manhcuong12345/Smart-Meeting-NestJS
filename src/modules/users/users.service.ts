import { Injectable,HttpException,HttpStatus,NotFoundException } from '@nestjs/common';
import {UserRepository} from './users.repository'
import {User} from './model'
import { UserDto } from './dto/dto'


@Injectable()
export class UsersService {

    constructor(private readonly userRepo:UserRepository){}

    //ham xu ly chinh de lay ra toan bo du lieu va tim kiem
    async GetAll({page,limit,search_string}:{page?:number,limit?:number,search_string?:string}){
        let filter:any = {}
        if(!page||page <=0){
            page =1
        }
        if(!limit){
            limit = 20
        }
        if(search_string){
            if(search_string.includes('@')) search_string = search_string.substring(0, search_string.indexOf('@'))
            filter.$text = {$search:search_string}
        }
        //tra ve du lieu ben nay minh da lam phan do
        return this.userRepo.findAllAndPaging({
            page,
            limit,
            sort:{created_time:-1}
        },filter)
    }
    
    //ke thua tu file trc
    async GetById(id:string) {
        return this.userRepo.findById(id)
    }

    //cap nhat du lieu
    async update(id:string,userData:UserDto){
        return this.userRepo.updateById(id,userData,{new:true})
    }

    async changePassword(id:string,password:string,newPassword:string){
       const user = await this.userRepo.findById(id)

       const allow = await user.comparePassword(password)
       if(!allow) throw new HttpException({ error_code:'401', error_message: 'Invail password'},401)

       user.password = newPassword
       await user.hashPassword()
       await user.save()

       return user
    }

    //Xoa du lieu
    async delete(id:string){
        return this.userRepo.deleteById(id)
    }
}
