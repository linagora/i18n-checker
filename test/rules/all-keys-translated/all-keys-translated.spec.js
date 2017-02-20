const expect = require('chai').expect;
const lib = require('../../../src');

describe('The all-keys-translated rule', function() {
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
        defaultLocale: 'en',
        rules: ['all-keys-translated']
      }
    };
  });

  it('should not be OK when there is unexpected key translated', function(done) {
    options.verifyOptions.locales = ['en', 'vi'];

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.deep.equal([{
        filePath: 'core/vi.json',
        messages: [
          {
            message: 'unexpected key: \'I\'',
            ruleId: 'all-keys-translated',
            severity: 2
          }
        ]
      }]);
      done();
    });
  });

  it('should not be OK when key in default locale is not translated', function(done) {
    options.verifyOptions.locales = ['en', 'fr'];

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.deep.equal([{
        filePath: 'core/fr.json',
        messages: [
          {
            message: 'key missing: \'me\'',
            ruleId: 'all-keys-translated',
            severity: 2
          }
        ]
      }]);
      done();
    });
  });
});
