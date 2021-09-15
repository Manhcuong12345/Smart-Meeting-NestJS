import * as mongoose from "mongoose"
import {IFLocation} from '../interface'
import {Schema} from 'mongoose'

export const LocationSchema = new Schema({
  location:{
      type:String
  },
  address:{
      type:String
  },
  start_time:{
      type:String,
      default:'00:00'
  },
  end_time:{
      type:String,
      default:'23:59'
  },
  user_created:{
      type:Schema.Types.ObjectId
  },
  user_updated:{
      type:Schema.Types.ObjectId
  },
  created_time:{
      type:Number,
      default:new Date()
  },
  updated_time:{
      type:Number,
      default:new Date()
  }
})

export const Location = mongoose.model<IFLocation>('Location',LocationSchema)