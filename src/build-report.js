const fs = require("fs")
const path = require("path")
const _ = require('lodash')

const SPEC_FILENAME = '.specs.json'
const REPORT_FILENAME = "report_spec.html"
function writeHTML (fileName, content) {
  const promise = new Promise(function (fulfill, reject) {
    fs.writeFile(fileName, content, (err) => {
      if (err) {
        reject(err)
      } else {
        fulfill()
      }
    });
  });
  return promise
}

function getHTML (info) {
  var date = new Date();
  // From https://v4-alpha.getbootstrap.com/examples/dashboard/
  let result = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Specification report</title>

    <!-- Bootstrap core CSS -->
    <style>
      /* Move down content because we have a fixed navbar that is 50px tall */
      body {
        padding-top: 50px;
      }
    </style>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
  </head>

  <body>
    <nav class="navbar navbar-toggleable-md navbar-inverse fixed-top bg-inverse">
      <a class="navbar-brand" href="#">Specification report</a>
    </nav>

    <div class="container-fluid">
      <div class="row">

        <main class="col-sm-10 offset-sm-1 col-md-10 offset-md-1 pt-3">
          <h2>Report created the ${date.toLocaleString()}</h2>
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Specifications</th>
                </tr>
              </thead>
              <tbody>`
  _.forEach(info, function (i) {
    result += `
    <tr>
      <td>${i.module}</td>
      <td>${i.content.join('<br/>')}</td>
    </tr>
`
  })

  result +=`
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  </body>
</html>`
  return result
}
function getStats (info)  {
  let nbSpecs = 0;
  _.forEach(info, function (i) {
    nbSpecs += i.content.length
  })
  return {
    nbModules: info.length,
    nbSpecs: nbSpecs,
  }
}
function main (info) {
  const html = getHTML(info)
  const stats = getStats(info)
  writeHTML(REPORT_FILENAME, html)
  .then(function () {
    console.log("Success !", stats.nbSpecs, "specification(s) founded across", stats.nbModules, "module(s)")
    console.log("The report", REPORT_FILENAME, "have been created")
  })
  .catch(function (error) {
    console.error("Error while creating HTML report", error)
  })
}


module.exports = main