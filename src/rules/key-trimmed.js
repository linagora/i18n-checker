const q = require('q');
const path = require('path');
const utils = require('../utils');

function check(options) {
  const { baseDir, dirs, verifyOptions } = options;
  const { defaultLocale, fileType } = verifyOptions;
  const defaultLocaleFile = `${defaultLocale}.${fileType}`;

  const reports = dirs
    .map(dir => dir.localeDir)
    .map(localeDir => path.join(baseDir, localeDir, defaultLocaleFile))
    .map((filePath) => {
      const keys = utils.getKeysInFile(filePath);
      const messages = [];

      keys.forEach((key) => {
        if (/^\s+/.test(key) || /\s+$/.test(key)) {
          messages.push({
            severity: 2,
            message: `unexpected leading/trailing space in key: '${key}'`
          });
        }
      });

      if (messages.length) {
        return { filePath, messages };
      }
    })
    .filter(Boolean);


  return q([].concat(...reports));
}

module.exports = check;
