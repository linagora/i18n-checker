const expect = require('chai').expect;
const lib = require('../../../src');

describe('The all-locales-present rule', function() {
  const baseDir = `${__dirname}/fixture`;
  const dirs = [{
    localeDir: 'core',
    core: true
  }, {
    localeDir: 'modules/contact'
  }];
  let options;

  beforeEach(function() {
    options = {
      baseDir,
      dirs,
      verifyOptions: {
        rules: ['all-locales-present']
      }
    };
  });

  it('should be OK when all locale files are present', function(done) {
    options.verifyOptions.locales = ['en'];

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.be.empty;
      done();
    });
  });

  it('should not be OK when there is missing locale file', function(done) {
    options.verifyOptions.locales = ['en', 'vi'];

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.deep.equal([{
        filePath: 'core/vi.json',
        messages: [{
          ruleId: 'all-locales-present',
          severity: 2,
          message: 'file not found'
        }]
      }, {
        filePath: 'modules/contact/vi.json',
        messages: [{
          ruleId: 'all-locales-present',
          severity: 2,
          message: 'file not found'
        }]
      }]);
      done();
    });
  });
});
