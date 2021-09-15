import * as mongoose from "mongoose"
import {Schema} from "mongoose"
import {NotificationClass} from '../interface'

export const NotificationSchema = new Schema({
    title:{
        type:String
    },
    body:{
        type:String
    },
    user:{
        type:Schema.Types.ObjectId
    },
    data:{
        meeting_id:{
            type:Schema.Types.ObjectId
        }
    },
    created_time:{
        type:Number,
        default:Date.now()
    },
    updated_time:{
        type:Date,
        default:Date.now()
    }
})

NotificationSchema.index({user:1,created_time: -1})

export const Notification = mongoose.model<NotificationClass>('Notification',NotificationSchema)