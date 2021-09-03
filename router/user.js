const express=require('express');
//创建路由对象
const router=express.Router();
//导入用户路由处理函数
const userHandler=require('../router_handler/user');

//注册新用户
router.post('/reguser',userHandler.regUser);

//游客登录
router.post('/login',userHandler.login);
//管理员登录
router.post('/loginAd',userHandler.loginAd);

//将路由对象共享出去
module.exports=router;