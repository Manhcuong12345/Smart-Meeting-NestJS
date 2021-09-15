import { HttpException, Injectable, NotFoundException } from '@nestjs/common'
import { User } from './model'
import { IFUser } from './interface'
import { UserDto } from './dto/dto'
import { IFResponse, ResponseRepository } from '../response'

@Injectable()
export class UserRepository {

    constructor(private readonly responsRepo: ResponseRepository) { }

    //Tao bien de tra ve cac loai du lieu
    fromEntity(data: any): IFUser {
        return data
    }

    //XU ly tao them du lieu
    async create(UserData: UserDto): Promise<IFUser> {
        const user = new User(UserData)
        await user.save()
        return user
    }

    //xu ly tim toan bo du lieu
    async findAllAndPaging(
        //khai bao du lieu rang buoc
        { page, limit, sort }: { page: number, limit: number, sort?: any },
        filter?: any
        //ke thua IFResponse
    ): Promise<IFResponse<IFUser>> {
        let skip: number = 0
        skip = (page - 1) * limit

        const users: IFUser[] = await User.find(filter)
            .skip(skip)
            .limit(+limit)
            .sort(sort)
            .select('-password')
        const totalRecords: number = await User.countDocuments(filter)
        //tra ve ket qua d lieu de lay
        return this.responsRepo.getResponse<IFUser>(users, totalRecords, page, limit)
    }

    async findAll(filter?: any): Promise<IFUser[]> {
        const users = await User.find(filter)
        return users
    }

    //lay id du lieu dot
    async findById(id: string): Promise<IFUser> {
        try {
            //-password la khi hien ra thong tin user an di password
            const user: IFUser = await User.findById(id)
            if (!user) throw new HttpException({ error_code: "404", error_message: "User not found" }, 404)
            return user
        } catch (error) {
            throw new HttpException({ error_code: "404", error_message: "User not found" }, 404)
        }
    }

    //cap nhap xu ly
    async updateById(
        id: string,
        userData: UserDto,
        //tuy chon giong nhu minh dung new:true de cap nhap lai gia tri
        options: any
    ): Promise<IFUser> {
        try {
            const user = await User.findByIdAndUpdate(id, userData, options)
            if (!user) throw new HttpException({ error_code: "404", error_message: "User not found" }, 404)

            return this.fromEntity(user)
        } catch (error) {
            throw new HttpException({ error_code: "404", error_message: "User not found" }, 404)
        }
    }

    async deleteById(id: string): Promise<IFUser> {
        try {
            const user: IFUser = await User.findByIdAndDelete(id)
            if (!user) throw new HttpException({ error_code: "404", error_message: "User not found" }, 404)
            return user
        } catch (error) {
            throw new HttpException({ error_code: "404", error_message: "User not found" }, 404)
        }
    }
}