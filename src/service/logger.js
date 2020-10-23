const fs = require('fs');
const helpers = require('./helpers.js');
const path = require('path');
const pino = require('pino');

let _logger = '';
let _logPath = '';

function createLogger(logPath, applicationName) {
    if(!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath, { recursive: true });
    }
    _logger = pino({
        redact: {
            paths: [ 'hostname' ],
            remove: true
        }
    }, getLogPath(logPath, applicationName));
}

function getLogPath(logPath = null, applicationName = null) {
    if (_logPath === '' && (logPath === null || applicationName === null)) {
        throw 'Unable to generate log path!';
    } else if (_logPath === '') {
        _logPath = path.join(logPath, `${applicationName}_${helpers.getTimestamp()}.log`);
    }
    return _logPath;
}

function logger() {
    if (_logger === '') {
        throw 'No log object created!';
    }
    return _logger;
}

module.exports = {
    createLogger,
    getLogPath,
    logger
};
