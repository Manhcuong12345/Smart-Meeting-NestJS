import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { IFMeetingType } from '../interface';

const MeetingTypeSchema = new Schema({
    name: {
        type: String
    },
    cestron_action_id: {
        type: String
    },
    description: { 
        type: String 
    },
    created_time: {
        type: Number,
        default: Date.now()
    },
    updated_time: {
        type: Number,
        default: Date.now()
    },
    user_created: {
        type: Schema.Types.ObjectId
    },
    user_updated: {
        type: Schema.Types.ObjectId
    }
});

export const MeetingType = mongoose.model<IFMeetingType>('MeetingType', MeetingTypeSchema);