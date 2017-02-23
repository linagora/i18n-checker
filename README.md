# i18n-checker

> Validate translation files

## Usage

```javascript
checker(options, (err, report) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Report:', report);
  }
});
```

Where `options` is an object with:

* `baseDir`: the absolute path to the base directory that contains directories to scan
* `dirs`: list of directories, in which:
  * `localeDir`: relative path to the directory containing locale files (`.json` files)
  * `core`: `true` if current directory contains core locale files. One of the
  directories in the list must be marked as core.
* `verifyOptions`: options to verify locale files
  * `defaultLocale`: the default locale (default: `'en'`)
  * `locales`: list of locales (e.g. `['en', 'fr', 'vi']`)
  * `rules`: list of rules to check (omit to check all rules)

### Example

```javascript
const checker = require('i18n-checker');
const reporter = checker.reporters.standard;

const options = {
  baseDir: __dirname,
  dirs: [{
    localeDir: 'backend/i18n/locales',
    core: true
  }, {
    localeDir: 'modules/contact/i18n/locales'
  }, {
    localeDir: 'modules/calendar/i18n/locales'
  }],
  verifyOptions: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'vi'],
    rules: [
      'all-locales-present',
      'valid-json-file',
      'default-locale-translate',
      'no-duplicate-with-core',
      'all-keys-translated'
    ]
  }
};

checker(options, (err, report) {
  reporter(report);
});
```

### Rules

#### all-keys-translated

All keys translated in default locale must be translated in other locales.

#### all-locales-present

All directories must contain translation files for all locales defined in
`options.verifyOptions.locales` list.

#### default-locale-translate

In translation file of the default locale, value must have the same value as key.

#### key-trimmed

No white space character at the beginning or the end of the key.

#### no-duplicate-among-modules

Keys are duplicated between modules should be in core.

#### no-duplicate-with-core

Keys are translated in core module must not be translated again in modules.

#### no-untranslated-key

All keys used in template files must be translated.

#### no-unused-key

All locale keys defined in core module must be used in core's template files or
modules's template files.

All locale keys defined in a module must be used in that module's template files.

#### valid-json-file

Every translation files must be valid JSON file and has no duplicate keys.

## Development

### Run tests

```
grunt lint # lint JS files
grunt test # run test cases
grunt # grunt lint test
```

### Write a new rule

1/ Create a new file in `src/rules` directory named `rule-id.js`.

2/ Each rule is a function, it receives the `options` and returns a promise
which resolves the report:

```javascript
module.exports = function(options) {
  const report = [{
    filePath: 'module/contact/en.json',
    messages: [{
      severity: 2,
      message: 'something wrong'
    }, {
      //....
    }]
  }, {
    filePath: 'module/calendar/vi.json',
    messages: [{
      severity: 1,
      message: 'something not OK'
    }]
  }];

  return q(report);
}
```

3/ Update documentation and write test for the new rule.

## Licence

[Affero GPL v3](http://www.gnu.org/licenses/agpl-3.0.html)
