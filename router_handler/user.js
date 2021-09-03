const db = require("../db/database");

//注册处理函数
exports.regUser=(req,res)=>{
    //接收表单数据
    const userinfo=req.body;
    //判单数据是否合法
    if (!userinfo.username||!userinfo.password) {
        return res.send({ status: 1, message: '用户名或密码不能为空！' });
    }
    const sqlStr='select * from usertable where username= ?';
    db.query(sqlStr,userinfo.username,(err,result)=>{
        //执行sql语句失败
        if(err){
            return res.send({status:1,message:err.message})
        }
        //用户名被占用
        if(result.length>0){
            return res.send({status:1,message:'用户名已经被占用！'})
        }
        const sql='insert into usertable set ?';
        db.query(sql,{username:userinfo.username,password:userinfo.password,isAdministrator:userinfo.isAdministrator},(err,result)=>{
            if(err){
                return res.send({status:1,message:err.message})
            }
            //sql语句执行成功，影响行数不为1
            if (result.affectedRows!==1) {
                return res.send({status:1,message:'注册失败，请稍后再试'})
            }
            res.send({status:0,message:'注册成功！'})
        })
    })
}
//游客登录处理函数
exports.login=(req,res)=>{
    const userinfo=req.body;
    const sql='select * from usertable where username=?';
    db.query(sql,userinfo.username,(err,result)=>{
        if(err){
            return res.send({status:1,message:err.message});
        }
        if (result.length!==1) {
            return res.send({status:1,message:'用户名无效，请重新输入或注册'});
        }
        if(userinfo.password!==result[0].password){
            return res.send({status:1,message:'密码错误！！！'});
        }
        //加200枚矿石
        const sql='update usertable set minerals=minerals+200 where username=?';
        db.query(sql,userinfo.username,(err,result)=>{
            if(err){
                return res.send({status:1,message:err.message});
            }
            if(result.affectedRows!==1){
                return res.send({status:1,message:"加200矿石失败！"});
            }
        })        
        res.send({
            status:0,
            message:'登录成功',
        })
    })
}
//管理员登录处理函数
exports.loginAd=(req,res)=>{
    const userinfo=req.body;
    const sql='select * from usertable where username=?';
    db.query(sql,userinfo.username,(err,result)=>{
        if(err){
            return res.send({status:1,message:err.message});
        }
        if (result.length!==1) {
            return res.send({status:1,message:'用户名无效，请重新输入或注册'});
        }
        if(userinfo.password!==result[0].password){
            return res.send({status:1,message:'密码错误！！！'});
        }
        if (result[0].isAdministrator!=1) {
            return res.send({status:1,message:'您不是管理员，没有权限！！！'});
        }
        res.send({
            status:0,
            message:'登录成功',
        })
    })
}

