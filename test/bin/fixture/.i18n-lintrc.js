module.exports = {
  baseDir: __dirname,
  dirs: [{
    localeDir: 'core',
    core: true
  }],
  verifyOptions: {
    defaultLocale: 'en-en',
    locales: ['en-en', 'fr-fr'],
    rules: [
      'all-locales-present',
      'valid-json-file',
      'no-duplicate-with-core',
      'all-keys-translated'
    ]
  }
};
