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

const confirm = Modal.confirm;

const OrderPage: React.FC<any> = props => {
  const dispatch = useDispatch();

  const [queryData, setQueryData] = React.useState<boolean>(false);
  const {list,loading} = props;
  const [visible,setVisible] = React.useState<boolean>(false);
  const [type,setType] = React.useState<TType>('create');
  const [currentOrder,setCurrentOrder] = React.useState<IOrder>({});

  React.useEffect(()=>{
    getList()
  },[queryData,setQueryData])

  const getList = ()=>{
    dispatch({
      type:'order/fetchList',
      payload:{page:1,limit:50}
    })
  }

  const handlerConfirmRemove = data=>{
    confirm({
      title:formatMessage({id:'app.order.remove-tips'}),
      content:'操作不可逆,请确定是否删除',
      onOk(){
        handleRemove(data.id);
      }
    })
  }
  const handleRemove = orderId=>{
    dispatch({
      type:'order/fetchRemove',
      payload:orderId,
      callback:()=>{
        message.success('删除成功');
        getList();
      },
      failCallBack(){
       /*todo 执行下一步*/
      }
    })
  }

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
        type:'order/fetchCreate',
        payload:order,
        callback:()=>{
          setVisible(false);
          message.success('创建成功');
          getList();
        }
      })
    }else if(type==='update'){//更新一条订单
      dispatch({
        type:'order/fetchUpdate',
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
      dataIndex:'username',
    },
    {
      title:'余额',
      dataIndex:'amount'
    },
    {
      title:'商品',
      dataIndex:'productor',
    },
    {
      title:'描述',
      dataIndex:'remark'
    },
    {
      title:'创建时间',
      dataIndex:'createTime'
    },
    {
      title:'操作',
      key:'action',
      render:(text,record)=>(
        <div className='table-action'>
          <Button 
          size='small' 
          type='danger'
          onClick={()=>{
            handlerConfirmRemove(record)
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
      <Table loading={loading} data={list}  columns={col} onChange={handleTableChange}></Table>
    )
  },[props.list,props.loading]);  

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
    loading: loading.effects['order/fetchList'],
  })
})(OrderPage);

// export default OrderPage;