import { IPlugin } from 'umi-types';

const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true
      },
      locale: {
        enable: true,
        default: 'zh-CN',
        baseNavigator: true
      },
      dynamicImport: {
        loadingComponent: './components/page-loading/index',
        webpackChunkName: true,
        level: 3
      },
      dll: {
        exclude: ['@babel/runtime', 'netlify-lambda'],
      },
      hd: false,
      fastClick: false,
      hardSource:false,//开启后第二次打包速度加快
    }
  ],
  [
    '@alitajs/umi-plugin-deploy-config',
    {
      baseURL: '/'
    }
  ],
  [
    'umi-plugin-cache-route',
    {
      // keepalive: ['/dashboard/dnalysis', '/dashboard', '/'], //缓存路由，相当于vue的keepalive组件
    },
  ],
];

export default plugins;
