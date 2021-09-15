//Đây là nơi xủ lý gửi dữ liệu lên thingwork dùng axios
import { Injectable } from "@nestjs/common"
import axios from "axios"
import config from "../../config/config"

@Injectable()
export class CestronRepository {

    async post({url,headers,body}:{url:string,headers:any,body:any}){
        const response = await axios.request({
            method: "POST",
            url,
            headers,
            data: body,
        })
        return response.data
    }

    //gui du lieu room len thigword
    async createRoom({roomName,description}:{roomName:string,description:string}){
        const url = config.thingworxHost + '/Thingworx/Things/CestronApi/Services/CreateRoom';
        const room = await this.post({
            url,
            headers: {
                Accept: 'application/json',
                appKey: config.thingworxAppKey
            },
            body:{
                createRoom:{
                    GroupwareProviderType: 'Internal',
                    Description: description,
                    ParentNodeID: 'ROOMS',
                    RoomName: roomName,
                    TimeZoneID: 'Dateline Standard Time'
                }
            }
        })
        return room
    }

    //gui du lieu tao cuoc hop len thigword
    async createAppointments(
        {cestron_room_id,name,note,start_time,end_time,type_id,type_name}:
        {cestron_room_id:string,name:string,note:string,start_time:number,end_time:number,type_id:string,type_name:string}
    ){
        const url = config.thingworxHost + '/Thingworx/Things/CestronApi/Services/CreateAppointment';
        if(!note) note = 'note';
        const appointments = await this.post({
            url,
            headers: {
                Accept: 'application/json',
                appKey: config.thingworxAppKey
            },
            body: {
                param: {
                    AltID: 'Test11211',
                    MeetingSubject: name,
                    MeetingComment: note,
                    RoomID: cestron_room_id,
                    Start: `\/Date(${(start_time - 25200000).toString()}-0700)\/`,
                    End: `\/Date(${(end_time - 25200000).toString()}-0700)\/`,
                    TimeZoneId: 'SE Asia Standard Time',
                    Organizer: 'mmcreavy@crestron.com',
                    EventOrMeeting: 'EventWithActions',
                    IsPrivate: true,
                    MeetingType: true,
                    NotifyAction: true,
                },
                Actions: {
                    ActionID:[type_id],
                    ActionName:[type_name],
                    OffsetMinutes:0
                }
            }
        });
        return appointments.API_Appointments[0].RV_MeetingID;
    }
    
    //gui du lieu room tu device
    async getDeviceByRoomID({RoomID}:{RoomID:string}){
        const url = config.thingworxHost + '/Thingworx/Things/CestronApi/Services/Get_Room_byID';
        const { API_Rooms } = await this.post({
            url,
            headers: {
                Accept: 'application/json',
                appKey: config.thingworxAppKey
            },
            body: {
                RoomID
            }
        });
        return API_Rooms[0].Symbols[0].Signals;
    }

    //gui du lieu cap nhat value device
    async updateDeviceValue({ AttributeID, value }: { AttributeID: string, value: boolean | number}){
        const url = config.thingworxHost + '/Thingworx/Things/CestronApi/Services/UpdateDevice';
        const data = await this.post({
            url,
            headers: {
                Accept: 'application/json',
                appKey: config.thingworxAppKey
            },
            body: {
                contentUpdate: {
                    SymbolID: 'fa4d7963-f7fb-4713-8ab7-9907121e31b0',
                    AttributeID,
                    value
                }
            }
        });
        return data;
    }
}