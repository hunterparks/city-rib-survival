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

function pruneDirectory(dirPath, backupsToKeep) {
    const files = fs.readdirSync(dirPath);
    if (backupsToKeep === 0 || files.length <= backupsToKeep) return; // No pruning needed
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
    getTimestamp,
    getTotalSize,
    pruneDirectory
};
