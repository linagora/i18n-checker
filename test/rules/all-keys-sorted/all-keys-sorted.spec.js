const expect = require('chai').expect;
const lib = require('../../../src');

describe('The all-keys-sorted rule', function() {
  const baseDir = `${__dirname}/fixture`;
  let options;

  beforeEach(function() {
    options = {
      baseDir,
      dirs: [{
        localeDir: 'core',
        core: true
      }],
      verifyOptions: {
        fileType: 'yml',
        defaultLocale: 'unsorted',
        rules: ['all-keys-sorted']
      }
    };
  });

  it('should be OK when the keys are sorted', function(done) {
    options.verifyOptions.defaultLocale = 'sorted';
    options.verifyOptions.locales = ['sorted'];

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.be.empty;
      done();
    });
  });

  it('should not be OK when the keys are not sorted', function(done) {
    options.verifyOptions.defaultLocale = 'unsorted';
    options.verifyOptions.locales = ['unsorted'];

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.deep.equal([{
        filePath: 'core/unsorted.yml',
        messages: [{
          ruleId: 'all-keys-sorted',
          severity: 2,
          message: 'Expected \'me\' at index 0 but found \'you\''
        }, {
          ruleId: 'all-keys-sorted',
          severity: 2,
          message: 'Expected \'nested.prop\' at index 1 but found \'me\''
        }, {
          ruleId: 'all-keys-sorted',
          severity: 2,
          message: 'Expected \'you\' at index 3 but found \'nested.prop\''
        }]
      }]);
      done();
    });
  });
});
