import { HttpException, Injectable } from '@nestjs/common';
import { Meeting } from './model'
import { MeetingDto } from './dto/dto'
import { IFMeeting } from './interface'
import {CestronService} from '../cestron'
import { MeetingsResponse } from './meetings.responsitory'
import {NotificationsService} from '../notifications'

@Injectable()
export class MeetingsService {

    constructor(
        private readonly meetingRepo: MeetingsResponse,
        private readonly cestronService:CestronService,
        private readonly notificationService: NotificationsService
        ) 
    {
        // Gắn quan sát viên vào chủ đề cuộc họp.
        this.meetingRepo.attach(this.notificationService);
        this.meetingRepo.attach(this.cestronService)
    }

    /** Chức năng này được sử dụng để tạo bộ lọc dữ liệu để kiểm tra xem thời gian của cuộc họp này có bị trùng với cuộc họp khác hay không  */
    filterMeeting(meeting: IFMeeting) {
        /** 
         * Lọc đối tượng dữ liệu
         * tìm các cuộc họp diễn ra trong cùng phòng với cuộc họp này
         * và thời gian bắt đầu hoặc kết thúc giữa thời gian bắt đầu và kết thúc của cuộc họp 
         */
        let filter: any = {
            room: meeting.room,
            // Tìm một cuộc họp mà start_time của cuộc họp này 
            start_time: { $lte: meeting.end_time, $gte: meeting.start_time },
            //tim id cua cuoc hop co trung hay khong
            _id: { $ne: meeting._id },
            $or: [
                { 'time.start': { $gte: meeting.time.start, $lte: meeting.time.end } },
                { 'time.end': { $gte: meeting.time.start, $lte: meeting.time.end } }
            ]
        }

        /** Create
         * Nếu cuộc họp không lặp lại
         * ta tìm các cuộc họp diễn ra trong cùng phòng với cuộc họp này
         * và thời gian bắt đầu là giữa thời gian bắt đầu và kết thúc của cuộc họp này. 
         */
        if (!meeting.repeat || meeting.repeat == 0) {
            filter = {
                room: meeting.room,
                $or: [
                    {
                        start_time: { $lte: meeting.end_time, $gte: meeting.start_time }
                    },
                    {
                        end_time: { $lte: meeting.end_time, $gte: meeting.start_time }
                    }
                ]
            }
        }

        /** Filter
         * Nếu lặp lại là hàng tuần
         * thi thêm vào bộ lọc một điều kiện để tìm cuộc họp diễn ra vào cùng ngày trong tuần với cuộc họp này 
         */
        if (meeting.repeat === 2) {
            filter.day_of_week = meeting.day_of_week
        }

        /** 
         * Nếu lặp lại là hàng tháng
         * Thêm vào bộ lọc một điều kiện để tìm cuộc họp diễn ra cùng/thang ngày với cuộc họp này 
         */
        if (meeting.repeat === 3) {
            filter['time.date'] = meeting.time.date
        }
        return filter
    }

    //Kiem tra so luong cuoc hop co bi trung lap hay khong
    async checkIfRoomAble(meeting: IFMeeting) {
        const filter = await this.filterMeeting(meeting)

        //lay du lieu tu database
        const meetings = await this.meetingRepo.countDocuments(filter)
        return meetings
    }
    
    //Kiem tra phong hop co trung khi cap nhap
    async checkingRoomWhenUpdate(meeting: IFMeeting){
        /** TOD
         * Tìm các cuộc họp diễn ra trong cùng một phòng với cuộc họp này
         *  thời gian bắt đầu hoặc kết thúc giữa thời gian bắt đầu và kết thúc của cuộc họp này
         */
        const filter ={
            room: meeting.room,
            _id: {$ne:meeting._id},
            $or:[
                {'start_time':{ $gte: meeting.start_time, $lte: meeting.end_time }},
                {'end_time':{ $lte: meeting.end_time, $gte: meeting.start_time}}
            ]
        }
        /**
         * Lấy dữ liệu từ cơ sở dữ liệu
           nếu cuộc họp lớn hơn 0, 
         * thi cuộc họp này là thời gian trùng lặp và không thể tạo
         *  nếu số là 0 thì cuộc họp này có thể được tạo
         */
        const meetings = await this.meetingRepo.countDocuments(filter)

        return meetings
    }

