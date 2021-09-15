import { Controller } from '@nestjs/common';
import { IFResponse, ResponseRepository } from '../response'
import { IFNotification, NotificationClass } from './interface'
import { Notification } from './model'


@Controller('notifications')
export class NotificationsRepository {

    constructor(private readonly responsRepo: ResponseRepository) { }

    //Them va tao thong bao,khong co Promise vai khong co IF
    async create(notificationData: any) {
        const notification = new Notification(notificationData)
        await notification.save()
        return notification
    }

    //them du lieu thong bao vao database
    async insertMany(notificationData: any[]) {
        await Notification.create(notificationData)
    }

    //lay ra toan bo thong bao de gui
    async getAllAndPaging({ page, limit, sort }: { page: number, limit: number, sort?: any }, filter?: any)
        : Promise<IFResponse<IFNotification>> {
        let skip: number = 0
        skip = (page - 1) * limit

        let notification = await Notification.find(filter)
            .skip(skip)
            .limit(+limit)
            .sort(sort)
        const totalRecords = await Notification.countDocuments(filter)

        return this.responsRepo.getResponse<IFNotification>(notification, totalRecords, page, limit)
    }
}
