const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const eslint = require('rollup-plugin-eslint');
const minify = require('rollup-plugin-babel-minify');
const gzip = require('rollup-plugin-gzip').default;

const defaultPlugins = [
  eslint.eslint({}),
  babel({
    exclude: 'node_modules/**'
  }),
];

rollup.rollup({
  input: 'src/index.js',
  plugins: defaultPlugins
}).then(bundle => {
  bundle.write({
    name: 'FireGate',
    file: 'dist/firegate.js',
    format: 'iife',
    sourcemap: true,
  })
});

rollup.rollup({
  input: 'src/index.js',
  plugins: [ ...defaultPlugins, minify({
    comments: false,
  })],
}).then(bundle => {
  bundle.write({
    name: 'FireGate',
    file: 'dist/firegate.min.js',
    format: 'iife',
    sourcemap: true,
  })
});

rollup.rollup({
  input: 'src/index.js',
  plugins: [ ...defaultPlugins, minify({
    comments: false,
  }), gzip()],
}).then(bundle => {
  bundle.write({
    name: 'FireGate',
    file: 'dist/firegate.min.js',
    format: 'iife',
    sourcemap: true,
  })
});