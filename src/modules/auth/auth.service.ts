import { Injectable } from '@nestjs/common';
import { pick } from 'lodash'
import { User } from '../users'
import { IFUser } from '../users/interface'
import { LoginDto } from './dto/dto'
import { Post, Res, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';



@Injectable()
export class AuthService {

    async login({ email, password }: LoginDto, res: Response) {
        let user:IFUser = await User.findOne({email})
        if(!user) throw new HttpException({ error_code: "01",error_message: "Invalid email or password"},400)

        let InvalidPassword = await user.comparePassword(password)
        if(!InvalidPassword) throw new HttpException({ error_code: "01",error_message: "Invalid email or password"},400)
        
        const response = pick(user,['_id', 'email', 'admin', 'fullname', 'phone_number', 'address', 'gender'])
        const token = user.generateToken()

        return res.header('x-auth-token', token).send(response)
    }
}
