import { Config } from '../config/config';
import { UtilityService } from './utility-service';

const TYPE_WIDTH: number = 5;
const TYPE = {
    DEBUG: 'DEBUG',
    ERROR: 'ERROR',
    INFO: 'INFO',
    WARN: 'WARN'
};

export class ConsoleLoggingService {
    public static debug(message: string): void {
        this.log(message, TYPE.DEBUG);
    }
    public static error(message: string): void {
        this.log(message, TYPE.ERROR);
    }
    public static info(message: string): void {
        this.log(message, TYPE.INFO);
    }
    private static log(message: string, type: string): void {
        // TODO: Process log levels
        const logStamp = UtilityService.getCurrentLogStamp();
        const paddedType = UtilityService.spacePadLeft(type, TYPE_WIDTH);
        console.log(`${logStamp} ${paddedType}: ${message}`);
    }
    public static warn(message: string): void {
        this.log(message, TYPE.WARN);
    }
}