const express=require('express');

const router=express.Router();
//导入获取抽奖设置信息处理函数
const drawInfo_handler=require('../router_handler/drawSet');
//导入抽奖设置处理函数
const drawSet_handler=require('../router_handler/drawSet')

router.get('/drawinfo',drawInfo_handler.drawinfo);
router.post('/drawset',drawSet_handler.drawSet);
module.exports=router;