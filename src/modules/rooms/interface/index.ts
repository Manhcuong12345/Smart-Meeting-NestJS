import {Document,Schema} from 'mongoose'

export interface IFRoom extends Document {
     readonly _id:string,
     name:string,
     status: string,
     images?:string[]
     location:string,
     area?:string,
     capacity:number,
     cestron_room_id?:string,
     created_time:number,
     updated_time:number,
     user_created:string,
     user_updated:string
}