import React, { useState, useMemo } from 'react';
import { connect ,useDispatch} from 'dva';
import{Button,Card,Typography,Modal,message} from 'antd';
import { ConnectProps, ConnectState } from '@/models/connect';
import Table from '@jiumao/rc-table';
import PageHeaderWrapper from '@/components/page-header-wrapper';
import styles from './index.less'
//formatMessage 作为方法调用  FormattedMessage 字符串获取
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import GoodsDrawer,{TType} from './components/goods-drawer';
import {formatTime} from '@/utils/utils';

const confirm = Modal.confirm;

const GoodsPage: React.FC<any> = props => {
  const dispatch = useDispatch();

  const [queryData, setQueryData] = React.useState<boolean>(false);
  const {goodsLoading,goodsList} = props;
  const [visible,setVisible] = React.useState<boolean>(false);
  const [type,setType] = React.useState<TType>('create');
  const [currentGoods,setCurrentGoods] = React.useState<any>({});

  React.useEffect(()=>{
    getList()
  },[queryData,setQueryData])

  const getList = ()=>{
    getGoodsList({
      pageNum:1,
      pageSize:20
    })
  }

  const getGoodsList = (payload)=>{
    dispatch({
      type:'goods/fetchGoods',
      payload
    })
  }

  console.log(goodsList,'这里面的商品');


  //删除商品
  const confirmDeleteGoods = data=>{
    confirm({
      title:formatMessage({id:'app.order.remove-tips'}),
      content:'确认删除吗?',
      onOk(){
        deleteGoods(data._id); 
      }
    })
  };
  const deleteGoods = _id=>{
    dispatch({
      type:'order/fetchDeleteGoods',
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
    setCurrentGoods({});
    console.log(currentGoods,'新增订购')
    setVisible(true);
  }

  const showUpdateView = goods =>{
    setType('update');
    console.log(goods,'当前啊啊')
    setCurrentGoods(goods);
    console.log(currentGoods,'当前订购')
    setVisible(true);
  }

  const handleSubmit = goods=>{
    if(type==='create'){//创建一条订单
      dispatch({
        type:'goods/fetchCreateGoods',
        payload:goods,
        callback:()=>{
          setVisible(false);
          message.success('创建成功');
          getList();
        }
      })
    }else if(type==='update'){//更新一条订单
      dispatch({
        type:'goods/fetchUpdateGoods',
        payload:goods,
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
      title:'商品名称',
      key:'title',
      dataIndex:'title',
    },
    {
      title:'价格',
      key:'price',
      dataIndex:'price'
    },
    {
      title:'库存',
      key:'stock',
      dataIndex:'stock',
      render:(text,recode)=>(
        <span>
          {recode.stock}
        </span>
      )
    },
    {
      title:'描述',
      key:'des',
      dataIndex:'des',
    },
    {
      title:'邮费',
      key:'express',
      dataIndex:'express',
      render:(text,recode)=>(
        <span>
          {recode.express?'￥'+recode.express:'免邮'}
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
            confirmDeleteGoods(record)
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
      <Table loading={goodsLoading} rowKey={recode=>recode._id} data={goodsList}  columns={col} onChange={handleTableChange}></Table>
    )
  },[props.goodsList,props.goodsLoading]);

  return(
    <React.Fragment>
      <PageHeaderWrapper
        title={`商品管理`}
        extra={[
          <Button key="1" type="primary" onClick={showCreateView}>
            {`新增商品`}
          </Button>,
        ]}
      >
      </PageHeaderWrapper>
      <Card bordered={false}>{table}</Card>

      <GoodsDrawer
        type={type}
        visible={visible}
        currentGoods={currentGoods}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />
    </React.Fragment>
  )
};

export default connect(({ goods, loading }: ConnectState) => {
  return({
    goodsList:goods.goodsList,//服务器订单列表
    goodsLoading: loading.effects['goods/fetchGoods'],
  })
})(GoodsPage);

// export default OrderPage;
