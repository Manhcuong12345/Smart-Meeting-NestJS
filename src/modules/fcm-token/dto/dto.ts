import { IsNotEmpty } from 'class-validator';

export class FcmTokenDto {

    // @IsString()
    // @IsNotEmpty()
    fcm_token: string;

}