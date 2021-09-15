import { Document } from "mongoose";

export interface IFMeetingType extends Document {
    readonly _id: string;
    name: string;
    cestron_action_id: string;
    description: string;
    user_created: string;
    user_updated: string;
    created_time: number;
    updated_time: number;
}