var fs = require('fs');
var path = require('path');
var uglify = require('uglify-js');

const buildFolder = path.relative(process.cwd(), './build');

try {
  let data = fs.readFileSync(buildFolder + '/widget.js', 'utf8');
  let json = fs.readFileSync(buildFolder + '/asset-manifest.json');

  let assets = JSON.parse(json);
  assets = Object.values(assets)
    .map(fileName => {
      // {HOST} will be replaced by the widget loader.
      switch (path.extname(fileName)) {
        case '.css':
          return `<link rel="stylesheet" href="{HOST}/${fileName}">`;
        case '.js':
          return `<script async src="{HOST}/${fileName}"></script>`;
        default:
          return '';
      }
    })
    .join('');
  data = data.replace('<!-- INJECT ASSETS -->', assets);

  fs.writeFileSync(buildFolder + '/widget.js', data, 'utf8');

  const minified = uglify.minify(data);
  if (minified.error) {
    throw minified.error;
  }
  fs.writeFileSync(buildFolder + '/widget.min.js', minified.code);
} catch (err) {
  console.log(err);
}
