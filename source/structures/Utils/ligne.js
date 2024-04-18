const fs = require('fs');

const foldersToCount = [
  './source',
  './langue',
  './backup',
  './config',
];

function countLinesInFile(filePath) {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  return fileContents.split('\n').filter((line) => line.trim() !== '').length;
}

function countLinesInFolder(folderPath) {
  const files = fs.readdirSync(folderPath, { withFileTypes: true });

  let totalLines = 0;

  for (const file of files) {
    const filePath = `${folderPath}/${file.name}`;
    if (file.isFile() && (filePath.endsWith('.js') || filePath.endsWith('.json') || filePath.endsWith('.sqlite'))) {
      totalLines += countLinesInFile(filePath);
    } else if (file.isDirectory()) {
      totalLines += countLinesInFolder(filePath);
    }
  }

  return totalLines;
}

function ligne() {
  let totalLines = 0;

  for (const folderPath of foldersToCount) {
    totalLines += countLinesInFolder(folderPath);
  }

  return totalLines;
}

module.exports = {
  ligne,
};