import * as mongoose from "mongoose"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import { Schema } from 'mongoose'
import { IFUser } from "../interface"

export const UserSchema = new Schema<IFUser>({
    fullname: {
        type: String
    },
    avatar: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    password: {
        type: String
    },
    phone_number: {
        type: String
    },
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: "Role"
        }
    ],
    gender: {
        type: String
    },
    birthdate: {
        type: Number
    },
    admin: {
        type: Boolean,
        default: false
    },
    status: {
        type: String
    },
    fcm_token: [
        {
            type: String
        }
    ],
    created_time: {
        type: Number,
        default: Date.now(),
        immutable: true
    }
})

UserSchema.methods.generateToken = function (): string {
    return jwt.sign({
        _id: this._id, admin: this.admin, roles: this.roles
    }, '1234qwer!@#$')
}

UserSchema.methods.hashPassword = async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
}

UserSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model<IFUser>('User',UserSchema)