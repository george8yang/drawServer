const express=require('express');
const router=express.Router();
//导入抽奖处理函数
const drawbg=require('../router_handler/drawFun')

router.post('/drawfun',drawbg.drawFun)

module.exports=router;