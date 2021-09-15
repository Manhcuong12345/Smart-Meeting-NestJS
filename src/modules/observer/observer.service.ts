
import { IFSubscription,Observer,Subject } from './interface';


export class AbstractSubject implements Subject{

    /**
     * @type {Observer[]} List of subscribers. In real life, the list of
     * subscribers can be stored more comprehensively (categorized by event
     * type, etc.).
     * Danh sách người đăng ký. Trong cuộc sống thực, danh sách
     * người đăng ký có thể được lưu trữ toàn diện hơn (được phân loại theo sự kiện
     * loại, v.v.).
     */
     private observers: Observer[] = [];

    /**
     * The subscription management methods.
     *  Các phương thức quản lý đăng ký.
     */
     public attach(observer: Observer): void {
        const isExist = this.observers.includes(observer);
        if (isExist) {
            return console.log('Subject: Observer has been attached already.');
        }

        console.log('Subject: Attached an observer.');
        this.observers.push(observer);
    }

    public detach(observer: Observer): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            return console.log('Subject: Nonexistent observer.');
        }

        this.observers.splice(observerIndex, 1);
        console.log('Subject: Detached an observer.');
    }

    /**
     * Trigger an update in each subscriber.
     * Kích hoạt bản cập nhật trong mỗi người đăng ký.
     */
    public notify(object:IFSubscription,type?:string): void {
        console.log('Subject: Notifying observers...');
        for (const observer of this.observers) {
            observer.observerNotify(object,type);
        }
    }
}
