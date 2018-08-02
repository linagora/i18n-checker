const expect = require('chai').expect;
const lib = require('../../../src');

describe('The valid-yaml-file rule', function() {
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
        fileType: 'yaml',
        rules: ['valid-yaml-file']
      }
    };
  });

  it('should detect invalid syntax yaml file', function(done) {
    options.verifyOptions.locales = ['invalid-syntax'];
    options.verifyOptions.defaultLocale = 'invalid-syntax';

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.deep.equal([{
        filePath: 'core/invalid-syntax.yaml',
        messages: [{
          message: `Failed to load the Yaml file "${__dirname}/fixture/core/invalid-syntax.yaml:2" > bad indentation of a mapping entry at line 2, column 6:\n      bar: value\n         ^`,
          ruleId: 'valid-yaml-file',
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
        filePath: 'core/duplicate-key.yaml',
        messages: [{
          message: `Failed to load the Yaml file "${__dirname}/fixture/core/duplicate-key.yaml:2" > duplicated mapping key at line 2, column 1:\n    key: duplicate\n    ^`,
          ruleId: 'valid-yaml-file',
          severity: 2
        }]
      }]);
      done();
    });
  });

  it('should detect valid YAML unflattened file', function(done) {
    options.verifyOptions.locales = ['unflattened'];
    options.verifyOptions.defaultLocale = 'unflattened';

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      // Expect to be valid
      expect(resp).to.deep.equal([]);
      done();
    });
  });
});
