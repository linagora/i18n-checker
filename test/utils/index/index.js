const expect = require('chai').expect;
const path = require('path');
const lib = require('../../../src/utils');

describe('The utils/index module', function() {
  it('should extract all i18n keys in the json file and flatten keys', function() {
    const keys = lib.getKeysInFile(path.join(__dirname, 'fixture/en.json'));

    expect(keys).to.deep.equal([
      'core',
      'nested.prop',
      'other.nested'
    ]);
  });

  it('should find yml file', function() {
    return lib.getAvailableLocaleFilesInDir(__dirname, 'fixture', ['fr', 'en'], 'yml').then((localeFiles) => {
      expect(localeFiles).to.deep.equal([
        path.join(__dirname, 'fixture', 'fr.yml')
      ]);
    });
  });

  it('should find json file', function() {
    return lib.getAvailableLocaleFilesInDir(__dirname, 'fixture', ['fr', 'en'], 'json').then((localeFiles) => {
      expect(localeFiles).to.deep.equal([
        path.join(__dirname, 'fixture', 'en.json')
      ]);
    });
  });
});
