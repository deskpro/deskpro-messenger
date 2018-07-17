var fs = require('fs');
var path = require('path');

const buildFolder = path.relative(process.cwd(), './build');

fs.readFile(buildFolder + '/widget.js', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }

  fs.readFile(buildFolder + '/asset-manifest.json', function(err, json) {
    if (err) {
      return console.log(err);
    }
    const assets = JSON.parse(json);
    // bundle.js is used for local development, but in production build it's called main.js
    data = data.replace('bundle.js', 'main.js');

    Object.keys(assets).forEach(fileName => {
      const hashedFileName = path.basename(assets[fileName]);
      data = data.replace(fileName, hashedFileName);
    });

    fs.writeFile(buildFolder + '/widget.js', data, 'utf8', function(err) {
      if (err) {
        return console.log(err);
      }
    });
  });
});
