import {mock,Random} from 'mockjs';
let Orders = [];
const count = 100;

for(let i = 0;i<count;i++){
  Orders.push(
    mock({
      id:'@guid',
      username:'@first',
      amount:'100',
      productor:'皮鞋',
      remark:'@cparagraph(1)',
      createTime:+Random.date('T'),
    })
  )
}

function fetchCurrent(req,res){
  res.send({
    code:200,
    data:{
      id:'@guid',
      username:'@first',
      amount:'100',
      productor:'皮鞋',
      remark:'@cparagraph(1)',
      createTime:+Random.date('T'),
    },
    message:'获取成功'
  })
}

function fetchList(req,res){
  const {page=1,limit=10} = req.query;
  const pageList = Orders.filter((item,index)=>{
    return index<limit*page&&index>=limit*(page-1);
  })

  res.send({
    code:200,
    message:'success',
    data:{
      list:pageList,
      total:Orders.length
    }
  })
}

function fetchCreate(req,res){
  const data = req.body;
  Orders.unshift({
    ...data,
    id:Random.guid(),
    createTime:new Date().getTime(),
  })
  res.send({
    code:200,
    message:'success',
    data:{}
  })
}

function fetchUpdate(req,res){
  const data = req.body;
  const userId = data.id;
  Orders = Orders.map(item=>{
    if(item.id===userId){
      return data;
    }else{
      return item;
    }
  });

  res.send({
    code:200,
    message:'success',
    data:{},
  })
}

function fetchRemove(req,res){
  const {orderId} = req.params;
  Orders = Orders.filter(item=>item.id!==orderId);
  res.send({
    code:200,
    message:'success',
    data:{}
  })
}

export default{
  'POST /api/orders/create':fetchCreate,
  'PUT /api/orders/update':fetchUpdate,
  'DELETE /api/orders/remove/:orderId':fetchRemove,
  'GET /api/orders/list':fetchList,
  'GET /api/orders/current':fetchCurrent,
}