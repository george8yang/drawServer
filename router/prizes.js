const express=require('express');

const router=express.Router();
//导入获取奖品信息处理函数
const prizeinfo_handler=require('../router_handler/prizes');

router.get('/prizes',prizeinfo_handler.getPrizes);

router.post('/edit',prizeinfo_handler.editPrizes);
module.exports=router;