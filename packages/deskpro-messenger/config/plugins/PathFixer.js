const webpackSources = require('webpack-sources');

class PathFixer {
  apply(compiler) {
    compiler.hooks.compilation.tap('PathFixer', compilation => {
      // Now we can tap into various hooks available through compilation
      // Regenerate `contenthash` for minified assets
      const { mainTemplate, chunkTemplate } = compilation;

      for (const template of [mainTemplate, chunkTemplate]) {
        template.hooks.hashForChunk.tap('PathFixer', (hash) => {
          hash.update('PathFixer');
        });
      }
      const processedAssets = new WeakSet();
      const pathFixFn = (compilation, chunks, callback) => {

        Array.from(chunks)
          .reduce((acc, chunk) => acc.concat(chunk.files || []), [])
          .concat(compilation.additionalChunkAssets || [])
          .forEach((file) => {
            const asset = compilation.assets[file];
            const input = asset.source();
            if (input.indexOf('__webpack_require__.p + "static/js/"') !== -1) {
              let output         = input.replace('__webpack_require__.p + "static/js/"', 'window.parent.DESKPRO_MESSENGER_ASSET_URL.replace(/\\/$/, "") + "/"');
              const outputSource = new webpackSources.RawSource(output);
              outputSource.sourceAndMap = null;
              processedAssets.add(compilation.assets[file] = outputSource);
            } else {
              processedAssets.add(compilation.assets[file]);
            }


          });

          callback();
      };

      compilation.hooks.optimizeChunkAssets.tapAsync(
        'PathFixer',
        pathFixFn.bind(this, compilation)
      );
    });
  }
}

module.exports = PathFixer;
