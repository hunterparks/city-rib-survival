const childProcess = require('child_process');
const logger = require('./logger.js').logger();
const util = require('minecraft-server-util');

const rcon = new util.RCON(process.env.MC_SERVER_URL, { port: 25575, password: process.env.MC_RCON_PASSWORD });

function linuxCommand(command) {
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

async function mcCommand(command) {
    if (process.env.USE_SCREEN) {
        userCommand(`screen -p 0 -S ${process.env.MC_SCREEN} -X stuff "${command}^M"`, process.env.MC_USER);
    } else {
        await rcon.connect();
        await rcon.run(command);
        await rcon.close();
    }
}

function userCommand(command, username) {
    linuxCommand(`sudo -u ${username} ${command}`);
}

module.exports = {
    linuxCommand,
    mcCommand,
    userCommand
};
