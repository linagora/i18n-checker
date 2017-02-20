/* eslint no-console: 0 */

const colors = require('colors/safe');

function standard(reports) {
  if (!reports.length) {
    return console.log(colors.green('Passed!'));
  }

  // sort by filePath
  reports.sort((a, b) => {
    const pathA = a.filePath.toUpperCase(); // ignore upper and lowercase
    const pathB = b.filePath.toUpperCase(); // ignore upper and lowercase

    if (pathA < pathB) {
      return -1;
    }

    if (pathA > pathB) {
      return 1;
    }

    return 0;
  });

  reports.forEach((report) => {
    console.log(colors.underline(report.filePath));

    report.messages.forEach((message) => {
      const severity = message.severity === 2 ? colors.red('error') : colors.yellow('warning');

      console.log('  ', severity, '  ', message.message, '  ', colors.gray(message.ruleId));
    });
  });
}

module.exports = {
  standard
};
