import { UtilityService } from './utility-service';

const TYPE_WIDTH: number = 5;
const TYPE = {
    DEBUG: 'DEBUG',
    ERROR: 'ERROR',
    INFO: 'INFO',
    WARN: 'WARN'
};

export class ConsoleLoggingService {
    public static debug(message: string, additionalLines: string[] = []): void {
        this.log(message, additionalLines, TYPE.DEBUG);
    }
    public static error(message: string, additionalLines: string[] = []): void {
        this.log(message, additionalLines, TYPE.ERROR);
    }
    public static info(message: string, additionalLines: string[] = []): void {
        this.log(message, additionalLines, TYPE.INFO);
    }
    private static log(message: string, additionalLines: string[], type: string): void {
        // TODO: Process log levels
        const logStamp = UtilityService.getCurrentLogStamp();
        const paddedType = UtilityService.spacePadLeft(type, TYPE_WIDTH);
        const dateTimeInfoLength = `${logStamp} ${paddedType}: `.length;
        let lines = [
            `${logStamp} ${paddedType}: ${message}`
        ];
        for(const line of additionalLines) {
            lines.push(`${new Array(dateTimeInfoLength).fill(' ').join('')}${line}`);
        }
        console.log(lines.join('\n'));
    }
    public static warn(message: string, additionalLines: string[] = []): void {
        this.log(message, additionalLines, TYPE.WARN);
    }
}