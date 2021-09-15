import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { IFDevice, DeviceRepository } from '../device'
import { IFRoom, RoomsRepository } from '../rooms'
import { IFMeeting,MeetingsResponse } from '../meetings'
import {IFMeetingType,MeetingTypeReponsitory} from '../meeting-type'
import { IFSubscription, Observer } from '../observer'
import { AbstractCestron } from './cestron.abstract'
// import {CestronRepository} from './cestron.repository'

//Day la noi xu ly cac du lieu gui thong bao ring len cho thigword thong qua meeting va room,meeting_type
@Injectable()
export class CestronService extends AbstractCestron implements Observer {

    constructor(
        @Inject(forwardRef(() => RoomsRepository))
        private readonly RoomRepo: RoomsRepository,
        private readonly MeetingTypeRepo:MeetingTypeReponsitory
    ) {
        super();
    }

    /**
     * Phương pháp này sẽ được gọi là khi trang thai thay đổi
     */

    async observerNotify({meeting,device,room}:IFSubscription,type?:string){
       if(!type || type === 'Create Meeting' || type === 'Repeat Meeting') await this.createAppointmentsWhenCreateMeeting(meeting)
       if(type === 'Update device value') await this.updateDeviceValueOnCestron(device)
       if(type === 'Create Room value') await this.createRoomOnCestron(room)
    }

    /** 
     * Chức năng này để tạo một cuộc họp mới trên cestron thingworx và lưu id của cuộc họp đó vào cuộc họp @param
     * Lấy dữ liệu phòng và dữ liệu kiểu cuộc họp từ cuộc họp @param
     * Sau đó tạo một cuộc họp trên cestron thingworx với @param cuộc họp, dữ liệu phòng và dữ liệu loại cuộc họp
     * Nhận id cuộc họp trên cestron thingworx và lưu nó trong cuộc họp @param làm cestron_meeting_id trường
     */

    async createAppointmentsWhenCreateMeeting(meeting: IFMeeting) {
        try {
            //  Lấy dữ liệu phòng và cuộc họp từ dữ liệu cuộc họp
            const room = await this.RoomRepo.getById(meeting.room)
            const meetingType = await this.MeetingTypeRepo.getById(meeting.type)

            //Tạo một cuộc họp trên cestron thingworx và nhận id của cuộc họp đó
            meeting.cestron_meeting_id = await this.createAppointments({
                cestron_room_id: room.cestron_room_id,
                name: meeting.name,
                note: meeting.note,
                start_time: meeting.start_time,
                end_time: meeting.end_time,
                type_id:meetingType.cestron_action_id,
                type_name:meetingType.name
            })
            meeting.save()
            console.log('create appointment success')
        } catch (error) {
            console.log(error.message)
        }
    }

    /** Chức năng này để cập nhật giá trị thiết bị từ cuộc họp @param */
    async updateDeviceValueOnCestron(device:IFDevice){
        await this.updateDeviceValue({
            AttributeID:(device.device_type === 1 || device.is_on == true) ? device.cestron_device_id:device.cestron_device_id_off,
            value : (device.device_type === 1) ? device.current_value : device.is_on
        })
    }

    /** Chức năng này để tạo ra một căn phòng mới trên cestron thingworx và lưu id của căn phòng đó để @param phòng */
    async createRoomOnCestron(room: IFRoom){
       try{
         const cestron_room = await this.createRoom({roomName: room.name,description:`Description for ${room.name}`})
         room.cestron_room_id = cestron_room.API_Rooms[0].RoomID;
       }catch(error) {
           console.log(error.message)
       }
    }
}
