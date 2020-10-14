const fs = require('fs');
const path = require('path');

let cachedTimestamp = '';

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach((file) => {
        if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
            arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, file));
        }
    });
    return arrayOfFiles;
}

function getTimestamp() {
    if (cachedTimestamp === '') {
        cachedTimestamp = new Date()
            .toISOString()
            .replace(/T/g, '_')
            .replace(/:/g, '-')
            .slice(0, -5);
    }
    return cachedTimestamp;
}

function getTotalSize(dirPath) {
    const arrayOfFiles = getAllFiles(dirPath);
    let totalSize = 0;
    arrayOfFiles.forEach((filePath) => {
        totalSize += fs.statSync(filePath).size;
    });
    return totalSize;
}

module.exports = {
    getTimestamp,
    getTotalSize
};
