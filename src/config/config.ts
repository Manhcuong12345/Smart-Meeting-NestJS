import * as dotenv from 'dotenv'
dotenv.config()

const node_env:string = process.env.NODE_ENV

//Su dung singoleton mau thiet ke
class ConfigSingleton {

    private static instance:ConfigSingleton

    readonly development = {
        jwtKey: process.env.JWT_KEY,
        connectionString: process.env.CONNECTION_STRING,
        connectionStringProd: process.env.CONNECTION_STRING_PROD,
        // mailAddress: process.env.MAIL_ADDRESS,
        // mailPassword: process.env.MAIL_PASSWORD,
        // thingworxHost: process.env.THINGWORX_HOST,
        // thingworxAppKey: process.env.THINGWORX_APP_KEY,
        // firebaseURL: process.env.FIREBASE_URL,
        // firebaseToken: process.env.FIREBASE_TOKEN
    }

    readonly production ={
        jwtKey: process.env.JWT_KEY,
        connectionString: process.env.CONNECTION_STRING,
        connectionStringProd: process.env.CONNECTION_STRING_PROD,
        mailAddress: process.env.MAIL_ADDRESS,
        mailPassword: process.env.MAIL_PASSWORD,
        thingworxHost: process.env.THINGWORX_HOST,
        thingworxAppKey: process.env.THINGWORX_APP_KEY,
        firebaseURL: process.env.FIREBASE_URL,
        firebaseToken: process.env.FIREBASE_TOKEN
    }
    
    //muon dung duoc thi khai bao instance de su dung va sau la doan code cuar huong dan
    public static getInstance():ConfigSingleton {
        if(!ConfigSingleton.instance){
            ConfigSingleton.instance = new ConfigSingleton
        }
        return ConfigSingleton.instance
    }
}

export default ConfigSingleton.getInstance()[node_env]