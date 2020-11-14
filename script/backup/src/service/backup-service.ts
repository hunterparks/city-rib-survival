import { Config } from '../config/config';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'minecraft-server-util';

const BACKUP_INTERVAL = {
    HOURLY: 'hourly',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly'
};
const BACKUP_RETENTION = {
    HOURLY: 24,
    DAILY: 7,
    WEEKLY: 4,
    MONTHLY: 0
};

export class BackupService {
    public async backup(): Promise<void> {
        try {
            await util.status(Config.MC_SERVER_URL);
            const backupPath = path.join(Config.ROOT_BACKUP_PATH, BACKUP_INTERVAL.HOURLY);
            this.createDirectory(backupPath);
        }
        finally {
            // Why is this expected???
        }
    }
    private createDirectory(dirPath: string): void {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            // logger.warn(`Folder created -> ${dirPath}`);
        }
    }
    private isDaily(): boolean {
        return new Date().getHours() === 0; // Midnight
    }
    private isMontly(): boolean {
        return this.isDaily() && new Date().getDate() === 1; // Midnight and First of Month
    }
    private isWeekly() {
        return this.isDaily() && new Date().getDay() === 0; // Midnight and Sunday
    }
}