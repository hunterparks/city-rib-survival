const childProcess = require('child_process');
const logger = require('./logger.js').logger();

function command(command) {
    if (process.env.DEBUG) {
        logger.info(`Command -> ${command}`);
    }
    try {
        let buffer = childProcess.execSync(command);
        logger.info(buffer);
    }
    catch (ex) {
        logger.error(ex);
    }
}

function mcCommand(command) {
    userCommand(`screen -p 0 -S ${process.env.MC_SCREEN} -X stuff "${command}^M"`, process.env.MC_USER);
}

function userCommand(command, username) {
    command(`sudo -u ${username} ${command}`);
}

module.exports = {
    command,
    mcCommand,
    userCommand
};
