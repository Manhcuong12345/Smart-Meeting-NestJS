// import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
// import { IFLocation } from './interface'
// import { Location } from './model'
// import { LocationDto } from './dto/dto';
// import {ResponseRepository,IFResponse} from '../response'

// @Injectable()
// export class LocationsRepository {

//     constructor(private readonly reponRepo: ResponseRepository) { }
    
//     fromEntity(data:any):IFLocation{
//          return data
//     }

//     async create(LocationData: LocationDto): Promise<IFLocation> {
//         let location = await Location.findOne({ location: LocationData.location })
//         if (location) throw new HttpException({ error_code: '401', error_message: 'Location already exists' }, 401)

//         location = new Location(LocationData)
//         await location.save()

//         return location
//     }

//     // async findAll(filter?:any): Promise<IFLocation[]> {
//     //     const location = await Location.find(filter)
//     //     return location
//     // }

//     async findById(id: string): Promise<IFLocation> {
//         try{
//           const location = await Location.findById(id)
//           if(!location) throw new HttpException({ error_code: '401', error_message: 'Location not found' }, 401)

//           return location
//         }catch(error){
//             throw new HttpException({ error_code: '401', error_message: 'Location not found' }, 401)
//         }
//     }

//     async update(id:string,LocationData:LocationDto,option?:any):Promise<IFLocation>{
//         try{
//             const existLocation = await Location.findOne({_id:{$ne:LocationData.id},location: LocationData.location})
//             if(existLocation) throw new HttpException({ error_code: '401', error_message: 'Location alreay exists' }, 401)

//             let location = await Location.findByIdAndUpdate(id,LocationData,option)
//             if(!location) throw new HttpException({ error_code: '401', error_message: 'Location not found' },401)
            
//             return this.fromEntity(location)
//         }catch(error){
//             throw new HttpException({ error_code: '401', error_message: 'Location not found' }, 401)
//         }
//     }

//     async delete(id:string): Promise<IFLocation>{
//         try{
//            const location = await Location.findByIdAndDelete(id)
//            if(!location) throw new HttpException({error_code: '401', error_message: 'Location not found'},401)

//            return location
//         }catch(error){
//             throw new HttpException({ error_code: '401', error_message: 'Location not found' }, 401)
//         }
//     }
// }
