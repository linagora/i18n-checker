const q = require('q');
const path = require('path');
const utils = require('../utils');

function check(options) {
  const { baseDir, dirs, verifyOptions } = options;
  const { locales, fileType } = verifyOptions;

  const requiredFiles = locales.map(locale => `${locale}.${fileType}`);
  const reports = [
    ...dirs.map(dir => checkDir(baseDir, dir.localeDir, requiredFiles))
  ];

  return q([].concat(...reports));
}

function checkDir(baseDir, dir, requiredFiles) {
  const filesInDir = utils.listFilesInDir(path.join(baseDir, dir));

  return requiredFiles.map((requiredFile) => {
    if (filesInDir.indexOf(requiredFile) === -1) {
      const filePath = path.join(dir, requiredFile);

      return {
        filePath,
        messages: [{
          severity: 2,
          message: 'file not found'
        }]
      };
    }
  }).filter(Boolean);
}

module.exports = check;
