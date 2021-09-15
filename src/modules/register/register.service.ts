import { Injectable,HttpException, NotFoundException,Post, Request,Res} from '@nestjs/common';
import {RegisterDto} from './dto/dto'
import {User} from '../users'

export class RegisterService {
   
   //phan xu ly dang ky tach ra tu users cho de su dung
   async register(UserData:RegisterDto){
       const existedUser = await User.findOne({email:UserData.email}).select({_id:1})
       if(existedUser) throw new HttpException({ error_code: "400", error_message: "Email is already exist" }, 400)

       const user = new User(UserData)
       await user.hashPassword()
       await user.save()

       return user

   }
}
