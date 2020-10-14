const execute = require('./execute.js');
const fs = require('fs');
const helpers = require('./helpers.js');
const logger = require('./logger.js').logger();
const message = require('./mcMessage.js');
const path = require('path');

const DEFAULT_BACKUP_TYPE = 'hourly';

function backup() {
    const backupPath = path.join(process.env.ROOT_BACKUP_PATH, DEFAULT_BACKUP_TYPE);
    if (!fs.existsSync(backupPath)) {
        logger.warning(`Backup folder created -> ${backupPath}`);
        fs.mkdirSync(backupPath, { recursive: true });
        execute.linuxCommand(`chown -R ${process.env.USER_NAME}.${process.env.USER_NAME} ${process.env.ROOT_BACKUP_PATH}`);
    }
    message.players('Starting backup...');
    execute.mcCommand('save-off'); // Disable world auto-saving
    const start = new Date().getUTCMilliseconds() / 1000.0;
    const archivePath = `${path.join(backupPath, helpers.getTimestamp())}.tar.gz`;
    execute.userCommand(`tar -czf ${archivePath} -C ${process.env.MC_SERVER_ROOT} ${process.env.MC_WORLD_NAME}`, process.env.USER_NAME);
    const end = new Date().getUTCMilliseconds() / 1000.0;
    execute.mcCommand('save-on'); // Re-enable world auto-saving
    execute.mcCommand('save-all');

    // Backup Statistics
    const delta = end - start;
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
}

module.exports = {
    backup
};
