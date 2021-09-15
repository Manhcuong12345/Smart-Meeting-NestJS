import {Document,Schema} from 'mongoose'

export interface IFDevice extends Document {
    readonly _id: string
    device_name: string
    device_type: number
    room:string
    note:string
    is_on?:boolean
    max_value?:number
    min_value?:number
    cestron_device_id?:string
    cestron_device_id_off?:string
    created_time:number
    updated_time:number
    current_value?:number
    user_created:string
    user_updated:string
}