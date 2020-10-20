import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import image from '@rollup/plugin-image';
import { terser } from "rollup-plugin-terser";
import cssnext from 'postcss-cssnext';
import simplevars from 'postcss-simple-vars';
import postcssImport from 'postcss-import';
import postcssModulesValues from 'postcss-modules-values';

module.exports = [
  {
    input:  'styles/elements/settings.css',
    output: {
      file:   'dist/style.js',
      format: 'umd',
      name:   'reactComponentsStyle'
    },
    plugins: [
      postcss({
        parser:  false,
        plugins: [
          postcssImport()
        ],
        sourceMap: true,
        path: 'dist/style.css',
        extract: true,
        extensions: ['.css']
      }),
    ]
  },
  {
    input:  'src/App.jsx',
    output: {
      file:      'dist/index.js',
      format:    'umd',
      name:      'tokenField',
      sourcemap: true,
      globals:   {
        react:       'React',
        'react-dom': 'ReactDOM'
      },
      exports: 'named'
    },
    plugins: [
      image(),
      postcss({
        parser:  false,
        plugins: [
          simplevars(),
          cssnext(),
          postcssModulesValues
        ],
        modules:    true,
        extensions: ['.css']
      }),
      resolve({
        extensions: ['.js', '.jsx']
      }),
      commonjs({
        namedExports: {
          'node_modules/@deskpro/react-components/dist/index.js': [
            'Button',
            'Checkbox',
            'Colorpicker',
            'Datepicker',
            'Drawer',
            'Heading',
            'Icon',
            'Input',
            'Label',
            'List',
            'ListElement',
            'Section',
            'Select',
            'Scrollbar',
            'Tabs',
            'TabLink',
            'Textarea',
            'Toggle',
            'ToggleableList',
            'Radio',
            'Subheading',
            'Group',
            'TranslateButton',
            'Modal'
          ],
          'node_modules/immutable/dist/immutable.js': [
            'fromJS',
            'Map'
          ]
        }
      }),
      babel({
        exclude: 'node_modules/**',
        plugins: ['external-helpers']
      }),
      terser()
    ],
    external: ['react', 'react-dom']
  }
];
