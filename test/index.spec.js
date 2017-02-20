const expect = require('chai').expect;
const lib = require('../src');

describe('The library', function() {
  it('should export a function', function() {
    expect(lib).to.be.a.function;
  });

  it('should call callback with error when no options passed', function(done) {
    const options = null;

    lib(options, (err) => {
      expect(err.message).to.equal('options cannot be null');
      done();
    });
  });

  it('should call callback with error when no baseDir option passed', function(done) {
    const options = {
      verifyOptions: {
        locales: []
      }
    };

    lib(options, (err) => {
      expect(err.message).to.equal('options.baseDir is required');
      done();
    });
  });

  it('should call callback with error when no dirs option passed', function(done) {
    const options = {
      baseDir: '/path/base',
      verifyOptions: {
        locales: []
      }
    };

    lib(options, (err) => {
      expect(err.message).to.equal('options.dirs must be an array');
      done();
    });
  });

  it('should call callback with error when no directory is marked as core', function(done) {
    const options = {
      baseDir: '/path/base',
      dirs: [],
      verifyOptions: {
        locales: []
      }
    };

    lib(options, (err) => {
      expect(err.message).to.equal('options.dirs must contain 1 core directory');
      done();
    });
  });

  it('should call callback with error when more than one directories are marked as core', function(done) {
    const options = {
      baseDir: '/path/base',
      dirs: [{
        core: true
      }, {
        core: true
      }],
      verifyOptions: {
        locales: []
      }
    };

    lib(options, (err) => {
      expect(err.message).to.equal('options.dirs must contain 1 core directory');
      done();
    });
  });

  it('should call callback with error when some directories are missing localeDir', function(done) {
    const options = {
      baseDir: '/path/base',
      dirs: [{
        localeDir: '/path/core/locales',
        core: true
      }, {}],
      verifyOptions: {
        locales: []
      }
    };

    lib(options, (err) => {
      expect(err.message).to.equal('some directories in options.dirs are missing localeDir');
      done();
    });
  });

  it('should call callback with error when no verifyOptions option passed', function(done) {
    const options = {
      baseDir: '/path/base',
      dirs: [{
        localeDir: '/path/core/locales',
        core: true
      }]
    };

    lib(options, (err) => {
      expect(err.message).to.equal('options.verifyOptions is required');
      done();
    });
  });

  it('should call callback with error when no verifyOptions.locales option passed', function(done) {
    const options = {
      baseDir: '/path/base',
      dirs: [{
        localeDir: '/path/core/locales',
        core: true
      }],
      verifyOptions: {}
    };

    lib(options, (err) => {
      expect(err.message).to.equal('options.verifyOptions.locales is required');
      done();
    });
  });

  it('should callback with error when defaultLocale is not present in locales array', function(done) {
    const options = {
      baseDir: '/path/base',
      dirs: [{
        localeDir: '/path/core/locales',
        core: true
      }],
      verifyOptions: {
        defaultLocale: 'en',
        locales: ['vi', 'fr']
      }
    };

    lib(options, (err) => {
      expect(err.message).to.equal('locales must contains defaultLocale: en');
      done();
    });
  });
});
