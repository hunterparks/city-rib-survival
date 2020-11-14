import * as dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../.env`});

export class Config {
    public static readonly BOT_NAME = 'Rib City Bot';
    public static readonly DEBUG = process.env.DEBUG;
    public static readonly MC_RCON_PASSWORD = process.env.MC_RCON_PASSWORD as string;
    public static readonly MC_SCREEN = 'minecraft';
    public static readonly MC_SERVER_ROOT = process.env.MC_SERVER_ROOT as string;
    public static readonly MC_SERVER_URL = process.env.MC_SERVER_URL as string;
    public static readonly MC_USER = 'minecraft';
    public static readonly ROOT_BACKUP_PATH = process.env.ROOT_BACKUP_PATH as string;
    public static readonly USE_SCREEN = false;
}