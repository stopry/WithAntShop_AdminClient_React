/*
src 目录下的model services为默认加载
src/pages 目录下对应的 components、models、services 为当前页面私有 按需加载
*/
import routes from './router.config';
import plugins from './plugin.config';
import themeConfig from './theme.config';
import webpackPlugin from './webpack.plugin.config';
import path from 'path';

const { NODE_ENV } = process.env;

export interface ILocalServerConfig {
  baseURL?: string;
}

// 设置后端接口地址
let localServerConfig: ILocalServerConfig = {};
let BaseURL = '';

try {
  localServerConfig = require('./local-server.config.ts').default;
} catch (error) {}

// 开发环境使用 local-server.config.ts 中的配置
if (NODE_ENV === 'development') {
  BaseURL = localServerConfig.baseURL;
}

export default {
  plugins,
  targets: {
    // 推荐设置，项目不用考虑IE可删除
    // ie: 9
  },
  treeShaking: true,
  define: {
    BASE_URL: BaseURL
  },
  // 路由配置
  routes,
  hash: true,
  theme: themeConfig,
  ignoreMomentLocale: true,
  // 配置按需加载
  extraBabelPlugins: [
    [
      require.resolve('babel-plugin-import'),
      {
        libraryName: '@alitajs/antd-plus',
        libraryDirectory: 'es',
        style: true
      },
      'ant-plus'
    ]
  ],
  disableCSSModules: true,
  //orderApi 使用本地的 nodejs 服务
  proxy:{
    // '/orderApi':{
    //   target:'http://127.0.0.1:7001',
    //   changeOrigin: true,
    //   pathRewrite: { 
    //     // '^/api' : '' 
    //   }
    // },
    '/api':{
      target:'http://127.0.0.1:7001',
      // changeOrigin: true,
      // pathRewrite: { 
      //   // '^/api' : '' 
      // }
    }
  },
  //别名
  alias:{
    components:path.resolve(__dirname,'src/components'),
    utils:path.resolve(__dirname,'src/utils'),
    services:path.resolve(__dirname,'src/services'),
    models:path.resolve(__dirname,'src/models'),
  },
  chainWebpack: webpackPlugin,
};
