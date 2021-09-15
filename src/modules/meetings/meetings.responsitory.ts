import { Injectable } from '@nestjs/common';
import { IFRoom, RoomsRepository } from '../rooms';
import { Controller, HttpException } from '@nestjs/common';
import { Meeting } from './model'
import { MeetingDto } from './dto/dto'
import { IFMeeting } from './interface'
import { IFResponse, ResponseRepository } from '../response'
import { AbstractSubject } from '../observer';

@Injectable()
export class MeetingsResponse extends AbstractSubject {

    constructor(
        private readonly responRepository: ResponseRepository,
        private readonly RoomRepo: RoomsRepository
    ) { super() }

    fromEntity(data: any): IFMeeting {
        return data
    }

    //Đây là hàm xử lý để check meeting khi tạo phong họp dùng cho bên service
    async countDocuments(filter?: any): Promise<number> {
        return await Meeting.countDocuments(filter)
    }

    /**
     * Chức năng này được sử dụng để tạo các cuộc họp lặp lại theo ngày
     * Vòng lặp trong khi thời gian bắt đầu ít hơn cho đến ngày
     * Mỗi lần lặp lại sẽ tạo một bản sao của cuộc họp @param với start_time và end_time mới
     */

    async createRepeatDaily(meeting: IFMeeting): Promise<void> {
        //mui gio quoc the trong 1 ngay
        let MILLIS_PER_DAY = 86400000

        //Lặp lại trong khi thời gian bắt đầu chưa đến ngày moi
        while (1 == 1) {
            const repeat_meeting = meeting.clone({
                start_time: meeting.start_time + MILLIS_PER_DAY,
                end_time: meeting.end_time + MILLIS_PER_DAY
            })
            //lawp lai thoi gian kem voi thiet lap thoi gian
            repeat_meeting.setTime()

            if (repeat_meeting.start_time > meeting.until_date) {
                repeat_meeting.save()
                break
            }
            this.notify({ meeting }, "Repeat Meeting")
            //them 1 ngay moi cung voi mui gio quoc te qua ngay tiep theo lap
            MILLIS_PER_DAY += 86400000
        }
    }

    /**
    * Chức năng này được sử dụng để tạo các cuộc họp lặp lại theo tuan
    * Vòng lặp trong khi thời gian bắt đầu ít hơn cho đến ngày
    * Mỗi lần lặp lại sẽ tạo một bản sao của cuộc họp @param với start_time và end_time mới
    */
    async createRepeatWeekly(meeting: IFMeeting): Promise<void> {
        //gio quoc the trong 1 tuan nhan len cho 7
        let MILLIS_PER_DAY = 604800000

        //Lặp lại trong khi thời gian bắt đầu chưa đến ngày moi
        while (1 == 1) {
            const repeat_meeting = meeting.clone({
                start_time: meeting.start_time + MILLIS_PER_DAY,
                end_time: meeting.end_time + MILLIS_PER_DAY
            })
            repeat_meeting.setTime()

            ////lap lai thoi gian kem voi thiet lap thoi gian
            if (repeat_meeting.start_time > meeting.until_date) {
                repeat_meeting.save()
                break
            }
            this.notify({ meeting }, "Repeat Meeting")
            //them 1 tuan moi cung voi mui gio quoc te qua ngay tiep theo lap
            MILLIS_PER_DAY += 604800000
        }
    }

    async createRepeatMonthy(meeting: IFMeeting): Promise<void> {
        const start_time = new Date(meeting.start_time)
        const end_time = new Date(meeting.end_time)

        //Thêm 1 tháng vào thời gian bắt đầu và thời gian kết thúc 
        start_time.setMonth(start_time.getMonth() + 1)
        end_time.setMonth(end_time.getMonth() + 1)

        //Lặp lại trong khi thời gian bắt đầu chưa đến ngày moi
        while (1 == 1) {
            const repeat_meeting = meeting.clone({
                //thoi gian bat dau tinh tu hien tai khi da thiet lap o tren
                start_time: start_time.getTime(),
                end_time: end_time.getTime()
            })
            repeat_meeting.setTime()

            if (repeat_meeting.start_time > meeting.until_date) {
                //dung meeting vi den 1 thang la ket thuc roi vong lap quay lai ngay nen khong can dung repeat_meeting
                meeting.save()
                break
            }
            this.notify({ meeting }, "Repeat Meeting")
            start_time.setMonth(start_time.getMonth() + 1)
            end_time.setMonth(end_time.getMonth() + 1)

        }
    }

