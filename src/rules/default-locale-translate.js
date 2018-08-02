const path = require('path');
const q = require('q');
const utils = require('../utils');

function check(options) {
  const { baseDir, dirs, verifyOptions } = options;
  const { defaultLocale, fileType } = verifyOptions;

  const defaultLocaleFiles = dirs.map(dir => path.join(baseDir, dir.localeDir, `${defaultLocale}.${fileType}`));

  const reports = defaultLocaleFiles.map((filePath) => {
    const localeContent = utils.readFile(filePath);
    const messages = [];

    Object.keys(localeContent).forEach((key) => {
      const value = localeContent[key];

      if (key !== value) {
        messages.push({
          severity: 2,
          message: `key is not equal value: '${key}'`
        });
      }
    });

    if (messages.length) {
      return {
        filePath,
        messages
      };
    }
  }).filter(Boolean);

  return q(reports);
}

module.exports = check;
