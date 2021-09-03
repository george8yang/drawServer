const express=require('express');

const router=express.Router();
//导入获取用户信息处理函数
const userinfo_handler=require('../router_handler/userinfo');

router.get('/userinfo',userinfo_handler.getUserInfo);

module.exports=router;