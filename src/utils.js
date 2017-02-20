const fs = require('fs');
const q = require('q');
const path = require('path');

function listFilesInDir(dirPath) {
  try {
    return fs.readdirSync(dirPath);
  } catch (err) {
    return [];
  }
}

function readJsonFile(filePath) {
  try {
    return require(filePath) || {};
  } catch (err) {
    return {};
  }
}

function getAvailableLocaleFilesInDir(baseDir, dir, locales) {
  const fsAccess = q.denodeify(fs.access);
  const requiredFiles = locales.map((locale) => {
    const fileName = `${locale}.json`;

    return path.join(baseDir, dir, fileName);
  });
  const promises = requiredFiles.map((filePath) => {
    return fsAccess(filePath, fs.constants.R_OK)
      .then(() => filePath)
      .catch(() => null);
  });

  return q.all(promises).then(files => files.filter(Boolean));
}

/**
 * Remove baseDir from filePath
 */
function qualifyFilePath(baseDir, filePath) {
  if (filePath.indexOf(baseDir) === 0) {
    return filePath.replace(baseDir, '').replace(/^\//, '');
  }

  return filePath;
}

module.exports = {
  listFilesInDir,
  readJsonFile,
  getAvailableLocaleFilesInDir,
  qualifyFilePath
};
