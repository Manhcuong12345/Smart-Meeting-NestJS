import {IsNotEmpty} from 'class-validator'

export class LocationDto {
   
   readonly id:string

   @IsNotEmpty()
   location:string
   
   @IsNotEmpty()
   address:string

   start_time:string

   end_time:string

   user_created:string

   user_updated:string

   created_time:number

   updated_time:number
}