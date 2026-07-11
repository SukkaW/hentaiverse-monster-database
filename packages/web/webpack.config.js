const path = require('node:path');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = require('tailpack').reactSpa({
  cwd: __dirname,
  entry: './src/index.tsx',
  output: {
    library: '_SKK',
    path: path.resolve(__dirname, 'dist'),
    filenamePrefix: '/_sukka/static/',
    crossOriginLoading: 'anonymous'
  },
  webpackExperimentalBuiltinCssSupport: true,
  devServerPort: 3000,
  externals: {
    'text-encoding': 'TextEncoder',
    'whatwg-url': 'window',
    '@trust/webcrypto': 'crypto',
    'isomorphic-fetch': 'fetch',
    'node-fetch': 'fetch',
    // Add this to bundle @undecaf/zbar.wasm
    module: 'module'
  },
  analyze: process.env.ANALYZE === 'true',
  postcss: true
}, {
  resolve: {
    tsconfig: {
      configFile: path.resolve(__dirname, 'tsconfig.json')
    }
  },
  cache: {
    type: 'filesystem',
    maxMemoryGenerations: isDevelopment ? 5 : Infinity,
    cacheDirectory: path.join(__dirname, 'node_modules', '.cache', 'webpack'),
    compression: isDevelopment ? 'gzip' : false
  }
});
