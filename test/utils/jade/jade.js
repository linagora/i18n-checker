const expect = require('chai').expect;
const path = require('path');
const lib = require('../../../src/utils/jade');

describe('The utils/jade module', function() {
  it('should extract all i18n keys in the jade file (sharp syntax)', function() {
    const keys = lib.extractKeysInFile(path.join(__dirname, 'fixture/sharp-syntax.jade'));

    expect(keys).to.deep.equal([
      'Your account %s is currently unavailable.',
      'You can click to retry',
      'Hahaha',
      'Confirmation',
      'Remove "%s" and all events it contains?',
      'Remove \\"%s\\" and all events it contains?',
      'I',
      'Delete'
    ]);
  });

  it('should extract all i18n keys in the jade file (exclamation mark syntax)', function() {
    const keys = lib.extractKeysInFile(path.join(__dirname, 'fixture/exclamation-mark-syntax.jade'));

    expect(keys).to.deep.equal([
      'Your account %s is currently unavailable.',
      'You can click to retry',
      'Hahaha',
      'Confirmation',
      'Remove "%s" and all events it contains?',
      'Remove \\"%s\\" and all events it contains?',
      'I',
      'Delete'
    ]);
  });
});
