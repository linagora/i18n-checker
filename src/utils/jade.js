const fs = require('fs');

const KEY_REGEX = /#{__\((['"])(.*?)([^\\])\1/g;

function extractKeysInFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  return extractKeys(fileContent);
}

function extractKeys(jadeContent) {
  if (!jadeContent) {
    return [];
  }

  const keys = [];
  let match = KEY_REGEX.exec(jadeContent);

  while (match !== null) {
    keys.push(match[2] + match[3]);
    match = KEY_REGEX.exec(jadeContent);
  }

  return keys;
}

module.exports = {
  extractKeysInFile
};
