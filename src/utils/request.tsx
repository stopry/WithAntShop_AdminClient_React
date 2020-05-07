import Axios, { AxiosRequestConfig } from 'axios';
import router from 'umi/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { AJAX_DEFAULT_CONFIG } from '@/config';
import { getCookie,getToken } from '@/utils/cookie';
import { message } from 'antd';

Axios.defaults.timeout = AJAX_DEFAULT_CONFIG.timeout;
Axios.defaults.baseURL = AJAX_DEFAULT_CONFIG.baseURL;
Axios.defaults.withCredentials = AJAX_DEFAULT_CONFIG.withCredentials;

function requestSuccess(config) {
  // 请求开始，开启进度条
  NProgress.start();
  const cookie = getCookie();
  if (cookie) {
    config.headers['Token'] = cookie;
  }
  //设置token
  const token = getToken();
  if(token){
    config.headers['Authorization'] = token;//设置jwt请求头
  }
  return config;
}

function requestFail(error) {
  console.log(error.message,'reqFail')
  return Promise.reject(error);
}

/**
 * 统一的接口的返回数据格式
 * {
 *   data: any
 *   code: number,
 *   message: string,
 * }
 * @param response
 */
function responseSuccess(response) {
  // 请求结束，关闭进度条
  NProgress.done();
  return response;
}

function responseFail(error) {
  console.log(error.message,'resFail')
  // 请求失败，也应关闭进度条
  NProgress.done();
  return Promise.reject(error);
}

// 添加拦截器
Axios.interceptors.request.use(requestSuccess, requestFail);
Axios.interceptors.response.use(responseSuccess, responseFail);

/**
 *
 * @param config
 */
export const request = (config: AxiosRequestConfig) => {
  return Axios(config)
    .then((response) => {
      const { data, code, message } = response.data;

      return {
        data: data || {},
        code,
        message
      };
    })
    .catch((error) => {
      //全局请求出错捕获- 页面提示错误信息 并返回出错信息给 dva的yield calll; 可传给effects的错误回调函数 进行具体的下一步处理
      if (!error.response) {
        message.error(error.message)
        console.log('Error', error.message);
        return error;
      }

      const code = error.response.code;

      if (code === 401) {
        router.push('/user/login');
      }

      // 开发调试
      console.log(
        `【${config.method} ${config.url}】请求失败，响应数据：%o`,
        error.response
      );
      message.error('请求失败');

      return { code, message: '' };
    });
};

export const Get = (
  url: string,
  params?: object,
  config?: AxiosRequestConfig
) => {
  return request(
    Object.assign({}, config, {
      url: url,
      params: {...params, _t: (new Date()).getTime()},
      method: 'get'
    })
  );
};

export const Post = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
) => {
  return request(
    Object.assign({}, config, {
      url: url,
      data: data,
      method: 'post'
    })
  );
};

export const Put = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
) => {
  return request(
    Object.assign({}, config, {
      url: url,
      data: data,
      method: 'put'
    })
  );
};

export const Delete = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
) => {
  return request(
    Object.assign({}, config, {
      url: url,
      data: data,
      method: 'delete'
    })
  );
};
