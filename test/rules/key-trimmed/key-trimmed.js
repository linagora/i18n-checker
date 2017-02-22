const expect = require('chai').expect;
const lib = require('../../../src');

describe('The key-trimmed rule', function() {
  const baseDir = `${__dirname}/fixture`;
  let options;

  beforeEach(function() {
    options = {
      baseDir,
      dirs: [{
        localeDir: 'core',
        core: true
      }, {
        localeDir: 'module'
      }],
      verifyOptions: {
        locales: ['en'],
        rules: ['key-trimmed']
      }
    };
  });

  it('should detect untrimmed keys', function(done) {
    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.deep.equal([{
        filePath: 'core/en.json',
        messages: [{
          message: 'unexpected leading/trailing space in key: \' hi\'',
          ruleId: 'key-trimmed',
          severity: 2
        }, {
          message: 'unexpected leading/trailing space in key: \'hi \'',
          ruleId: 'key-trimmed',
          severity: 2
        }]
      }, {
        filePath: 'module/en.json',
        messages: [{
          message: 'unexpected leading/trailing space in key: \' hello\'',
          ruleId: 'key-trimmed',
          severity: 2
        }, {
          message: 'unexpected leading/trailing space in key: \'hello \'',
          ruleId: 'key-trimmed',
          severity: 2
        }]
      }]);
      done();
    });
  });
});
