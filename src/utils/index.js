const fs = require('fs');
const yaml = require('js-yaml');
const q = require('q');
const path = require('path');
const jade = require('./jade');

const { FILE_TYPE_ALLOWED } = require('./../constants');

function listFilesInDir(dirPath) {
  try {
    return fs.readdirSync(dirPath);
  } catch (err) {
    return [];
  }
}

function readYamlFile(filePath) {
  try {
    return yaml.safeLoad(fs.readFileSync(filePath, 'utf8')) || {};
  } catch (err) {
    return {};
  }
}

function readJsonFile(filePath) {
  try {
    return require(filePath) || {};
  } catch (err) {
    return {};
  }
}

function readFile(filePath) {
  if (filePath.endsWith(`.${FILE_TYPE_ALLOWED[0]}`)) {
    return flatten(readJsonFile(filePath));
  } else if (filePath.endsWith(`.${FILE_TYPE_ALLOWED[1]}`)
      || filePath.endsWith(`.${FILE_TYPE_ALLOWED[2]}`)) {
    return flatten(readYamlFile(filePath));
  }
  return {};
}

function getKeysInFile(filePath) {
  return Object.keys(readFile(filePath));
}


function flatten(target) {
  const delimiter = '.';
  const output = [];

  function step(object, prev, currentDepth) {
    currentDepth = currentDepth || 1;
    Object.keys(object).forEach((key) => {
      const value = object[key];
      const isObject = typeof value === 'object';

      const newKey = prev
          ? prev + delimiter + key
          : key;

      if (isObject && Object.keys(value).length) {
        return step(value, newKey, currentDepth + 1);
      }

      output[newKey] = value;
    });
  }

  step(target);

  return output;
}

function getAvailableLocaleFilesInDir(baseDir, dir, locales, fileType) {
  const fsAccess = q.denodeify(fs.access);

  const requiredFiles = locales.map((locale) => {
    const fileName = `${locale}.${fileType}`;
    return path.join(baseDir, dir, fileName);
  });

  const promises = requiredFiles.map((filePath) => {
    return fsAccess(filePath, fs.constants.R_OK)
      .then(() => filePath)
      .catch(() => null);
  });

  return q.all(promises).then(files => files.filter(Boolean));
}

/**
 * Remove baseDir from filePath
 */
function qualifyFilePath(baseDir, filePath) {
  if (filePath.indexOf(baseDir) === 0) {
    return filePath.replace(baseDir, '').replace(/^\//, '');
  }

  return filePath;
}

module.exports = {
  listFilesInDir,
  readFile,
  flatten,
  getKeysInFile,
  getAvailableLocaleFilesInDir,
  qualifyFilePath,
  jade
};
