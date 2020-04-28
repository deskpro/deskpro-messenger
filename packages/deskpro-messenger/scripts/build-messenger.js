var fs = require('fs');
var path = require('path');
var uglify = require('uglify-js');

const buildFolder = path.relative(process.cwd(), './build');

try {
  let data = fs.readFileSync(buildFolder + '/messenger.js', 'utf8');
  let json = fs.readFileSync(buildFolder + '/asset-manifest.json');

  let assets = JSON.parse(json);
  // {HOST} will be replaced by the messenger loader.
  console.log(assets.entrypoints);
  assets = assets.entrypoints.main.js
    .map((fileName) => `<script async src="{HOST}/${fileName}"></script>`)
    .concat(
      assets.entrypoints.main.css.map(
        (fileName) => `<link rel="stylesheet" href="{HOST}/${fileName}">`
      )
    )
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
