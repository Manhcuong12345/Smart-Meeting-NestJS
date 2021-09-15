import { Module,forwardRef } from '@nestjs/common';
import { CestronService } from './cestron.service';
import {RoomsModule} from '../rooms'
import {CestronRepository} from './cestron.repository'
import {MeetingTypeModule} from '../meeting-type'

@Module({
    imports: [MeetingTypeModule,forwardRef(() => RoomsModule)],
    providers: [CestronService,CestronRepository],
    exports: [CestronService,CestronRepository]
})
export class CestronModule {}
