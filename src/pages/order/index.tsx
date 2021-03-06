import React, { useState, useMemo } from 'react';
import { connect ,useDispatch} from 'dva';
import{Button,Card,Typography,Modal,message} from 'antd';
import { ConnectProps, ConnectState } from '@/models/connect';
import Table from '@jiumao/rc-table';
import PageHeaderWrapper from '@/components/page-header-wrapper';
import styles from './index.less'
//formatMessage 作为方法调用  FormattedMessage 字符串获取
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import OrderDrawer,{TType} from './components/order-drawer';
import{IOrder} from '@/models/orders'
import {formatTime} from '@/utils/utils';

const confirm = Modal.confirm;

const OrderPage: React.FC<any> = props => {
  const dispatch = useDispatch();

  const [queryData, setQueryData] = React.useState<boolean>(false);
  const {list,loading,orderLoading,orderList} = props;
  const [visible,setVisible] = React.useState<boolean>(false);
  const [type,setType] = React.useState<TType>('create');
  const [currentOrder,setCurrentOrder] = React.useState<IOrder>({});

  React.useEffect(()=>{
    getList()
  },[queryData,setQueryData])

  const getList = ()=>{
    // dispatch({
    //   type:'order/fetchList',
    //   payload:{page:1,limit:50}
    // })

    getOrderList({
      orderStatus:0,
      pageNum:1,
      pageSize:20
    })
  }

  const getOrderList = (payload)=>{
    dispatch({
      type:'order/fetchOrder',
      payload
    })
  }



  //删除订单
  const confirmDeleteOrder = data=>{
    confirm({
      title:formatMessage({id:'app.order.remove-tips'}),
      content:'确认删除吗?',
      onOk(){
        deleteOrder(data._id); 
      }
    })
  };
  const deleteOrder = _id=>{
    dispatch({
      type:'order/fetchDeleteOrder',
      payload:{_id},
      callback:(res)=>{
        message.success('删除成功');
        getList();
      },
      failCallBack:()=>{

      }
    })
  };

  const handleTableChange = pagination=>{
    const {current,pageSize} = pagination;
    console.log("表格变化了");
  }

  const showCreateView = ()=>{
    setType('create');
    setCurrentOrder({});
    console.log(currentOrder,'新增订购')
    setVisible(true);
  }

  const showUpdateView = order =>{
    setType('update');
    console.log(order,'当前啊啊')
    setCurrentOrder(order);
    console.log(currentOrder,'当前订购')
    setVisible(true);
  }

  const handleSubmit = order=>{
    if(type==='create'){//创建一条订单
      dispatch({
        type:'order/fetchCreateOrder',
        payload:order,
        callback:()=>{
          setVisible(false);
          message.success('创建成功');
          getList();
        }
      })
    }else if(type==='update'){//更新一条订单
      dispatch({
        type:'order/fetchUpdateOrder',
        payload:order,
        callback:()=>{
          setVisible(false);
          message.success('更新成功');
          getList();
        }
      })
    }
  }

  const handleClose = ()=>{
    setVisible(false);
  }


  const col = [
    {
      title:formatMessage({id:'app.order.username'}),
      key:'userName',
      dataIndex:'userName',
    },
    {
      title:'价格',
      key:'price',
      dataIndex:'price'
    },
    {
      title:'商品',
      key:'name',
      dataIndex:'name',
      render:(text,recode)=>(
        <span>
          {recode.goods.name}
        </span>
      )
    },
    {
      title:'描述',
      key:'desc',
      dataIndex:'desc',
      render:(text,recode)=>(
        <span>
          {recode.goods.desc}
        </span>
      )
    },
    {
      title:'创建时间',
      key:'createTime',
      dataIndex:'createTime',
      render:(text,recode)=>(
        <span>
          {formatTime(recode.createTime)}
        </span>
      )
    },
    {
      title:'操作',
      key:'action',
      dataIndex:'action',
      render:(text,record)=>(
        <div className='table-action'>
          <Button
          size='small'
          type='danger'
          onClick={()=>{
            confirmDeleteOrder(record)
          }}
          >
            删除
          </Button>

          <Button
          size='small'
          type='primary'
          onClick={()=>{
            console.log(record);
            showUpdateView(record)
          }}
          >
            更新
          </Button>
        </div>
      )
    }
  ];

  const table = React.useMemo(()=>{
    return(
      <Table loading={orderLoading} rowKey={recode=>recode._id} data={orderList}  columns={col} onChange={handleTableChange}></Table>
    )
  },[props.orderList,props.orderLoading]);

  return(
    <React.Fragment>
      <PageHeaderWrapper
        title={`${formatMessage({id:'app.order.page-title'})}`}
        extra={[
          <Button key="1" type="primary" onClick={showCreateView}>
            <FormattedMessage id="app.order.add-order" />
          </Button>,
        ]}
      >
      </PageHeaderWrapper>
      <Card bordered={false}>{table}</Card>

      <OrderDrawer
        type={type}
        visible={visible}
        currentOrder={currentOrder}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />
    </React.Fragment>
  )
};

export default connect(({ order, loading }: ConnectState) => {
  return({
    list: order.list,
    orderList:order.orderList,//服务器订单列表
    loading: loading.effects['order/fetchList'],
    orderLoading: loading.effects['order/fetchOrder'],
  })
})(OrderPage);

// export default OrderPage;
