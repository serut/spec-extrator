const fs = require("fs")
const path = require("path")
const _ = require('lodash')

const SPEC_FILENAME = '.specs.json'

function scanDir (rootFolder) {
  const promise = new Promise(function (fulfill, reject) {
    fs.readdir(rootFolder, (err, files) => {
      if (err) {
        reject(err)
      } else {
        fulfill({
          files: files,
          rootFolder: rootFolder
        })
      }
    })
  });
  return promise
}

function statFile (filePath) {
  const promise = new Promise(function (fulfill, reject) {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(err)
      } else {
        fulfill({
          filePath: filePath,
          stats: stats
        })
      }
    })
  });
  return promise
}

function main (sourcePath, done) {
  // Scan the team namespace node_modules/@teamname
  scanDir(sourcePath)
  .then(function (scanDirResult) {
    // Retrieve the type of each subfile (file/folder) from node_modules/@teamname
    Promise.all(_.map(scanDirResult.files, function (filePath) {
      var fullPath = path.join(scanDirResult.rootFolder, filePath);
      return statFile(fullPath)
    }))
    .then(function (statFolders) {
      // Retrieve the list of files from node_modules/@teamname/some-package
      Promise.all(_.map(statFolders, function (statFolder) {
        if (statFolder.stats.isDirectory()) {
          return scanDir(statFolder.filePath)
        }
      }))
      .then(function (scanDirSubFilesResults) {
        // Check if the folder node_modules/@teamname/some-package contains the SPEC_FILENAME file
        const specFileFolders = _.filter(scanDirSubFilesResults, function (scanDirSubFilesResult) {
          return scanDirSubFilesResult.files.includes(SPEC_FILENAME)
        })
        done(specFileFolders)
      })
      .catch(function (error) {
        console.error("Error while scanDir a folder from this list [", statFolders, ']', error)
      })
    })
    .catch(function (error) {
      console.error("Error while statFile [", files, ']', error)
    })
  })
  .catch(function (error) {
    console.error("Error while scanDir [", sourcePath, ']', error)
  })
}
module.exports = main