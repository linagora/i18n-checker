const expect = require('chai').expect;
const lib = require('../../../src');

describe('The no-unused-key rule', function() {
  const baseDir = `${__dirname}/fixture`;
  let options;

  beforeEach(function() {
    options = {
      baseDir,
      dirs: [{
        localeDir: 'core',
        core: true
      }, {
        localeDir: 'module',
        templateSrc: 'module/**/*.jade'
      }],
      verifyOptions: {
        locales: ['en'],
        rules: ['no-unused-key']
      }
    };
  });

  it('should be OK when keys are used in templates', function(done) {
    options.dirs[0].templateSrc = 'core/**/*.ok.jade';
    options.dirs[1].templateSrc = 'module/**/*.ok.jade';

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.be.empty;
      done();
    });
  });

  it('should not be OK when there are unused keys', function(done) {
    options.dirs[0].templateSrc = 'core/**/*.nok.jade';
    options.dirs[1].templateSrc = 'module/**/*.nok.jade';

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.deep.equal([{
        filePath: 'core/en.json',
        messages: [{
          message: 'key is not used in any template: \'core\'',
          ruleId: 'no-unused-key',
          severity: 2
        }, {
          message: 'key is not used in any template: \'core but used in module\'',
          ruleId: 'no-unused-key',
          severity: 2
        }]
      }, {
        filePath: 'module/en.json',
        messages: [{
          message: 'key is not used in any template: \'module\'',
          ruleId: 'no-unused-key',
          severity: 2
        }]
      }]);
      done();
    });
  });
});
