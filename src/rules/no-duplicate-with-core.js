const path = require('path');
const q = require('q');
const utils = require('../utils');

function check(options) {
  const { baseDir, dirs, verifyOptions } = options;
  const { defaultLocale, fileType } = verifyOptions;
  const defaultLocaleFile = `${defaultLocale}.${fileType}`;

  const coreDir = dirs.filter(dir => dir.core)[0].localeDir;
  const moduleDirs = dirs.filter(dir => !dir.core).map(dir => dir.localeDir);

  const coreLocaleFile = path.join(baseDir, coreDir, defaultLocaleFile);
  const moduleLocaleFiles = moduleDirs.map(moduleDir => path.join(baseDir, moduleDir, defaultLocaleFile));

  const coreLocaleContent = utils.readFile(coreLocaleFile);
  const coreLocaleKeys = Object.keys(coreLocaleContent);

  const reports = moduleLocaleFiles.map((filePath) => {
    const moduleLocaleContent = utils.readFile(filePath);
    const moduleLocaleKeys = Object.keys(moduleLocaleContent);
    const messages = [];

    moduleLocaleKeys.forEach((key) => {
      if (coreLocaleKeys.indexOf(key) > -1) {
        messages.push({
          severity: 2,
          message: `key translated in core: '${key}'`
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
