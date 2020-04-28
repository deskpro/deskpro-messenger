var fs = require('fs');
var path = require('path');
var uglify = require('uglify-js');

const buildFolder = path.relative(process.cwd(), './build');

try {
  let data = fs.readFileSync(buildFolder + '/messenger.js', 'utf8');
  let json = fs.readFileSync(buildFolder + '/asset-manifest.json');

  let assets = JSON.parse(json);
  // {HOST} will be replaced by the messenger loader.
  assets = assets.entrypoints
    .map((fileName) => {
      if (fileName.match(/js$/)) {
        return `<script async src="{HOST}/${fileName}"></script>`;
      } else if (fileName.match(/css$/)) {
        return `<link rel="stylesheet" href="{HOST}/${fileName}">`
      }
    })
    .join('');
  data = data.replace('<!-- INJECT ASSETS -->', assets);

  fs.writeFileSync(buildFolder + '/messenger.js', data, 'utf8');

  const minified = uglify.minify(data);
  if (minified.error) {
    throw minified.error;
  }
  fs.writeFileSync(buildFolder + '/messenger.min.js', minified.code);
} catch (err) {
  console.log(err);
}
