import { Schema } from 'mongoose'
import * as mongoose from 'mongoose'
import { IFMeeting,MeetingModel } from '../interface'
import { MeetingDto } from '../dto/dto'

export const MeetingSchema = new Schema({
    name: {
        type: String
    },
    document: [
        {
            type: String
        }
    ],
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    description: {
        type: String
    },
    note: {
        type: String
    },
    start_time: {
        type: Number
    },
    end_time: {
        type: Number
    },
    time: {
        start: { type: Number },
        end: { type: Number },
        date: { type: Number }
    },
    remind: {
        type: Boolean,
        default: false
    },
    repeat: {
        type: Number
    },
    until_date: {
        type: Number
    },
    is_clone: {
        type: Boolean
    },
    //chua id khi tao ra
    clone_from: {
        type: Schema.Types.ObjectId
    },
    day_of_week: {
        type: Number
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    user_booked: {
        type: Schema.Types.ObjectId,
    },
    cestron_meeting_id: {
        type: String
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: "MeetingType"
    },
    created_time: {
        type: Number,
        default: new Date()
    },
    updated_time: {
        type: Number,
        default: new Date()
    },
    user_created: {
        type: Schema.Types.ObjectId
    },
    user_updated: {
        type: Schema.Types.ObjectId
    }
})

//Dùng để thực hiện truy vấn nhanh không tốn qua time thực hiện records
MeetingSchema.index({ room: 1, start_time: -1, end_time: -1 })
MeetingSchema.index({ user_booked: 1, start_time: -1, end_time: -1 })
MeetingSchema.index({ user_booked: 1, start_time: -1, end_time: -1, members: 1 })
MeetingSchema.index({ members: 1 })
MeetingSchema.index({ user_booked: 1 })
MeetingSchema.index({ start_time: -1 })


/**
 * Chức năng này được sử dụng để sắp xếp tất cả các cuộc họp theo start_time và nhóm chúng theo ngày
 * Nhận tất cả các cuộc họp, sau đó tạo một biến group_meetings để tổ chức các cuộc họp trong cùng một ngày và một biến trung gian
 * Tìm thấy lặp lại tất cả các cuộc họp, nếu dư khi chia start_time cho số mili giây mỗi ngày
 * bằng với biến trung gian (trong cùng một ngày), sau đó đẩy cuộc họp đó sang biến group_meetings
 * nếu không bằng nhau, hãy xóa biến group_meetings và đẩy cuộc họp đó vào biến group_meetings
 * Sau đó thay đổi biến trung gian giống như biến thặng dư
 */
MeetingSchema.statics.findAndGroupByDate = async function (filter?: Object): Promise<Array<IFMeeting[]>> {
    const VIET_NAM_UTC = 25200000
    const MILLIS_PER_DAY = 86400000

    const meetings = await this.find(filter)
        .populate('room')
        .populate('type')
        .sort({ start_time: 'desc' })

    let intermediary = 0
    const result: Array<IFMeeting[]> = []
    let group_meetings: IFMeeting[] = []

    //nếu surlus bằng thặng dư khi chia start_time cho số mili giây mỗi ngày
    //có nghĩa là cuộc họp này diễn ra cùng ngày với cuộc họp trong biến group_meetings
    //Thêm start_time bằng VIET_NAM_UTC vì múi giờ là +7
    meetings.forEach(meeting => {
        const surplus = Math.floor((meeting.start_time + VIET_NAM_UTC) / MILLIS_PER_DAY)
        if (intermediary === surplus) group_meetings.push(meeting)
        else {
        //Nếu không bằng có nghĩa là cuộc họp này không cùng ngày với cuộc họp trong biến group_meetings
        //sau đó đẩy biến group_meetings cũ thành kết quả và xóa biến group_meetings
        if(group_meetings.length > 0) result.push(group_meetings);//đẩy kết quả ở trên vào biết kết quả
        //trả về kết quả meeting ban đầu đã có
        group_meetings = [meeting];
        }
        //có nghĩa là cuộc họp không cùng 1 ngày hay không có thì ta trả về kết quả = 0
        //vì ta tạo 1 biến intermediary là =0 nghĩa là không có
        intermediary = surplus
    })
    result.push(group_meetings);
    return result
}





/**
 * This function to set hour data (seconds since 00:00 to start_time) and end data (seconds since 00:00:00 to end_time)
 * set day_of_week by start_time data
 * This properties used to checking if the time of this meeting is overlapped with another meeting
 */
MeetingSchema.methods.setTime = function () {
    const VIET_NAM_UTC = 25200000 //Viet Nam chech lech 7 tieng so voi mui gio goc,lay 7 * 3600 len cho 1 thang
    const MILLIS_PER_DAY = 86400000 // 24h * 3600 nhan en trong 1 thang gio quoc te
    //Thoi gian trong ngay tinh tu gio Viet nam lay + cho VIET_NAM_UTC
    this.day_of_week = (new Date(this.start_time + VIET_NAM_UTC)).getDay()
    this.time = {
        start: (this.start_time + VIET_NAM_UTC) % MILLIS_PER_DAY,
        end: (this.end_time + VIET_NAM_UTC) % MILLIS_PER_DAY,
        //thoi gian bat dau trong thng
        date: (new Date(this.start_time)).getDate()
    }
}

//// Protoptype design pattern
MeetingSchema.methods.clone = function (properties?: any): IFMeeting {
    //phương thúc clone dùng để tạo cuộc họp 
    const clone = new (mongoose.model<IFMeeting>('Meeting', MeetingSchema))({
        ...this,
        ...properties,
        _id: undefined,
        clone_from: this._id
    })
    clone.setTime()
    return clone
}

export const Meeting = mongoose.model<IFMeeting,MeetingModel>('Meeting', MeetingSchema)
