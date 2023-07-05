var contrast = require('contrast');

const contrastPlugin = (opts = {}) => {
  opts = opts || {};
  var dark = opts.dark;
  var light = opts.light;

  return {
    postcssPlugin: 'postcss-contrast',
    Once (root, { result }) {
      root.walkDecls(function(decl) {
        if (!decl.value || decl.value.indexOf('contrast(') === -1) {
          return;
        }

        var index = decl.value.indexOf('(');
        var last = decl.value.indexOf(')');
        var value = decl.value.slice(++index, last);
        var black = '#000';
        var white = '#fff';


        return new Promise(function(resolve) {
          if (contrast(value) === 'light') {
            if (!dark) {
              decl.value = black;
            }
            else {
              decl.value = opts.dark;
            }
            resolve();
          }
          else {
            if (!light) {
              decl.value = white;
            }
            else {
              decl.value = opts.light;
            }
            resolve();
          }
        });
      });
    }
  };
};
contrastPlugin.postcss = true;

const config = {
  plugins: [
    require('stylelint')({}),
    require('postcss-import'),
    require('postcss-autoreset')({
      reset: {
        'animation': 'none 0s ease 0s 1 normal none running',
        'background': 'transparent none repeat 0 0 / auto auto padding-box border-box scroll',
        'border': 'none',
        'border-collapse': 'collapse',
        'border-image': 'none',
        'border-radius': '0',
        'border-spacing': '0',
        'bottom': 'auto',
        'box-shadow': 'none',
        'box-sizing': 'border-box',
        'caption-side': 'top',
        'clear': 'none',
        'clip': 'auto',
        'color': '#5f768a',
        'columns': 'auto',
        'column-count': 'auto',
        'column-fill': 'balance',
        'grid-column-gap': 'normal',
        'column-gap': 'normal',
        'column-rule': 'medium none currentColor',
        'column-span': '1',
        'column-width': 'auto',
        'content': 'none',
        'cursor': 'auto',
        'display': 'initial',
        'float': 'none',
        'font-family': 'inherit',
        'font-size': 'var(--font-size-base)',
        'font-style': 'normal',
        'font-variant': 'normal',
        'font-weight': 'normal',
        'font-stretch': 'normal',
        'line-height': 'var(--line-height-base)',
        'height': 'auto',
        'hyphens': 'none',
        'left': 'auto',
        'letter-spacing': 'none',
        'list-style': 'none',
        'margin': '0',
        'max-height': 'none',
        'max-width': 'none',
        'min-height': '0',
        'min-width': '0',
        'opacity': '1',
        'outline': 'none',
        'overflow': 'visible',
        'overflow-x': 'visible',
        'overflow-y': 'visible',
        'padding': '0',
        'position': 'static',
        'right': 'auto',
        'table-layout': 'auto',
        'text-align': 'left',
        'text-align-last': 'auto',
        'text-decoration': 'none',
        'text-indent': '0',
        'text-shadow': 'none',
        'text-transform': 'none',
        'top': 'auto',
        'transform': 'none',
        'transform-origin': '50% 50% 0',
        'transform-style': 'flat',
        'transition': 'none',
        'vertical-align': 'baseline',
        'visibility': 'visible',
        'white-space': 'normal',
        'width': 'auto',
        'word-spacing': 'normal',
        'z-index': 'auto'
      },
      rulesMatcher: 'suit'
    }),
    require('postcss-color-mod-function'),
    require('postcss-extend-rule')({
      onFunctionalSelector: 'warn',
      onRecursiveExtend: 'throw',
      onUnusedExtend: 'warn'
    }),
    require('postcss-preset-env')({
      stage: 0,
      features: {
        'custom-properties': {
          preserve: false,
          warnings: true
        },
        'nesting-rules': true
      }
    }),
    require('postcss-flexbugs-fixes'),
    contrastPlugin(),
    require("postcss-reporter")({ clearReportedMessages: true })
  ]
}

module.exports = config
