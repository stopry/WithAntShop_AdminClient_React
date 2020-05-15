import {Reducer} from 'redux';
import {Effect} from '@/models/connect';
import {formatTime} from '@/utils/utils';
import {fetchGoods,fetchDeleteGoods,fetchUpdateGoods} from '@/services/goods';

const GoodsModel = {
  namespace:'goods',
  state:{
    goodsList:[],
  },
  effects:{
    *fetchGoods({payload,callback},{call,put}){
      const response = yield call(fetchGoods,payload);
      if(response&&response.success){
        callback&&callback(response);
        console.log(response,'商品列表');
        yield put({
          type:'getGoods',
          payload:response.data.list
        })
      }
    },
    *fetchDeleteGoods({payload,callback,failCallback},{call,put,select}){
      const response = yield call(fetchDeleteGoods,payload);
      if(response&&response.success){
        callback&&callback(response);
      }else{
        failCallback&&failCallback()
      }
    },
    *fetchUpdateGoods({payload,callback,failCallback},{call,put,select}){
      const response = yield call(fetchUpdateGoods,payload);
      if(response&&response.success){
        callback&&callback(response);
      }else{
        failCallback&&failCallback();
      }
    }
  },
  reducers:{
    getGoods(state,{payload}){
      return{
        ...state,
        goodsList:{
          list:payload,total:20
        }
      }
    }
  }
}

export default GoodsModel;