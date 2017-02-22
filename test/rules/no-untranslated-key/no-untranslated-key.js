const expect = require('chai').expect;
const lib = require('../../../src');

describe('The no-untranslated-key rule', function() {
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
        locales: ['en'],
        rules: ['no-untranslated-key']
      }
    };
  });

  it('should be OK when templates in core are translated in core locale', function(done) {
    options.dirs[0].templateSrc = 'core/**/*.ok.jade';

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.deep.equal([]);
      done();
    });
  });

  it('should not be OK when templates in core are not translated in core locale', function(done) {
    options.dirs[0].templateSrc = 'core/**/*.nok.jade';

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.deep.equal([{
        filePath: 'core/template.nok.jade',
        messages: [{
          message: 'untranslated key: \'Hello world!\'',
          ruleId: 'no-untranslated-key',
          severity: 2
        }]
      }]);
      done();
    });
  });

  it('should be OK when templates in modules are translated in core or module locale', function(done) {
    options.dirs.push({
      localeDir: 'module',
      templateSrc: 'module/**/*.ok.jade'
    });

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.be.empty;
      done();
    });
  });

  it('should not be OK when templates in modules are not translated', function(done) {
    options.dirs.push({
      localeDir: 'module',
      templateSrc: 'module/**/*.nok.jade'
    });

    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.deep.equal([{
        filePath: 'module/template.nok.jade',
        messages: [{
          message: 'untranslated key: \'untranslated\'',
          ruleId: 'no-untranslated-key',
          severity: 2
        }]
      }]);
      done();
    });
  });
});
