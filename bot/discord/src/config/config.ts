import * as dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../.env` });

export class Config {
    public static readonly BOT_ENV = process.env.BOT_ENV;
    public static readonly BOT_NAME = process.env.BOT_NAME;
    public static readonly BOT_TOKEN = process.env.BOT_TOKEN;
    public static readonly CHANNEL = {
        General: process.env.CHANNEL_ID_GENERAL as string,
        RibCityBot: process.env.CHANNEL_ID_RIB_CITY_BOT as string,
        Locations: process.env.CHANNEL_ID_LOCATIONS as string,
        ServerStatus: process.env.CHANNEL_ID_SERVER_STATUS as string
    };
    public static readonly COMMAND_LOCATION = process.env.COMMAND_LOCATION as string;
    public static readonly COMMAND_PREFIX = process.env.COMMAND_PREFIX as string;
    public static readonly LOG_LEVEL = process.env.LOG_LEVEL as string || 'INFO';
    public static readonly VERSION  = process.env.VERSION as string;
}