const path = require('path');
const q = require('q');
const utils = require('../utils');

function check(options) {
  const { baseDir, dirs, verifyOptions } = options;
  const { defaultLocale } = verifyOptions;
  const defaultLocaleFile = `${defaultLocale}.json`;

  const moduleDirs = dirs.filter(dir => !dir.core).map(dir => dir.localeDir);
  const moduleLocaleFiles = moduleDirs.map(moduleDir => path.join(baseDir, moduleDir, defaultLocaleFile));
  const keys = {};


  moduleLocaleFiles.forEach((filePath) => {
    const moduleLocaleContent = utils.readJsonFile(filePath);
    const moduleLocaleKeys = Object.keys(moduleLocaleContent);

    moduleLocaleKeys.forEach((key) => {
      if (!keys[key]) {
        keys[key] = [];
      }

      keys[key].push(filePath);
    });
  });

  const filesContainDuplicateKeys = {};

  Object.keys(keys).forEach((key) => {
    const filesContainKey = keys[key];

    if (filesContainKey.length > 1) {
      // more than one file contain the same key
      filesContainKey.forEach((filePath) => {
        if (!filesContainDuplicateKeys[filePath]) {
          filesContainDuplicateKeys[filePath] = [];
        }

        filesContainDuplicateKeys[filePath].push(key);
      });
    }
  });

  const reports = Object.keys(filesContainDuplicateKeys).map((filePath) => {
    const messages = filesContainDuplicateKeys[filePath].map(key => ({
      severity: 2,
      message: `key exists in other modules: '${key}'`
    }));

    return {
      filePath,
      messages
    };
  });

  return q(reports);
}

module.exports = check;
