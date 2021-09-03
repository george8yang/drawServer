const db = require("../db/database");
//奖品信息获取
exports.getPrizes = (req, res) => {
  const sql = "select * from prizetable ";
  db.query(sql, (err,result) => {
    if (err) {
      return res.send({ status: 1, message: err.message });
    }
    res.send({ status: 0, message: '获取奖品信息成功！',data:result})
  });
};
//奖品信息修改
exports.editPrizes=(req,res)=>{
  
  if (req.body.id==8) {
    if (req.body.number!=0) {
      return res.send({status: 1, message: '未中奖数量只能设置为0！' })
    }    
  }
  if (req.body.number<0) {
    return res.send({status: 1, message: '数量必须大于等于0！' })
  }
  const sql="update prizetable set ? where id=?";
  db.query(sql,[req.body,req.body.id],(err,result)=>{
    if (err) {
      return res.send({ status: 1, message: err.message });
    }
    if(result.affectedRows!==1){
      return res.send({status: 1, message: '更新奖品信息失败！' })
    }
    res.send({ status: 0, message: '获取奖品信息成功！'})
  })
}
