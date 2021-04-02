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

  it('should read flat keys in right order', function() {
    const unsortedKeys = Object.keys(lib.flatten({ b: 'value', a: 'value' }));
    expect(unsortedKeys).to.deep.equal(['b', 'a']);

    const sortedNestedKeys = Object.keys(lib.flatten({ a: { a: 'a.a', b: 'a.b' }, b: 'b' }));
    expect(sortedNestedKeys).to.deep.equal(['a.a', 'a.b', 'b']);

    const sortedKeys = Object.keys(lib.flatten({ a: 'value', b: 'value' }));
    expect(sortedKeys).to.deep.equal(['a', 'b']);

    const unsortedNestedKeys = Object.keys(lib.flatten({ a: { b: 'a.b', a: 'a.a' }, b: 'b' }));
    expect(unsortedNestedKeys).to.deep.equal(['a.b', 'a.a', 'b']);
  });
});
