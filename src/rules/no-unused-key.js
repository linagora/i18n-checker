const q = require('q');
const path = require('path');
const glob = require('glob-all');
const _ = require('lodash');
const utils = require('../utils');

function check(options) {
  const { baseDir, dirs, verifyOptions } = options;
  const { defaultLocale, fileType } = verifyOptions;

  const totalKeysInTemplate = [];
  const report = dirs.map((dir) => {
    if (dir.core || !dir.templateSrc) {
      return;
    }

    const localeFile = path.join(baseDir, dir.localeDir, `${defaultLocale}.${fileType}`);
    const localeKeys = utils.getKeysInFile(localeFile);
    const keysInDir = getKeysInDir(baseDir, dir);

    totalKeysInTemplate.push(...keysInDir);

    const messages = [];

    localeKeys.forEach((key) => {
      if (keysInDir.indexOf(key) === -1) {
        messages.push(buildMessage(key));
      }
    });

    if (messages.length) {
      return {
        filePath: localeFile,
        messages
      };
    }
  }).filter(Boolean);

  const coreDir = dirs.filter(dir => dir.core)[0];

  if (coreDir.templateSrc) {
    const coreLocaleFile = path.join(baseDir, coreDir.localeDir, `${defaultLocale}.${fileType}`);
    const coreLocaleKeys = utils.getKeysInFile(coreLocaleFile);
    const keysInCoreTemplate = getKeysInDir(baseDir, coreDir);
    const messages = [];

    coreLocaleKeys.forEach((key) => {
      if (keysInCoreTemplate.indexOf(key) === -1 &&
          totalKeysInTemplate.indexOf(key) === -1) {
        messages.push(buildMessage(key));
      }
    });

    if (messages.length) {
      report.unshift({
        filePath: coreLocaleFile,
        messages
      });
    }
  }

  return q(report);
}

function getKeysInDir(baseDir, dir) {
  const templateFiles = glob.sync(dir.templateSrc, { cwd: baseDir });
  const keysInTemplateFiles = templateFiles.map(filePath => utils.jade.extractKeysInFile(path.join(baseDir, filePath)));

  return _.uniq([].concat(...keysInTemplateFiles));
}

function buildMessage(key) {
  return {
    severity: 2,
    message: `key is not used in any template: '${key}'`
  };
}

module.exports = check;
