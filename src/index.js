#! /usr/bin/env node
const _ = require('lodash')
const fs = require("fs")
const path = require("path")
const argv = require('minimist')(process.argv.slice(2));
const scanDirectory = require('./scan-directory')
const buildReport = require('./build-report')
const extractSpecs = require('./extract-specs')

if (!_.has(argv, 'path')) {
  console.error("CLI error: --path was not provided")
  console.error("Usage: node-spec-extrator --path <path to your team npm folder> ")
  console.error("Example: node-spec-extrator --path /home/myproject/node_modules/@regardsoss")
  process.exit(1)
}

const lookupPath = argv.path

const onExtractSpecsSuccess = buildReport
const onScanDirectorySuccess = extractSpecs(lookupPath, onExtractSpecsSuccess)

scanDirectory(lookupPath, onScanDirectorySuccess)
