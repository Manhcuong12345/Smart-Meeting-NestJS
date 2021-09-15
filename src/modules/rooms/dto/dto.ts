import {IsNotEmpty} from "class-validator"

export class RoomDto {
   @IsNotEmpty()
   readonly name:string

   readonly status:string

   @IsNotEmpty()
   readonly location:string

   readonly area:string

   readonly capacity:number

   cestron_room_id:string
}