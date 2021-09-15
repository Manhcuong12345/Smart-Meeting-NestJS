import * as mongoose from "mongoose"
import {DATABASE_CONNECTON} from "./database.constants"
import config from "../config/config"

/** UseFactoryL Cú pháp useFactory cho phép tạo động các nhà cung cấp. 
 * Nhà cung cấp thực tế sẽ được cung cấp bởi giá trị trả về từ một chức năng của nhà máy. */

export const databaseProviders = [
    {
        provide: DATABASE_CONNECTON,
        useFactory:async() =>{
            try{
                await mongoose.connect(config.connectionString)
                console.log('connect successful to', config.connectionString);
                const db = mongoose.connection;

                db.on('close', () => { console.log('-> lost connection'); });
                // The driver tries to automatically reconnect by default, so when the
                // server starts the driver will reconnect and emit a 'reconnect' event.
                db.on('reconnect', () => { console.log('-> reconnected'); });
                db.on('error', () => { console.log('-> error connection'); });
                db.on('reconnectFailed', async () => {
                    console.log('-> gave up reconnecting');
                });
            }catch(error){
                console.log('connect unsucessful!!!!', error);
            }
        }
    }
]