import React from 'react';
import {Form,Input} from 'antd';
import {FormComponentProps} from 'antd/es/form';
import DrawerWrapper from '@/components/drawer-wrapper';
import{IOrder} from '@/models/orders'

export type TType = 'create'|'update';//声明操作订单类型 创建或更新

//定义数据接口类型 继承antd form组件的属性
interface IProps extends FormComponentProps{
  type?:TType;
  currentOrder?:IOrder;//当前订单
  visible?:boolean;
  onClose?:()=>void;
  onSubmit?:(values)=>void;
}

const {TextArea} = Input;

const OrderDrawer:React.FC<IProps> = props=>{
  const {visible,onClose,onSubmit,form,type,currentOrder} = props;
  const {getFieldDecorator} = form;
  const [title,setTitle] = React.useState<string>('');//编辑框标题

  //useEffect 监听props.type的值改变编辑框的标题
  React.useEffect(()=>{
    setTitle(type==='create'?'添加订单':'更新订单');
  },[props.type]);

  //清空表单
  React.useEffect(()=>{
    if(!visible){
      form.resetFields();
    }
  },[props.visible]);

  //表单提交回调
  const handleConfirm = ()=>{
    form.validateFields((error,values)=>{
      if(!error){
        const data = {...values};
        if(type==='update'){
          data.id = currentOrder.id;
        }
        onSubmit&&onSubmit(data);//执行传入的onSubmit方法
      }
    })
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 15 },
    },
  };
  return(
    <DrawerWrapper
      visible={visible}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleConfirm}
      width={600}
      title={title}
    >
      <Form>
        <Form.Item {...formItemLayout} label="用户名">
          {
            getFieldDecorator('username',{
              initialValue:currentOrder.username,
              rules:[
                {
                  required:true,
                  message:'用户名不能为空',
                }
              ]
            })(<Input placeholder='请输入用户名'/>)
          }
        </Form.Item>
        <Form.Item {...formItemLayout} label="余额">
          {
            getFieldDecorator('amount',{
              initialValue:currentOrder.amount,
              rules:[
                {
                  required:true,
                  message:'余额不能为空'
                }
              ]
            })(<Input placeholder='请输入余额'/>)
          }
        </Form.Item>  
        <Form.Item {...formItemLayout} label="产品">
          {
            getFieldDecorator('productor',{
              initialValue:currentOrder.productor,
              rules:[
                {
                  required:true,
                  message:'产品不能为空'
                }
              ]
            })(<Input placeholder='请输选择产品'/>)
          }
        </Form.Item>  
        <Form.Item {...formItemLayout} label="描述">
          {
            getFieldDecorator('remark',{
              initialValue:currentOrder.remark,
              rules:[
                {
                  required:false,
                  message:'备注不能为空'
                }
              ]
            })(<Input placeholder='请填写备注'/>)
          }
        </Form.Item>  
        <Form.Item {...formItemLayout} label="创建时间">
          {
            getFieldDecorator('createTime',{
              initialValue:currentOrder.createTime,
              rules:[
                {
                  required:false,
                  message:'创建时间'
                }
              ]
            })(<Input disabled placeholder='创建时间'/>)
          }
        </Form.Item>  
      </Form>

    </DrawerWrapper>
  ) 
}
OrderDrawer.defaultProps = {
  visible:false,
  currentOrder:{},
}
export default Form.create<IProps>()(OrderDrawer);