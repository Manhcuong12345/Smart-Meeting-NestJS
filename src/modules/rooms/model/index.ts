import * as mongoose from "mongoose"
import{Schema} from "mongoose"
import{IFRoom} from '../interface'

export const RoomSchema = new Schema({
  name:{
      type:String
  },
  images:[
      {
          type:String
      }
  ],
  status:{
      type:String,
      default:'Active'
  },
  location:{
      type:Schema.Types.ObjectId,
      ref:'Location'
  },
  area:{
      type:String
  },
  capacity:{
      type:Number,
      default:0
  },
  cestron_room_id:{
      type:String,
  },
  user_created:{
      type:Schema.Types.ObjectId,
      immutable:true
  },
  user_updated:{
      type:Schema.Types.ObjectId
  },
  created_time:{
      type:Number,
      default:Date.now(),
      immutable:true
  },
  updated_time:{
      type:Number,
      default:Date.now(),
  }
})

export const Room = mongoose.model<IFRoom>('Room',RoomSchema)