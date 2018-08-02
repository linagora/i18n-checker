const expect = require('chai').expect;
const path = require('path');

const bin = require('../../bin/i18n-checker.js');

describe('The binary', function() {
  it('should export a function', function() {
    expect(bin).to.be.a.function;
  });


  it('should call callback without error', function(done) {
    bin(path.join(__dirname, 'fixture/.i18n-lintrc.js'), (code) => {
      expect(code).to.equal(0);
      done();
    });
  });

  it('should call callback with 1 error', function(done) {
    bin(path.join(__dirname, 'fixture-ko/.i18n-lintrc.js'), (code) => {
      expect(code).to.equal(1);
      done();
    });
  });
});
