const execute = require('./execute.js');
const helpers = require('./helpers.js');
const fs = require('fs');
const logger = require('./logger.js').logger();
const message = require('./mcMessage.js');
const path = require('path');
const util = require('minecraft-server-util');

const BACKUP_INTERVAL = {
    HOURLY: 'hourly',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly'
};
const BACKUP_RETENTION = {
    HOURLY: 6,
    DAILY: 2,
    WEEKLY: 4,
    MONTHLY: 0
};

async function backup() {
    try {
        await util.status(process.env.MC_SERVER_URL);
        const backupPath = path.join(process.env.ROOT_BACKUP_PATH, BACKUP_INTERVAL.HOURLY);
        createDirectory(backupPath);
        message.players('Starting backup...');
        await execute.mcCommand('save-off');
        await execute.mcCommand('save-off'); // Disable world auto-saving
        const start = new Date().getTime();
        const archiveName = `${helpers.getTimestamp()}.tar.gz`;
        const archivePath = path.join(backupPath, archiveName);
        execute.linuxCommand(`tar -czf ${archivePath} -C ${process.env.MC_SERVER_ROOT} ${process.env.MC_WORLD_NAME}`);
        const end = new Date().getTime();
        await execute.mcCommand('save-on'); // Re-enable world auto-saving
        await execute.mcCommand('save-all');
        // Backup Statistics
        const delta = (end - start) / 1000;
        const worldSizeBytes = (helpers.getTotalSize(path.join(process.env.MC_SERVER_ROOT, process.env.MC_WORLD_NAME)));
        const archiveSizeBytes = (fs.statSync(archivePath).size);
        const archiveSize = (archiveSizeBytes / 1e6);
        const backupDirectorySize = helpers.getTotalSize(backupPath) / 1e6;
        const compressionAmount = (archiveSizeBytes * 100) / worldSizeBytes;
        if (process.env.DEBUG) {
            logger.info(`Backup Duration -> ${delta.toFixed(2)} seconds`);
            logger.info(`World Folder Size -> ${worldSizeBytes.toFixed(2)} bytes`);
            logger.info(`Archive Size -> ${archiveSizeBytes.toFixed(2)} bytes (${archiveSize.toFixed(2)} megabytes)`);
            logger.info(`Backup Folder Size -> ${backupDirectorySize.toFixed(2)} megabytes`);
            logger.info(`Compression Amount -> ${compressionAmount.toFixed(2)}%`);
        }
        if (archiveSize > 0) {
            message.playersSuccess(
                'Backup complete!',
                `Took ${delta.toFixed(2)} s, ${archiveSize.toFixed(2)}M/${backupDirectorySize.toFixed(2)}M, ${compressionAmount.toFixed(2)}%`);
        } else {
            message.playersError('Backup was not saved!', 'Please notify an administrator!');
        }
        pruneDirectory(backupPath, BACKUP_RETENTION.HOURLY);
        if (isDaily()) {
            const dailyBackupPath = path.join(process.env.ROOT_BACKUP_PATH, BACKUP_INTERVAL.DAILY);
            createDirectory(dailyBackupPath);
            fs.copyFileSync(archivePath, path.join(dailyBackupPath, archiveName));
            pruneDirectory(dailyBackupPath, BACKUP_RETENTION.DAILY);
        }
        if (isWeekly()) {
            const weeklyBackupPath = path.join(process.env.ROOT_BACKUP_PATH, BACKUP_INTERVAL.WEEKLY);
            createDirectory(weeklyBackupPath);
            fs.copyFileSync(archivePath, path.join(weeklyBackupPath, archiveName));
            pruneDirectory(weeklyBackupPath, BACKUP_RETENTION.WEEKLY);
        }
        if (isMonthly()) {
            const monthlyBackupPath = path.join(process.env.ROOT_BACKUP_PATH, BACKUP_INTERVAL.MONTHLY);
            createDirectory(monthlyBackupPath);
            fs.copyFileSync(archivePath, path.join(monthlyBackupPath, archiveName));
            pruneDirectory(monthlyBackupPath, BACKUP_RETENTION.MONTHLY);
        }
        // TODO: Prune logs?
    }
    catch (ex) {
        logger.error(ex);
    }
}

function createDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        logger.warn(`Folder created -> ${dirPath}`);
    }
}

function isDaily() {
    return new Date().getHours() === 0; // Midnight
}

function isMonthly() {
    return isDaily() && new Date().getDate() === 1; // Midnight and First of Month
}

function isWeekly() {
    return isDaily() && new Date().getDay() === 0; // Midnight and Sunday
}

function pruneDirectory(dirPath, backupsToKeep) {
    const files = fs.readdirSync(dirPath);
    if (files.length <= backupsToKeep) return; // No pruning needed
    const numberOfFilesToDelete = files.length - backupsToKeep;
    console.log(numberOfFilesToDelete);
    let filesAndSizes = {};
    files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        filesAndSizes[filePath] = fs.statSync(filePath).birthtimeMs;
    });
    let items = Object.keys(filesAndSizes)
        .map((key) => [key, filesAndSizes[key]])
        .sort((first, second) =>  first[1] - second[1]);
    items.slice(0, numberOfFilesToDelete)
        .forEach((file) => {
            const fileToDelete = file[0];
            fs.unlinkSync(fileToDelete);
        });
}

module.exports = {
    backup
};
