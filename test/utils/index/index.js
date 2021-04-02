const expect = require('chai').expect;
const path = require('path');
const lib = require('../../../src/utils');

describe('The utils/index module', function() {
  it('should extract all i18n keys in the json file and flatten keys', function() {
    const keys = lib.getKeysInJsonFile(path.join(__dirname, 'fixture/en.json'));

    expect(keys).to.deep.equal([
      'core',
      'nested.prop',
      'other.nested'
    ]);
  });
});
