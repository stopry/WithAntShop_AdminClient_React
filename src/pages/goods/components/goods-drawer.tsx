import React from 'react';
import {Form,Input,message} from 'antd';
import {FormComponentProps} from 'antd/es/form';
import DrawerWrapper from '@/components/drawer-wrapper';

export type TType = 'create'|'update';//声明操作订单类型 创建或更新

//定义数据接口类型 继承antd form组件的属性
interface IProps extends FormComponentProps{
  type?:TType;
  currentGoods?:any;//当前订单
  visible?:boolean;
  onClose?:()=>void;
  onSubmit?:(values)=>void;
}

const {TextArea} = Input;

const GoodsDrawer:React.FC<IProps> = props=>{
  const {visible,onClose,onSubmit,form,type,currentGoods} = props;

  const {getFieldDecorator} = form;
  const [title,setTitle] = React.useState<string>('');//编辑框标题

  //useEffect 监听props.type的值改变编辑框的标题
  React.useEffect(()=>{
    setTitle(type==='create'?'添加商品':'更新商品');
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
          data._id = currentGoods._id;
        }else{
          message.warn('功能完善中');
          return;
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
        <Form.Item {...formItemLayout} label="商品名称">
          {
            getFieldDecorator('title',{
              initialValue:currentGoods.title,
              rules:[
                {
                  required:true,
                  message:'商品名不能为空',
                }
              ]
            })(<Input placeholder='请输入商品名称'/>)
          }
        </Form.Item>
        <Form.Item {...formItemLayout} label="价格">
          {
            getFieldDecorator('price',{
              initialValue:currentGoods.price,
              rules:[
                {
                  required:true,
                  message:'价格不能为空'
                }
              ]
            })(<Input placeholder='请输入价格'/>)
          }
        </Form.Item>  
        <Form.Item {...formItemLayout} label="库存">
          {
            getFieldDecorator('stock',{
              initialValue:currentGoods.stock,
              rules:[
                {
                  required:true,
                  message:'库存不能为空'
                }
              ]
            })(<Input placeholder='请输输入库存'/>)
          }
        </Form.Item>  
        <Form.Item {...formItemLayout} label="描述">
          {
            getFieldDecorator('des',{
              initialValue:currentGoods.des,
              rules:[
                {
                  required:false,
                  message:'备注不能为空'
                }
              ]
            })(<Input placeholder='请填写备注'/>)
          }
        </Form.Item>  
        <Form.Item {...formItemLayout} label="邮费">
          {
            getFieldDecorator('express',{
              initialValue:currentGoods.express,
              rules:[
                {
                  required:false,
                  message:'邮费'
                }
              ]
            })(<Input placeholder='邮费'/>)
          }
        </Form.Item>  
      </Form>

    </DrawerWrapper>
  ) 
}
GoodsDrawer.defaultProps = {
  visible:false,
  currentGoods:{},
}
export default Form.create<IProps>()(GoodsDrawer);