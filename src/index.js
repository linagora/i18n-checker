const q = require('q');
const utils = require('./utils');
const { DEFAULT_LOCALE } = require('./constants');

const AVAILABLE_RULES = [
  'all-keys-translated',
  'all-locales-present',
  'default-locale-translate',
  'no-duplicate-with-core',
  'valid-json-file'
];

function getRules(ruleIds = AVAILABLE_RULES) {
  return ruleIds.map(ruleId => ({
    ruleId,
    check: require(`./rules/${ruleId}`)
  }));
}

function checker(options, callback) {
  if (!options) {
    return callback(new Error('options cannot be null'));
  }

  if (!options.baseDir) {
    return callback(new Error('options.baseDir is required'));
  }

  if (!Array.isArray(options.dirs)) {
    return callback(new Error('options.dirs must be an array'));
  }

  const numberOfCoreDirs = options.dirs.filter(dir => dir.core).length;

  if (numberOfCoreDirs !== 1) {
    return callback(new Error('options.dirs must contain 1 core directory'));
  }

  const isEveryDirValid = options.dirs.every(dir => !!dir.localeDir);

  if (!isEveryDirValid) {
    return callback(new Error('some directories in options.dirs are missing localeDir'));
  }

  if (!options.verifyOptions) {
    return callback(new Error('options.verifyOptions is required'));
  }

  if (!options.verifyOptions.locales) {
    return callback(new Error('options.verifyOptions.locales is required'));
  }

  if (!options.moduleDirs) {
    options.moduleDirs = [];
  }

  const { baseDir, verifyOptions } = options;

  if (!verifyOptions.defaultLocale) {
    verifyOptions.defaultLocale = DEFAULT_LOCALE;
  }

  if (verifyOptions.locales.indexOf(verifyOptions.defaultLocale) === -1) {
    return callback(new Error(`locales must contains defaultLocale: ${verifyOptions.defaultLocale}`));
  }

  const rules = getRules(verifyOptions.rules);
  const promises = rules.map((rule) => {
    return rule.check(options).then(reports => ({
      ruleId: rule.ruleId,
      reports
    }));
  });

  q.all(promises).done((results) => {
    const filesReport = {};

    results.forEach((result) => {
      const { ruleId, reports } = result;

      reports.forEach((report) => {
        const { messages } = report;
        const filePath = utils.qualifyFilePath(baseDir, report.filePath);
        let fileReport = filesReport[filePath];

        if (!fileReport) {
          fileReport = [];
          filesReport[filePath] = fileReport;
        }

        messages.forEach((message) => {
          fileReport.push(Object.assign({ ruleId }, message));
        });
      });
    });

    const output = Object.keys(filesReport).map(filePath => ({
      filePath,
      messages: filesReport[filePath]
    }));

    callback(null, output);
  }, err => callback(err));
}

module.exports = checker;
module.exports.reporters = require('./reporters');
