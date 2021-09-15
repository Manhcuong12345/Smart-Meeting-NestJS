import { Document, Schema,QueryOptions } from 'mongoose'

//tach IFUserDoc ra de dunf cho phan rieng
export interface IFUser extends Document, IFUserDoc {
  _id: string,
  avatar: string,
  fullname: string,
  email: string,
  phone_number: string,
  password: string,
  address: string,
  roles: string[]
  admin: boolean,
  birthdate: number,
  gender: string,
  status: string,
  created_time: number,
  fcm_token: string[]
}

//thiet lap interface khai bao kieu du lieu dung chung de ma hoa token voi password
export interface IFUserDoc {
  hashPassword(): void,
  comparePassword(password: string): boolean,
  generateToken(): string
}
