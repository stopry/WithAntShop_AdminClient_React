import {Reducer} from 'redux';
import {Effect} from '@/models/connect';
import {fetchList,fetchRemove,fetchCreate,fetchUpdate} from '@/services/order';
import {formatTime} from '@/utils/utils';

export interface IOrderModelState {
  list: IOrder[];//IOrder类型的数组
}

//订单类型接口定义
export interface IOrder{
  username?:string;//用户名
  amount?:string;//金额
  productor?:string;//产品
  remark?:string;//备注
  createTime?:string;//创建时间
  id?:string;//id
}

export interface IOrderModel{
  namespace:'order';
  state:IOrderModelState,
  effects:{
    //获取列表
    fetchList:Effect;
    //删除指定订单
    fetchRemove:Effect;
    fetchCreate:Effect;
    fetchUpdate:Effect;
  };
  reducers:{
    saveList:Reducer
  }
}

const OrderModel:IOrderModel = {
  namespace:'order',
  state:{
    list:[],
  },
  effects:{
    *fetchList({payload},{call,put}){
      const response = yield call(fetchList,payload);
      console.log(response.data.list,'订单数据');
      if(response&&response.code===200){

        const list = response.data.list.map((item)=>({
          ...item,
          createTime:formatTime(item.createTime)
        }));

        yield put({
          type:'saveList',
          payload:{list,total:response.data.total}
        });
      }
    },
    *fetchRemove({payload,callback,failCallBack},{call}){
      const response = yield call(fetchRemove,payload);
      console.log(response,'wode fff')
      if(response&&response.code===200){
        callback&&callback();
      }else{
        failCallBack&&failCallBack()
      }
    },
    *fetchCreate({payload,callback},{call}){
      const response = yield call(fetchCreate,payload);
      if(response&&response.code===200){
        callback&&callback();
      }
    },
    *fetchUpdate({payload,callback},{call}){
      const response = yield call(fetchUpdate,payload);
      if(response&&response.code===200){
        callback&&callback();
      }
    },

  },
  reducers:{
    saveList(state,{payload}){
      return{
        ...state,
        list:payload 
      }
    }
  }
}

export default OrderModel;