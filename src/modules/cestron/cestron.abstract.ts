//Đây là nơi xủ lý gửi dữ liệu lên thingwork dùng axios
import axios from "axios"
import config from "../../config/config"

export abstract class AbstractCestron {
    async post({ url, headers, body}: { url: string, headers: any, body: any}){
        const response = await axios.request({
            method: 'POST',
            url,
            headers,
            data: body
        });
        return response.data;
    }

    async createRoom({ roomName,  description}: { roomName: string, description: string}){
        const THINGWORX_PATH: string = '/Thingworx/Things/CestronApi/Services/CreateRoom'

        const url = config.thingworxHost + THINGWORX_PATH;
        const room = await this.post({
            url,
            headers: {
                Accept: 'application/json',
                appKey: config.thingworxAppKey
            },
            body: {
                createRoom:{
                    GroupwareProviderType: 'Internal',
                    Description: description,
                    ParentNodeID: 'ROOMS',
                    RoomName: roomName,
                    TimeZoneID: 'Dateline Standard Time'
                }
            }
        });
        return room;
    }

    async createAppointments(
        { cestron_room_id, name, note,start_time, end_time, type_id, type_name}:
        { cestron_room_id: string, name: string, note: string, start_time:number, end_time:number, type_id: string, type_name: string}
    ){
        const THINGWORX_PATH: string = '/Thingworx/Things/CestronApi/Services/CreateAppointment';
        const TIMEZONE: string = '0700';
        const TIMEZONE_ID: string = 'SE Asia Standard Time';
        const VIET_NAM_UTC: number = 25200000;

        const url = config.thingworxHost + THINGWORX_PATH;
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
                    Start: `\/Date(${(start_time - VIET_NAM_UTC).toString()}-${TIMEZONE})\/`,
                    End: `\/Date(${(end_time - VIET_NAM_UTC).toString()}-${TIMEZONE})\/`,
                    TimeZoneId: TIMEZONE_ID,
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

    async getDeviceByRoomId({ RoomID }: { RoomID: string}){
        const THINGWORX_PATH: string = '/Thingworx/Things/CestronApi/Services/Get_Room_byID';

        const url = config.thingworxHost + THINGWORX_PATH;
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

    async updateDeviceValue({ AttributeID, value }: { AttributeID: string, value: boolean | number}){
        const THINGWORX_PATH: string = '/Thingworx/Things/CestronApi/Services/UpdateDevice';

        const url = config.thingworxHost + THINGWORX_PATH;
        try{
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
            console.log(data);
        }
        catch(error) {
            console.log(error.message);
        }
    }
}


