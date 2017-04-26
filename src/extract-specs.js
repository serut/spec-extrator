const fs = require("fs")
const path = require("path")
const _ = require('lodash')

const SPEC_FILENAME = '.specs.json'

function readJSONFile (rootFolder, SPEC_FILENAME, lookupPath) {
  const filePath = path.join(rootFolder, SPEC_FILENAME)
  const promise = new Promise(function (fulfill, reject) {
    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err) {
        reject(err)
      } else {
        fulfill({
          module: rootFolder.replace(lookupPath, ''),
          content: JSON.parse(data)
        })
      }
    });
  });
  return promise
}

function extractSpecs (specFileFolders, lookupPath, done) {
  Promise.all(_.map(specFileFolders, function (specFileFolder) {
    return readJSONFile(specFileFolder.rootFolder, SPEC_FILENAME, lookupPath)
  }))
  .then(function (result) {
    return done(result)
  })
  .catch(function (error) {
    console.error("Error while reading JSON from [", SPEC_FILENAME, ']', error)
  })
}

function main (lookupPath, done) {
  return function (specFileFolders) {
    return extractSpecs(specFileFolders, lookupPath, done)
  }
}

module.exports = main