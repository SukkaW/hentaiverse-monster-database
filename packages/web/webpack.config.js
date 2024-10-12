const process = require('node:process');
const path = require('node:path');
const LightningCSS = require('lightningcss');
const browserslist = require('browserslist');
const { defineReactCompilerLoaderOption, reactCompilerLoader } = require('react-compiler-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBarPlugin = require('webpackbar');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { LightningCssMinifyPlugin } = require('lightningcss-loader');

const isDevelopment = process.env.NODE_ENV !== 'production';
const isAnalyze = !!process.env.ANALYZE;

const topLevelFrameworkPaths = isDevelopment ? [] : getTopLevelFrameworkPaths();

module.exports = /** @type {import('webpack').Configuration} */ ({
  mode: isDevelopment ? 'development' : 'production',
  output: {
    library: '_SKK',
    filename: isDevelopment ? '[name].js' : '[contenthash].js',
    cssFilename: isDevelopment ? '[name].css' : '[contenthash].css',
    hotUpdateChunkFilename: '[id].[fullhash].hot-update.js',
    hotUpdateMainFilename: '[fullhash].[runtime].hot-update.json',
    webassemblyModuleFilename: '[contenthash].wasm',

    path: path.resolve(__dirname, 'dist'),

    asyncChunks: true,
    crossOriginLoading: 'anonymous',

    hashFunction: 'xxhash64',
    hashDigestLength: 16
  },
  devtool: isDevelopment ? 'eval-source-map' /** eval-cheap-module-source-map */ : false,
  devServer: {
    port: 3000,
    historyApiFallback: true
  },
  externals: {
    'text-encoding': 'TextEncoder',
    'whatwg-url': 'window',
    '@trust/webcrypto': 'crypto',
    'isomorphic-fetch': 'fetch',
    'node-fetch': 'fetch',
    // Add this to bundle @undecaf/zbar.wasm
    module: 'module'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'lightningcss-loader',
            options: {
              implementation: LightningCSS
            }
          },
          // for tailwindcss support
          'postcss-loader'
        ]
      },
      {
        test: /assets\//,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[hash][ext][query]'
        }
      },
      {
        test: /\.[cm]?tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'swc-loader',
            options: getSwcOptions(true)
          },
          {
            loader: reactCompilerLoader,
            options: defineReactCompilerLoaderOption({
              // React Compiler options goes here
              target: '18'
            })
          }
        ]
      },
      {
        test: /\.[cm]?t=jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'swc-loader',
            options: getSwcOptions(false)
          },
          {
            loader: reactCompilerLoader,
            options: defineReactCompilerLoaderOption({
              // React Compiler options goes here
            })
          }
        ]
      }
    ]
  },
  plugins: [
    !isDevelopment && new CleanWebpackPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'import.meta.env.DEV': isDevelopment.toString(),
      'import.meta.env.PROD': (!isDevelopment).toString(),
      'typeof window': JSON.stringify('object'),
      // 将所有以 PUBLIC_ 开头的环境变量内联到应用中
      ...Object.entries(process.env).reduce((acc, [key, value]) => {
        if (key.startsWith('PUBLIC_')) {
          acc[`process.env.${key}`] = JSON.stringify(value);
        }
        return acc;
      }, /** @type {Record<string, string>} */({}))
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    isAnalyze && new BundleAnalyzerPlugin({
      analyzerMode: 'static'
    }),
    new WebpackBarPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.jsx', '.mjs', '.cjs', '.js', '.json'],
    cache: true,
    unsafeCache: false,
    conditionNames: ['import', 'require', 'default'],
    plugins: [
      new TsconfigPathsPlugin({
        // tsconfig-paths-webpack-plugin can't access `resolve.extensions`
        // have to provide again
        extensions: ['.ts', '.tsx', '.jsx', '.mjs', '.cjs', '.js', '.json']
      })
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        framework: {
          chunks: 'all',
          name: 'framework',
          test(module) {
            const resource = module.nameForCondition?.();
            return resource
              ? topLevelFrameworkPaths.some((pkgPath) => resource.startsWith(pkgPath))
              : false;
          },
          priority: 40,
          enforce: true
        }
      }
    },
    runtimeChunk: {
      name: 'webpack'
    },
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.swcMinify,
        terserOptions: {
          compress: {
            ecma: 5,
            comparisons: false,
            inline: 2 // https://github.com/vercel/next.js/issues/7178#issuecomment-493048965
          },
          mangle: { safari10: true },
          format: {
            // use ecma 2015 to enable minify like shorthand object
            ecma: 2015,
            safari10: true,
            comments: false,
            // Fixes usage of Emoji and certain Regex
            ascii_only: true
          }
        }
      }),
      new LightningCssMinifyPlugin()
    ]
  },
  cache: {
    type: 'filesystem',
    maxMemoryGenerations: isDevelopment ? 5 : Infinity,
    cacheDirectory: path.join(__dirname, 'node_modules', '.cache', 'webpack'),
    compression: isDevelopment ? 'gzip' : false
  },
  experiments: {
    css: true, // 不能和 css-loader 和 mini-css-extract-plugin 一起启用
    cacheUnaffected: true
  }
});

