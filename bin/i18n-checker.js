#!/usr/bin/env node

'use strict';
const path = require('path');
const checker = require('../src');
const reporter = checker.reporters.standard;
const colors = require('colors/safe');

const main = (i18nLintrcPath, callback) => {
  const options = require(i18nLintrcPath);

  checker(options, (error, report) => {
    if (error) {
      console.error(colors.red(error));
      return callback(1);
    } else {
      const result = reporter(report);

      const nbErrors = result.error + result.warning;
      if(nbErrors == 0) {
        console.log(colors.green('Check is OK'));
      }
      // if any error or warning, it returns a non zero code.
      return callback(result.error + result.warning);
    }
  });
}

if (require.main === module) {
  // Called in command line
  // read .i18n-lintrc.js file in working directory
  const i18nLintrcPath = path.join(process.cwd(), process.argv[2] || '.i18n-lintrc.js');
  main(i18nLintrcPath, (exitCode) => process.exit(exitCode));
} else {
  // Called with require
  module.exports = main;
}
