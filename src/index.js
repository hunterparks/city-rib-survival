require('dotenv').config();
const logger = require('./service/logger.js');
const path = require('path');


const MODES = {
    BACKUP: 'backup'
};

const mode = process.argv[2];

if (mode === MODES.BACKUP) {
    logger.createLogger(path.join(process.env.ROOT_LOG_PATH, mode), 'minecraft-backup');
    const backupService = require('./service/backup.js');
    backupService.testModule();
} else {
    console.error(`Invalid mode -> ${mode}`);
}
