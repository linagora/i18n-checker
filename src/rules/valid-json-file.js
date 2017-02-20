const q = require('q');
const fs = require('fs');
const jsonValidator = require('json-dup-key-validator');
const utils = require('../utils');

function check(options) {
  const { baseDir, dirs, verifyOptions } = options;
  const { locales } = verifyOptions;

  const availableFilesPromises = [
    ...dirs.map(dir => utils.getAvailableLocaleFilesInDir(baseDir, dir.localeDir, locales))
  ];

  return q.all(availableFilesPromises)
    .then(files => [].concat(...files))
    .then(files => files.map(filePath => validateJsonFile(baseDir, filePath)))
    .then(reports => reports.filter(Boolean));
}

function validateJsonFile(baseDir, filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const allowDuplicatedKeys = false;
  const errorMessage = jsonValidator.validate(fileContent, allowDuplicatedKeys);

  if (errorMessage) {
    return {
      filePath,
      messages: [{
        severity: 2,
        message: errorMessage
      }]
    };
  }
}

module.exports = check;
