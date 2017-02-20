const expect = require('chai').expect;
const lib = require('../../../src');

describe('The default-locale-translate rule', function() {
  const baseDir = `${__dirname}/fixture`;
  const dirs = [{
    localeDir: 'core',
    core: true
  }];
  let options;

  beforeEach(function() {
    options = {
      baseDir,
      dirs,
      verifyOptions: {
        rules: ['default-locale-translate']
      }
    };
  });

  it('should be OK when keys and values are matched in default locale', function(done) {
    options.verifyOptions.locales = ['valid'];
    options.verifyOptions.defaultLocale = 'valid';

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.be.empty;
      done();
    });
  });

  it('should not be OK when keys and values are not matched in default locale', function(done) {
    options.verifyOptions.locales = ['invalid'];
    options.verifyOptions.defaultLocale = 'invalid';

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.deep.equal([{
        filePath: 'core/invalid.json',
        messages: [{
          message: 'key is not equal value: \'key is not the same as value\'',
          ruleId: 'default-locale-translate',
          severity: 2
        }]
      }]);
      done();
    });
  });
});
