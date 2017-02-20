const expect = require('chai').expect;
const lib = require('../../../src');

describe('The valid-json-file rule', function() {
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
        rules: ['valid-json-file']
      }
    };
  });

  it('should detect invalid syntax JSON file', function(done) {
    options.verifyOptions.locales = ['invalid-syntax'];
    options.verifyOptions.defaultLocale = 'invalid-syntax';

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.deep.equal([{
        filePath: 'core/invalid-syntax.json',
        messages: [{
          message: 'Syntax error near ey": value',
          ruleId: 'valid-json-file',
          severity: 2
        }]
      }]);
      done();
    });
  });

  it('should detect duplicate keys', function(done) {
    options.verifyOptions.locales = ['duplicate-key'];
    options.verifyOptions.defaultLocale = 'duplicate-key';

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.deep.equal([{
        filePath: 'core/duplicate-key.json',
        messages: [{
          message: 'Syntax error: duplicated keys "key" near "key": "du',
          ruleId: 'valid-json-file',
          severity: 2
        }]
      }]);
      done();
    });
  });
});
