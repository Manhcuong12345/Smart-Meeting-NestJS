//Đây là nơi dùng obser để thiết lập cho việc gửi thông báo này nọ
import {IFRoom} from '../../rooms'
import {IFDevice} from '../../device'
import {IFMeeting} from '../../meetings'

//Day la noi cau hinh du lieu duoc gui di

export interface IFSubscription {
    meeting?:IFMeeting,
    room?:IFRoom,
    device?:IFDevice,
}

//Day la noi cau hinh

export interface Subject {
     // Attach an observer to the subject.
     //Gắn một người quan sát vào chủ đề.
     attach(observer: Observer): void;

     // Detach an observer from the subject.
     //Tach một người quan sát vào chủ đề.
     detach(observer: Observer): void;
 
     // Notify all observers about an event.
     /// Thông báo cho tất cả các quan sát viên về một sự kiện.
     notify(object:IFSubscription,type?:string): void;
}

/**
 * The Observer interface declares the update method, used by subjects.
 * //phuong phap cap nhat thong bao
 */
export interface Observer {
    // Receive update from subject.
    //Nhận cập nhật từ chủ đề.
    observerNotify(object: IFSubscription,type?:string):void;
}