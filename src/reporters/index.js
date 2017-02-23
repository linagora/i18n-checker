/* eslint no-console: 0 */

const colors = require('colors/safe');

function standard(reports) {
  if (!reports.length) {
    return {
      error: 0,
      warning: 0
    };
  }

  let numberOfErrors = 0;
  let numberOfWarnings = 0;

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
      let severity;

      if (message.severity === 2) {
        severity = colors.red('error');
        numberOfErrors += 1;
      } else {
        severity = colors.yellow('warning');
        numberOfWarnings += 1;
      }

      console.log('  ', severity, '  ', message.message, '  ', colors.gray(message.ruleId));
    });
  });

  return {
    error: numberOfErrors,
    warning: numberOfWarnings
  };
}

module.exports = {
  standard
};
