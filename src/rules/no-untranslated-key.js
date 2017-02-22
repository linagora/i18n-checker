const q = require('q');
const path = require('path');
const glob = require('glob-all');
const utils = require('../utils');

function check(options) {
  const { baseDir, dirs, verifyOptions } = options;
  const { defaultLocale } = verifyOptions;

  const coreDir = dirs.filter(dir => dir.core)[0];
  const coreLocaleFile = path.join(baseDir, coreDir.localeDir, `${defaultLocale}.json`);
  const coreLocaleKeys = utils.getKeysInJsonFile(coreLocaleFile);

  const report = dirs.map((dir) => {
    if (!dir.templateSrc) {
      return;
    }

    const localeKeys = [...coreLocaleKeys];

    if (!dir.core) {
      const file = path.join(baseDir, dir.localeDir, `${defaultLocale}.json`);
      const keys = utils.getKeysInJsonFile(file);
      localeKeys.push(...keys);
    }

    const templateFiles = glob.sync(dir.templateSrc, { cwd: baseDir });

    return templateFiles.map((filePath) => {
      const keysInTemplate = utils.jade.extractKeysInFile(path.join(baseDir, filePath));
      const messages = [];

      keysInTemplate.forEach((key) => {
        if (localeKeys.indexOf(key) === -1) {
          messages.push({
            severity: 2,
            message: `untranslated key: '${key}'`
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
  })
  .filter(Boolean);

  return q([].concat(...report));
}

module.exports = check;
