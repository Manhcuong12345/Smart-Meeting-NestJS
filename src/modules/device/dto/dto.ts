import {IsNotEmpty} from 'class-validator'

export class DeviceDto{

    @IsNotEmpty()
    readonly _id: string;
    readonly device_name:string
    readonly note:string
    @IsNotEmpty()
    readonly room:string
    @IsNotEmpty()
    readonly device_type:number
    readonly is_on?:boolean
    readonly max_value?:number
    readonly min_value?:number
    readonly current_value?:number
    readonly cestron_device_id?:string
    readonly cestron_device_id_off?:string
}