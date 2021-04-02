const q = require('q');
const utils = require('../utils');

function check(options) {
  const { baseDir, dirs, verifyOptions } = options;
  const { locales, fileType } = verifyOptions;

  const availableFilesPromises = [
    ...dirs.map(dir => utils.getAvailableLocaleFilesInDir(baseDir, dir.localeDir, locales, fileType))
  ];

  return q.all(availableFilesPromises)
    .then(files => [].concat(...files))
    .then(files => files.map(filePath => validateFile(filePath)))
    .then(reports => reports.filter(Boolean));
}

function validateFile(filePath) {
  const keys = utils.getKeysInFile(filePath);
  const sortedKeys = keys.slice().sort();

  const errorMessages = [];
  Object.keys(sortedKeys).forEach((i) => {
    if (sortedKeys[i] !== keys[i]) {
      errorMessages.push(`Expected '${sortedKeys[i]}' at index ${i} but found '${keys[i]}'`);
    }
  });

  if (errorMessages.length) {
    return {
      filePath,
      messages: errorMessages.map((errorMessage) => {
        return {
          severity: 2,
          message: errorMessage
        };
      })
    };
  }
}


module.exports = check;