/**
 * @param {string} [dir]
 */
function getSupportedBrowsers(dir = __dirname) {
  try {
    return browserslist.loadConfig({
      path: dir,
      env: isDevelopment ? 'development' : 'production'
    });
  } catch { }
}

/**
 * @param {boolean} useTypeScript
 */
function getSwcOptions(useTypeScript) {
  const supportedBrowsers = getSupportedBrowsers();

  return /** @type {import('@swc/core').Options} */ ({
    jsc: {
      parser: useTypeScript
        ? {
          syntax: 'typescript',
          tsx: true
        }
        : {
          syntax: 'ecmascript',
          jsx: true,
          importAttributes: true
        },
      externalHelpers: true,
      loose: false,
      transform: {
        react: {
          runtime: 'automatic',
          refresh: isDevelopment,
          development: isDevelopment
        },
        optimizer: {
          simplify: true,
          globals: {
            typeofs: {
              window: 'object'
            },
            envs: {
              NODE_ENV: isDevelopment ? '"development"' : '"production"'
            }
          }
        }
      }
    },
    env: {
      // swc-loader don't read browserslist config file, manually specify targets
      targets: supportedBrowsers?.length > 0 ? supportedBrowsers : 'defaults, chrome > 70, edge >= 79, firefox esr, safari >= 11, not dead, not ie > 0, not ie_mob > 0, not OperaMini all',
      mode: 'usage',
      loose: false,
      coreJs: require('core-js/package.json').version,
      shippedProposals: false
    }
  });
}

function getTopLevelFrameworkPaths(frameworkPackages = ['react', 'react-dom'], dir = path.resolve(__dirname)) {
  // Only top-level packages are included, e.g. nested copies like
  // 'node_modules/meow/node_modules/react' are not included.
  const topLevelFrameworkPaths = [];
  const visitedFrameworkPackages = new Set();

  // Adds package-paths of dependencies recursively
  const addPackagePath = (packageName, relativeToPath) => {
    try {
      if (visitedFrameworkPackages.has(packageName)) return;
      visitedFrameworkPackages.add(packageName);

      const packageJsonPath = require.resolve(`${packageName}/package.json`, {
        paths: [relativeToPath]
      });

      // Include a trailing slash so that a `.startsWith(packagePath)` check avoids false positives
      // when one package name starts with the full name of a different package.
      // For example:
      //   "node_modules/react-slider".startsWith("node_modules/react")  // true
      //   "node_modules/react-slider".startsWith("node_modules/react/") // false
      const directory = path.join(packageJsonPath, '../');

      // Returning from the function in case the directory has already been added and traversed
      if (topLevelFrameworkPaths.includes(directory)) return;
      topLevelFrameworkPaths.push(directory);

      const dependencies = require(packageJsonPath).dependencies || {};
      for (const name of Object.keys(dependencies)) {
        addPackagePath(name, directory);
      }
    } catch {
      // don't error on failing to resolve framework packages
    }
  };

  for (const packageName of frameworkPackages) {
    addPackagePath(packageName, dir);
  }

  return topLevelFrameworkPaths;
}
