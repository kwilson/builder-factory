const path = require('path');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');

const pck = require('./package.json');

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

module.exports = {
  input: './src/index.ts',
  output: [
    {
      file: path.resolve(__dirname, pck.main),
      format: 'cjs'
    },
    {
      file: path.resolve(__dirname, pck.module),
      format: 'esm'
    },
],
  plugins: [
    resolve({ extensions }),
    commonjs(),
    babel({
      extensions,
      presets: [
        "@babel/env",
        "@babel/typescript"
      ],
    })
  ],
};
