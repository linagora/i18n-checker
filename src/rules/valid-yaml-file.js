const q = require('q');
const fs = require('fs');
const yaml = require('js-yaml');
const utils = require('../utils');

function check(options) {
  const { baseDir, dirs, verifyOptions } = options;
  const { locales, fileType } = verifyOptions;

  const availableFilesPromises = [
    ...dirs.map(dir => utils.getAvailableLocaleFilesInDir(baseDir, dir.localeDir, locales, fileType))
  ];

  return q.all(availableFilesPromises)
    .then(files => [].concat(...files))
    .then(files => files.map(filePath => validateYamlFile(baseDir, filePath)))
    .then(reports => reports.filter(Boolean));
}

function validateYamlFile(baseDir, filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  let errorMessage = false;

  try {
    yaml.safeLoad(fileContent);
  } catch (error) {
    const lineNumber = error.message.match(/line (\d+)/)[1];
    errorMessage = `Failed to load the Yaml file "${filePath}:${lineNumber}" > ${error.message}`;
  }

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
