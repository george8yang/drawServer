//导入express
const express=require('express');
const app=express();
//配置 cors 跨域
// 导入 cors 中间件
const cors=require('cors');
// 将 cors 注册为全局中间件
app.use(cors());
//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }));
//导入注册登、录用户路由模块
const userRouter=require('./router/user');
app.use('/api',userRouter);
//导入获取用户信息模块
const userinfoRouter=require('./router/userinfo');
app.use('/api',userinfoRouter);
//导入奖品模块
const prizeRouter=require('./router/prizes');
app.use('/api',prizeRouter);
//导入抽奖设置模块
const drawSetRouter=require('./router/drawSet');
app.use('/api',drawSetRouter);

//导入抽奖函模块
const drawFumRouter=require('./router/drawFun');
app.use('/api',drawFumRouter);


app.listen(3007,function () {
    console.log('server running at http://127.0.0.1:3007');
});