const q = require('q');
const _ = require('lodash');
const utils = require('../utils');

function check(options) {
  const { baseDir, dirs, verifyOptions } = options;
  const { locales, defaultLocale, fileType } = verifyOptions;

  const availableFilesPromises = [
    ...dirs.map(dir => utils.getAvailableLocaleFilesInDir(baseDir, dir.localeDir, locales, fileType))
  ];

  return q.all(availableFilesPromises)
    .then(folders => folders.map(filesInFolder => validate(filesInFolder, fileType, defaultLocale)))
    .then(report => [].concat(...report))
    .then(reports => reports.filter(Boolean));
}

function validate(files, fileType, defaultLocale) {
  const defaultLocaleFile = _.find(files, file => _.endsWith(file, `${defaultLocale}.${fileType}`));
  const otherLocaleFiles = files.filter(file => (file !== defaultLocaleFile));

  const defaultLocaleContent = utils.readFile(defaultLocaleFile);
  const defaultLocaleKeys = Object.keys(defaultLocaleContent);

  return otherLocaleFiles.map((filePath) => {
    const otherLocaleContent = utils.readFile(filePath);
    const otherLocaleKeys = Object.keys(otherLocaleContent);
    const messages = [];

    // check if keys in default locale file are all translated in other locale
    defaultLocaleKeys.forEach((key) => {
      if (otherLocaleKeys.indexOf(key) === -1) {
        messages.push({
          severity: 2,
          message: `key missing: '${key}'`
        });
      }
    });

    // check if there is unused key in other locale
    otherLocaleKeys.forEach((key) => {
      if (defaultLocaleKeys.indexOf(key) === -1) {
        messages.push({
          severity: 2,
          message: `unexpected key: '${key}'`
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
}

module.exports = check;
