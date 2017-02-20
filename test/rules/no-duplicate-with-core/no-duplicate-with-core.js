const expect = require('chai').expect;
const lib = require('../../../src');

describe('The no-duplicate-with-core rule', function() {
  const baseDir = `${__dirname}/fixture`;
  const dirs = [{
    localeDir: 'core',
    core: true
  }, {
    localeDir: 'module'
  }];
  let options;

  beforeEach(function() {
    options = {
      baseDir,
      dirs,
      verifyOptions: {
        rules: ['no-duplicate-with-core']
      }
    };
  });

  it('should be OK when key in core is not duplicated in module', function(done) {
    options.verifyOptions.locales = ['valid'];
    options.verifyOptions.defaultLocale = 'valid';

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.be.empty;
      done();
    });
  });

  it('should not be OK when key in core is duplicated in module', function(done) {
    options.verifyOptions.locales = ['invalid'];
    options.verifyOptions.defaultLocale = 'invalid';

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.deep.equal([{
        filePath: 'module/invalid.json',
        messages: [{
          message: 'key translated in core: \'duplicate\'',
          ruleId: 'no-duplicate-with-core',
          severity: 2
        }]
      }]);
      done();
    });
  });
});
