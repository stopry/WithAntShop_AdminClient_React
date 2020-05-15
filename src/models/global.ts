import { Reducer } from 'redux';
import { fetchNotices } from '@/services/global';
import { Effect } from '@/models/connect';

export interface IGlobalModelState {
  notices: any[];
}

export interface IGlobalModel {
  name: 'global',
  state: IGlobalModelState,
  effects: {
    fetchQueryNotices: Effect;
  },
  reducers: {
    saveNotices: Reducer<any>;
  },
  subscriptions:any
}

const GlobalModel: IGlobalModel = {
  name: 'global',
  state: {
    notices: []
  },
  effects: {
    *fetchQueryNotices(_, { call, put, select }) {
      const response = yield call(fetchNotices);
      if (response && response.code === 200) {
        const notices = response.data || [];
        yield put({
          type: 'saveNotices',
          payload: notices
        });
        const unreadCount = yield select(
          (state) => state.global.notices.filter((item) => !item.read).length
        );
        yield put({
          type: 'user/changeNotifyCount',
          payload: {
            totalCount: notices.length,
            unreadCount
          }
        });
      }
    },
  },
  reducers: {
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload
      };
    }
  },
  subscriptions:{
    setup({dispatch,history}:any){
      console.log(dispatch,history);
      return history.listen(({pathname,query}:any)=>{
        console.log(pathname,query,'监听222');
        // if(pathname.indexOf('article')>-1){
        // if(pathname.split('/').length>3){
        //   dispatch({
        //     type:'fetchLogout',
        //     payload:true
        //   })
        // }else{
        //   dispatch({
        //     type:'fetchLogout',
        //     payload:false
        //   })
        // }
      })
    }
  }
};

export default GlobalModel;
