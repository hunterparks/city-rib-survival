const fs = require('fs');
const helpers = require('./helpers.js');
const path = require('path');
const pino = require('pino');

let _logger = '';

function createLogger(logPath, applicationName) {
    if(!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath, { recursive: true });
    }
    _logger = pino({
        redact: {
            paths: [ 'hostname' ],
            remove: true
        }
    }, path.join(logPath, `${applicationName}_${helpers.getTimestamp()}.log`));
}

function logger() {
    if (_logger === '') {
        throw 'No log object created!';
    }
    return _logger;
}

module.exports = {
    createLogger,
    logger
};