    //Đây là hàm xử lý các cuộ họp trog cùng 1 ngày nhóm chúng vô
    async getAllAndGruopByDate(filter?: any): Promise<Array<IFMeeting[]>> {
        const result = await Meeting.findAndGroupByDate(filter)
        return result
    }

    /** 
    * Chức năng này được sử dụng để tạo một cuộc họp mới và lưu nó vào cơ sở dữ liệu.
      * Tạo một đối tượng cuộc họp, hơn là kiểm tra xem thời gian của cuộc họp này có bị trùng với cuộc họp khác hay không
      * Nếu không bị trùng lặp, dữ liệu cuộc họp sẽ lưu vào cơ sở dữ liệu
      * @ quay lại dữ liệu cuộc họp 
     */

    async create(MeetingData: MeetingDto, checkIfRoomAble?: Function): Promise<IFMeeting> {
        const meeting: IFMeeting = new Meeting(MeetingData)
        //khi tạo dữ liệu thiết lập settime cho nó
        meeting.setTime()
        if (checkIfRoomAble) await checkIfRoomAble(meeting)
        await meeting.save()
        this.notify({meeting},"Create Meeting")
        return meeting
    }

    //Lấy ra danh sách cuộc họp meeting của tôi bao gồm room và type thiết bị
    async getAll(filter?: any): Promise<IFMeeting[]> {
        const meeting = await Meeting.find(filter)
            .populate('room')
            .populate('type')
            .sort({ created_time: 'desc' })

        if (!meeting) throw new HttpException({ error_code: '401', error_message: 'Meeting not found' }, 401)
        return meeting
    }

    //Tìm lấy ra thông tin dữ liệu của room trong cuoc hop
    async getByRoom(id: string) {
        try {
            //Lấy id của cuộc họp inport interface tu room vao va su dung no
            const room: IFRoom = await this.RoomRepo.getById(id)
            const meeting: IFMeeting[] = await Meeting.find({room:room.id})
                .populate('type')

            let response = {
                room: room,
                meeting: meeting
            }

            return response
        } catch (error) {
            throw new HttpException({ error_code: '401', error_message: 'Meeting not found' }, 401)
        }
    }

    //lay thong tin của 1 cuộc họp trong meeting
    async getOne(filter?: any): Promise<IFMeeting> {
        const meeting = await Meeting.findOne(filter)
        if (!meeting) throw new HttpException({ error_code: '401', error_message: 'Meeting not found' }, 401)
        return meeting
    }


    //ham xử lý cập nhập
    async updateOne(MeetingData: MeetingDto, filter?: any, checkIfRoomAble?: Function): Promise<IFMeeting> {
        const meeting: IFMeeting = await Meeting.findOne(filter)
        if (!meeting) throw new HttpException({ error_code: '401', error_message: 'Meeting not found' }, 401)

        Object.assign(meeting, MeetingData)
        meeting.setTime()

        if (checkIfRoomAble) await checkIfRoomAble(meeting)

        await meeting.save()
        return meeting
    }

    //hàm xóa dữ liệ
    async deleteOne(filter?: any): Promise<IFMeeting> {
        try {
            const meeting = await Meeting.findOneAndDelete(filter)
            if (!meeting) throw new HttpException({ error_code: '401', error_message: 'Meeting not found' }, 401)

            return meeting
        } catch (error) {
            throw new HttpException({ error_code: '401', error_message: 'Meeting not found' }, 401)

        }
    }

}