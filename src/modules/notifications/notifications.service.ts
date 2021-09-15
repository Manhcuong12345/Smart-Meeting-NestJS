import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase'
import { RoomsRepository } from '../rooms'
import { NotificationsRepository } from './notifications.repository'
import { IFMeeting } from '../meetings'
import { IFSubscription, Observer } from '../observer'
import { UserRepository } from '../users'


@Injectable()
export class NotificationsService {

    constructor(
        private readonly userRepo: UserRepository,
        private readonly notificationRepo: NotificationsRepository,
        private readonly RoomRepo: RoomsRepository,
        private readonly firebaseService: FirebaseService
    ) { }

    async getAll({ page, limit }: { page?: number, limit?: number }, userId: string) {
        if (!page || page <= 0) {
            page = 1
        }
        if (!limit) {
            limit = 20
        }
        return this.notificationRepo.getAllAndPaging({
            page,
            limit,
            sort: { created_time: -1 }
        }, userId)
    }

    /**chức năng này được sử dụng để gửi thông báo firebase đến thiết bị của thành viên */
    async sendNotificationsToUser(userIds: string[], data) {
        const users = await this.userRepo.findAll({ _id: { $in: userIds } })

        /**Nhận token danh sách từ người dùng và gửi thông báo firebase bằng token đó */
        if (users.length > 0) {
            let tokens = []
            users.forEach(user => {
                //them tkoen moi vao fcm_token ben user
                tokens = tokens.concat(user.fcm_token)
            })
            if (tokens.length > 0) this.firebaseService.sendNotifications(tokens, data)
        }
    }

    /** Handle
     * Chức năng này được sử dụng để tạo thông báo và lưu thông báo vào cơ sở dữ liệu
     * sau đó gửi thông báo firebase đến thiết bị của người dùng
     * Tìm dữ liệu và dữ liệu của user_booked va room, sau đó sử dụng những dữ liệu đó để tạo nội bộ thông báo
     * Vòng lặp id thành viên và tạo dữ liệu thông báo mới
     */
    async createMany(meeting: IFMeeting) {
        const list_notis = []

        const user_booked = await this.userRepo.findById(meeting.user_booked)
        const room = await this.RoomRepo.getById(meeting.room)

        const body = `${user_booked.fullname} invited to join ${meeting.name} at to ${room.name}
        dated ${(new Date(meeting.start_time)).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
         ${(new Date(meeting.start_time)).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
        - ${(new Date(meeting.end_time)).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`
        
        // Dữ liệu để tạo thông báo
        const data = {
            title: 'Meeting',
            body,
            data:{
                //gui id cua meeting cuoc hop do
                meeting_id: meeting._id,
            }
        }
        
        // Gửi tin nhắn firebase đến thiết bị của người dùng
        this.sendNotificationsToUser(meeting.members,data)

        // Tạo dữ liệu thông báo mới và đẩy dữ liệu đó đến list_notis
        meeting.members.forEach(user => {
            list_notis.push({
                ...data,
                user,
                created_time:Date.now()
            })
        })
        //Gui du lieu
        if(list_notis.length > 0){
            await this.notificationRepo.insertMany(list_notis)
        }
    }
    
    async observerNotify({ meeting }: IFSubscription, type?: string){
        if(!type || type === 'Create Meeting')  await this.createMany(meeting);
    }
}
