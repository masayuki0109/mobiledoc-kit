import path from 'path'
import globImport from 'rollup-plugin-glob-import'
import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import serve from 'rollup-plugin-serve'
import copy from 'rollup-plugin-copy'
import typescript from '@rollup/plugin-typescript'

function commonPlugins() {
  return [
    resolve({ extensions: ['.js', '.ts'] }),
    commonjs(),
    alias({
      entries: [
        {
          find: 'mobiledoc-kit',
          replacement: path.join(__dirname, 'src/js'),
        },
      ],
    }),
    typescript(),
  ]
}

export default args => [
  {
    input: 'src/js/index.js',
    plugins: commonPlugins(),
    output: {
      file: 'dist/mobiledoc.js',
      format: 'es',
      sourcemap: true
    }
  },
  {
    input: 'src/js/index.js',
    plugins: commonPlugins(),
    output: {
      file: 'dist/mobiledoc.cjs',
      format: 'cjs',
      sourcemap: true
    }
  },
  {
    input: 'tests/index.js',
    plugins: [
      ...commonPlugins(),
      globImport(),
      copy({
        targets: [
          { src: 'dist/mobiledoc.js', dest: 'assets/demo' },
          { src: 'src/css/mobiledoc-kit.css', dest: 'dist', rename: 'mobiledoc.css' },
          { src: 'src/css/mobiledoc-kit.css', dest: 'assets/demo/', rename: 'mobiledoc.css' },
        ],
      }),
      args.watch &&
        serve({
          contentBase: '',
          // eslint-disable-next-line no-process-env
          port: process.env.PORT || 4200,
        }),
    ],
    output: {
      file: 'dist/tests.js',
      format: 'es',
      sourcemap: true,
    },
  },
]
