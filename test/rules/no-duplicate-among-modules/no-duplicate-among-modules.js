const expect = require('chai').expect;
const lib = require('../../../src');

describe('The no-duplicate-among-modules rule', function() {
  const baseDir = `${__dirname}/fixture`;
  const dirs = [{
    localeDir: 'core',
    core: true
  }, {
    localeDir: 'modules/contact'
  }, {
    localeDir: 'modules/calendar'
  }];
  let options;

  beforeEach(function() {
    options = {
      baseDir,
      dirs,
      verifyOptions: {
        rules: ['no-duplicate-among-modules'],
        locales: ['en']
      }
    };
  });

  it('should not be OK when key is translated in more than one modules', function(done) {
    lib(options, (err, resp) => {
      expect(err).to.not.exist;
      expect(resp).to.deep.equal([{
        filePath: 'modules/contact/en.json',
        messages: [{
          message: 'key exists in other modules: \'key\'',
          ruleId: 'no-duplicate-among-modules',
          severity: 2
        }]
      }, {
        filePath: 'modules/calendar/en.json',
        messages: [{
          message: 'key exists in other modules: \'key\'',
          ruleId: 'no-duplicate-among-modules',
          severity: 2
        }]
      }]);
      done();
    });
  });
});
