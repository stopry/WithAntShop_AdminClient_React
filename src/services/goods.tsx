import {Get,Post} from '@/utils/request';

//获取商品列表
export async function fetchGoods(payload){
  return Get('admin/goods',payload);
}

//删除商品
export async function fetchDeleteGoods(payload){
  return Get('admin/deleteGoods',payload);
}

//编辑商品
export async function fetchUpdateGoods(payload){
  return Post('admin/updateGoods',payload);
}
