import {Document, Model} from 'mongoose'

export interface IFMeeting extends Document,IFMeetingDoc {
  _id:string
  name:string
  document?:string[]
  members:string[]
  description:string
  note:string
  start_time:number
  end_time:number
  time:{
      start:number
      end:number
      date:number
  }
  remind?:boolean
  repeat?:number
  number_of_members?:number
  until_date?:number
  is_clone?:boolean
  clone_from?:string
  day_of_week?:number
  room:string
  user_booked:string
  cestron_meeting_id?:string
  type:string
  created_time:number
  updated_time:number
  user_created:string
  user_updated:string
}

export interface IFMeetingDoc{
  clone(properties?:any):IFMeeting
  setTime():void
}

export interface MeetingModel extends Model<IFMeeting>{
  findAndGroupByDate(filter?:Object):Array<IFMeeting[]>
}