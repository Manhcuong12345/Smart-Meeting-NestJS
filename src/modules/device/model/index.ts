import {Schema} from 'mongoose'
import * as mongoose from 'mongoose'
import {IFDevice} from '../interface'

export const DeviceSchema = new Schema({
   device_name:{
       type:String,
   },
   note:{
       type:String,
   },
   room:{
       type:Schema.Types.ObjectId,
       ref:'Room'
   },
   is_on:{
       type:Boolean,
       default:false
   },
   min_value:{
       type:Number
   },
   current_value:{
    type:Number
   },
   max_value:{
       type:Number
   },
   cestron_device_id:{
       type:String
   },
   cestron_device_id_off:{
       type:String
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
       default:new Date(),
       immutable:true
   },
   updated_time:{
       type:Number,
       default:new Date()
   }

})

export const Device = mongoose.model<IFDevice>('Device',DeviceSchema)