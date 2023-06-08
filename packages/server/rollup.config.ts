import { swc, defineRollupSwcOption } from 'rollup-plugin-swc3';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import { defineConfig } from 'rollup';

import * as pkgJson from './package.json';

export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  external: Object.keys(pkgJson.dependencies),
  plugins: [
    commonjs({ esmExternals: true }),
    nodeResolve({ exportConditions: ['import', 'require', 'default'] }),
    swc(defineRollupSwcOption({
      jsc: { externalHelpers: false, target: 'es2019' }
    }))
  ]
});
