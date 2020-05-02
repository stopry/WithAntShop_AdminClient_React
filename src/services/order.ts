import { Get, Post, Put, Delete } from '@/utils/request';

// 获取订单列表
export async function fetchList(params) {
  return Get('orders/list', params);
}

// 获取订单详情
export async function fetchOrderDetail(params) {
  return Get('orders/current', params);
}

// 创建订单
// export async function fetchCreate(data) {
//   return Post('orders/create', data);
// }

export async function fetchCreate(data) {
  return Post('/createOrder', data,{baseURL:'/orderApi/'});
}

// 删除订单
export async function fetchRemove(orderId) {
  return Delete(`orders/remove/${orderId}`);
}

// 更新订单
export async function fetchUpdate(data) {
  return Put('orders/update', data);
}
