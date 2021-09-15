import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { IFRoom } from './interface'
import { RoomDto } from './dto/dto'
import { Room } from './model'
import { IFResponse, ResponseRepository } from '../response'
import { AbstractSubject } from '../observer';

@Injectable()
export class RoomsRepository extends AbstractSubject{

    constructor(private readonly reponseRepo: ResponseRepository) {super()}

    fromEntity(data: any): IFRoom {
        return data
    }

    async create(RoomData: RoomDto): Promise<IFRoom> {
        const room: IFRoom = new Room(RoomData)
        await room.save()
        return room
    }

    async findAllAndPagging({ page, limit, sort }: { page: number, limit: number, sort?: any }, filter?: any)
        : Promise<IFResponse<IFRoom>> {
            
        let skip: number = 0
        skip = (page - 1) * limit

        const rooms: IFRoom[] = await Room.find(filter)
            .skip(skip)
            .limit(+limit)
            .sort(sort)
            .select('-password')
        const totalRecords = await Room.countDocuments(filter).populate('location')

        return this.reponseRepo.getResponse(rooms, totalRecords, page, limit)
    }

    async findAll(filter?: any): Promise<IFRoom[]> {
        const rooms = await Room.find(filter)
        return rooms
    }

    async getById(id: string): Promise<IFRoom> {
        try {
            const room: IFRoom = await Room.findById(id)
            if (!room) throw new HttpException({ error_code: '404', error_message: 'Room not found' }, 404)
            return room
        } catch (error) {
            throw new HttpException({ error_code: "404", error_message: 'Room not found' }, 404)
        }
    }

    async updateById(id: string, RoomData: RoomDto, option: any): Promise<IFRoom> {
        try {
            const room: IFRoom = await Room.findByIdAndUpdate(id, RoomData, option)
            if (!room) throw new HttpException({ error_code: '404', error_message: 'Room not found' }, 404)
            return this.fromEntity(room)
        } catch (error) {
            throw new HttpException({ error_code: "404", error_message: "Room not found" }, 404)
        }
    }

    async deleteById(id: string): Promise<IFRoom> {
        try {
            const room: IFRoom = await Room.findByIdAndDelete(id)
            if (!room) throw new HttpException({ error_code: 404, error_message: 'Room not found' }, 404)
            return room
        } catch (error) {
            throw new HttpException({ error_code: 404, error_message: 'Room not found' }, 404)
        }
    }
}
