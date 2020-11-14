require('dotenv').config();
const logger = require('./service/logger.js');
const path = require('path');

const RUN_MODE = {
    BOT: 'bot'
};

const mode = process.argv[2];

if (mode === RUN_MODE.BOT) {
    // TODO: Bot
    require('./discord/index.js');
    return 0;
}

console.log('goodbye');
return 0;


logger.createLogger(path.join(process.env.ROOT_LOG_PATH, 'backup'), 'minecraft-backup');
const backupService = require('./service/backup.js');
backupService.backup();

return 0;


//const http = require('http');
//
//const PORT = process.env.PORT || 8080;
//
//const server = http.createServer((req, res) => {
//    if (req.url.startsWith('/api/v1/')) {
//        const apiUrl = req.url.slice(8, req.url.length);
//        if (apiUrl.match(/backup/)) {
//            res.statusCode = 200;
//            res.end();
//        } else if (apiUrl.match(/testTask/)) {
//            res.statusCode = 200;
//            //res.writeHead(200, { 'Content'})
//            //res.end();
//        } else {
//            res.writeHead(400, { 'Content-Type': 'application/json' });
//            res.end(JSON.stringify({ message: `Invalid URL requested -> '${req.url}'`}));
//        }
//    } else {
//        res.writeHead(400, { 'Content-Type': 'application/json' });
//        res.end(JSON.stringify({ message: `Invalid URL requested -> '${req.url}'` }));
//    }
//});

// server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// return 0;

//const logger = require('./service/logger.js');
//const path = require('path');
//
//
//const MODES = {
//    BACKUP: 'backup'
//};
//
//const mode = process.argv[2];
//
//if (mode === MODES.BACKUP) {
//    logger.createLogger(path.join(process.env.ROOT_LOG_PATH, mode), 'minecraft-backup');
//    const backupService = require('./service/backup.js');
//    backupService.backup();
//} else {
//    console.error(`Invalid mode -> ${mode}`);
//}