    //tao cuoc hop moi
    async create(MeetingData: MeetingDto) {
        const meeting = await this.meetingRepo.create(MeetingData,async(meeting)=>{
            if(await this.checkIfRoomAble(meeting) > 0)
            throw new HttpException({ error_code: '401', error_message: 'Can not booking meeting.' }, 401)
        })
        return meeting
    }

    //lay nhan thong tin tu cuoc hop cua minh tao
    async getMyMeeting(id:string,{start_time, end_time}:{start_time?:number,end_time?:number}){
         let filter:any = {
             $or:[
                 //hoặc nếu người dùng này là người dùng đã tạo cuộc họp này
                 {user_booked:id},
                 //Nếu người dùng này là thành viên của cuộc họp này
                 {members:{$in:[id]}}
             ]
         }
         if(start_time){
             filter.start_time = {$gte:start_time}
         }
         if(end_time){
              filter.end_time = {$lte:end_time}
         }
          
         return this.meetingRepo.getAllAndGruopByDate(filter)
    }

    // //Nguoi khong tao duoc phep xem
    async getMeetingIBooked(id: string,{start_time,end_time}:{start_time?:number,end_time?:number}){
        let filter:any = {user_booked:id}

        if(start_time){
            filter.start_time = {$gte:start_time}
        }
        if(end_time){
            filter.end_time = {$lte:end_time}
        }

        return this.meetingRepo.getAllAndGruopByDate(filter)
    }

    //lay phong hop tu cuoc hop meeting
    async getByIdRoom(id: string) {
        return this.meetingRepo.getByRoom(id)
    }

    //cho phep lay thong tin cua 1 cuoc hop nao do
    getById(id: string, { isAdmin, userId }: { isAdmin: boolean, userId: string }) {
        const filter: any = { _id: id }
        /** filter
         * Nếu người dùng không có quyền quản trị,
         * người đó chỉ được phép xem thông tin về các cuộc họp do chính mình đặt trước
         * hoặc với tư cách là thành viên có thể tham gia các cuộc họp đó. 
         */
        if (!isAdmin) {
            filter.$or = [
                { user_booked: userId },
                { members: { $in: userId } }
            ]
        }
        return this.meetingRepo.getOne(filter)
    }

    //cap nhat cuoc hop 
    async updateMeeting(id: string, MeetingData: MeetingDto, { isAdmin, userId }: { isAdmin?: boolean, userId: string }) {
        const filter: any = { _id: id }
        /** filter
         * Nếu người dùng không có quyền quản trị,
         * anh ta chỉ được phép xem sổ thông tin cuộc họp một mình 
         */
        if (!isAdmin) {
            filter.user_booked = userId
        }

        const update_meeting = await this.meetingRepo.updateOne(MeetingData, filter,
        async(meeting)=>{
            if(await this.checkingRoomWhenUpdate(meeting) > 0)
            throw new HttpException({ error_code: '401', error_message: 'Meeting not found' }, 401)
        })
        await update_meeting.save()

        return update_meeting
    }

    //xoa cuoc hop
    async delete(id: string, { isAdmin, userId }: { isAdmin: boolean, userId: string }) {
        const filter: any = { _id: id }

        /** filter
        * Nếu người dùng không có quyền quản trị,
        * anh ta chỉ được phép xem sổ thông tin cuộc họp một mình 
        */
        if (!isAdmin) {
            filter.user_booked = userId
        }

        return this.meetingRepo.deleteOne(filter)
    }


}
