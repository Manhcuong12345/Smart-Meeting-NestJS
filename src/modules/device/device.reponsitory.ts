import { HttpException, Injectable } from '@nestjs/common';
import { IFResponse, ResponseRepository } from '../response'
import { IFDevice } from './interface'
import { Device } from './model'
import { DeviceDto } from './dto/dto'
import { AbstractSubject } from '../observer'


@Injectable()
export class DeviceRepository extends AbstractSubject {

    constructor(private readonly responsRepo: ResponseRepository) { super() }

    fromEntity(data: any): IFDevice {
        return data
    }

    async create(DeviceData: DeviceDto): Promise<IFDevice> {
        let device = await Device.findOne({ device_name: DeviceData.device_name })
        if (device) throw new HttpException({ error_code: "401", error_message: 'Device is already exist' }, 401)

        device = new Device(DeviceData)
        await device.save()

        return device
    }

    async findAllAndPagging({ page, limit, sort }: { page: number, limit: number, sort?: any }, filter?: any)
        : Promise<IFResponse<IFDevice>> {
        let skip: number = 0
        skip = (page - 1) * limit

        const device: IFDevice[] = await Device.find(filter)
            .skip(skip)
            .limit(+limit)
            .sort(sort)
            .select('-password')
        const totalRecords = await Device.countDocuments(filter)

        return this.responsRepo.getResponse(device, totalRecords, page, limit)
    }

    async findAll(filter?: any): Promise<IFDevice[]> {
        const device = await Device.find(filter)
        return device
    }

    async findById(id: string): Promise<IFDevice> {
        try {
            const device = await Device.findById(id)
            if (!device) throw new HttpException({ error_code: "401", error_message: "Device not found" }, 401)

            return device
        } catch (error) {
            throw new HttpException({ error_code: "401", error_message: "Device not found" }, 401)
        }
    }

    async update(id: string, DeviceData: DeviceDto, option: any): Promise<IFDevice> {
        try {
            let existDevice = await Device.findOne({ _id: { $ne: DeviceData._id }, device_name: DeviceData.device_name })
            if (existDevice) throw new HttpException({ error_code: "401", error_message: "Device is exists" }, 401)

            const device = await Device.findByIdAndUpdate(id, DeviceData, option)
            if (!device) throw new HttpException({ error_code: "401", error_message: "Device not found" }, 401)

            return this.fromEntity(device)
        } catch (error) {
            throw new HttpException({ error_code: "401", error_message: "Device not found" }, 401)
        }
    }

    //c???p nh???p gi?? tr??? thi???t b???
    async updateValue(id: string, { current_value, is_on }: { current_value: number, is_on: boolean })
        : Promise<IFDevice> {
        try {
            const device: IFDevice = await Device.findById(id)
            if (!device) throw new HttpException({ error_code: "401", error_message: "Device not found" }, 401)

            // N???u tr???ng th??i thi???t b??? l?? kh??ng ho???t ?????ng (is_on == false)
            // gi?? tr??? hi???n t???i c???a v??ng nh??? n??y s??? ???????c ??i???u ch???nh th??nh 0 v?? ng?????c l???i
            if (device.device_type === 1) {
                if (is_on === false || current_value === 0) {
                    is_on = false
                    current_value = 0
                }
            }
            //nguoc lai neu thiet bi hoat dong
            device.is_on = is_on
            if (device.device_type === 1 && current_value >= device.min_value && current_value <= device.max_value) {
                device.current_value = current_value
            }
            device.save()

            //gui thong bao tu ceston
            this.notify({ device }, 'Update device value')
        } catch (error) {
            throw new HttpException({ error_code: "401", error_message: "Device not found" }, 401)
        }
        return
    }

    async delete(id: string): Promise<IFDevice> {
        try {
            const device: IFDevice = await Device.findByIdAndDelete(id)
            if (!device) throw new HttpException({ error_code: "401", error_message: "Device not found" }, 401)

            return device
        } catch (error) {
            throw new HttpException({ error_code: "401", error_message: "Device not found" }, 401)
        }
    }

}