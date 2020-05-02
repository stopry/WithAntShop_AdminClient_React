const CompressionWebpackPlugin = require('compression-webpack-plugin');//webpack压缩插件
const productionGzip = process.env.NODE_ENV == 'production'?true:false;//打开生产环境中gzip
const productionGzipExtensions = ['js', 'css'];//打包的文件个数
const webpack = require('webpack')
const path = require('path')
import * as IWebpackChainConfig from 'webpack-chain';

function getModulePackageName(module: { context: string }) {
  if (!module.context) return null;

  const nodeModulesPath = path.join(__dirname, '../node_modules/');
  if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
    return null;
  }

  const moduleRelativePath = module.context.substring(nodeModulesPath.length);
  const [moduleDirName] = moduleRelativePath.split(path.sep);
  let packageName: string | null = moduleDirName;
  // handle tree shaking
  if (packageName && packageName.match('^_')) {
    // eslint-disable-next-line prefer-destructuring
    packageName = packageName.match(/^_(@?[^@]+)/)![1];
  }
  return packageName;
}

export default (config:IWebpackChainConfig) => {

  config.optimization
    // share the same chunks across different modules 共享代码块
    .runtimeChunk(false)
    .splitChunks({
      chunks: 'async',
      name: 'vendors',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: (module: { context: string }) => {
            const packageName = getModulePackageName(module) || '';
            if (packageName) {
              return [
                'rc-charts',
              ].includes(packageName);
            }
            return false;
          },
          name(module: { context: string }) {
            const packageName = getModulePackageName(module);
            if (packageName) {
              if (['rc-charts', ].indexOf(packageName) >= 0) {
                return 'viz'; // visualization package
              }
            }
            return 'misc';
          },
        },
      },
    });

  // 打包优化 uglifyjs-webpack-plugin 配置
  if (process.env.NODE_ENV === 'production') {//打包配置
    config.merge({
      plugin: {
        //压缩代码配置
        install: {
          plugin: require('uglifyjs-webpack-plugin'),
          args: [{
            sourceMap: false,
            uglifyOptions: {
              compress: {
                // 删除所有的 `console` 语句
                drop_console: true,
                warnings:false,
                drop_debugger:true,
              },
              output: {
                // 最紧凑的输出
                beautify: false,
                // 删除所有的注释
                comments: false,
              },
            },
          }],
        },
        //大文件开启gzip压缩
        gzip: {
          plugin: new CompressionWebpackPlugin({
            filename: '[path].gz[query]',//老版本使用asset
            algorithm: 'gzip',
            test: new RegExp(
              '\\.(' +
              productionGzipExtensions.join('|') +
              ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
          })
        },

      },
    });

  }
};