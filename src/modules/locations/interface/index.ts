import {Document,Schema} from 'mongoose'

export interface IFLocation extends Document {
   readonly id:string,
   location:string,
   address:string,
   start_time:string,
   end_time:string,
   created_time: number,
   updated_time: number,
   user_updated:string,
   user_created:string
}