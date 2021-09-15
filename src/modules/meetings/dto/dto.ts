import { IsNotEmpty } from 'class-validator'

export class MeetingDto {
    @IsNotEmpty()
    readonly name: string
    readonly document?: string[]
    readonly members: string[]
    readonly description: string
    readonly note: string
    @IsNotEmpty()
    readonly start_time: number
    @IsNotEmpty()
    readonly end_time: number
    readonly number_of_members?: number
    readonly time: {
        start: number
        end: number
        date: number
    }
    readonly remind?: boolean
    readonly repeat?: number
    readonly until_date?: number
    readonly is_clone?: boolean
    readonly clone_from?: string
    readonly day_of_week?: number
    @IsNotEmpty()
    readonly room: string
    user_booked: string
    cestron_meeting_id?: string
    readonly type: string
}