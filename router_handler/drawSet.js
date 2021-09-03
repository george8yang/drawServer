const db = require("../db/database");
//抽奖设置信息获取
exports.drawinfo=(req,res)=>{
  const sql='select * from drawset';
  db.query(sql,(err,result)=>{
    if (err) {
      return res.send({ status: 1, message: err.message });
    }
    if (result.length !== 1) {
      return res.send({ status: 1, message: "获取抽奖设置信息失败！" });
    }
    return res.send({ status: 0, message: "获取抽奖设置信息成功！",data:result[0] });
  })
}



//抽奖设置处理函数
exports.drawSet = (req, res) => {
  let data = req.body;
  if (data.probability > 1 || data.probability < 0) {
    return res.send({
      status: 1,
      message: "设置失败，中奖概率应该在0~1之间。",
    });
  }
  const sqlStr = "select  sum(number) from prizetable where id<>8";
  db.query(sqlStr, (err, result) => {
    if (err) {
      return res.send({ status: 1, message: err.message });
    }
    if (result.length !== 1) {
      return res.send({ status: 1, message: "获取奖品总数失败！" });
    }

    let prizeSum = result[0]["sum(number)"];
    if (prizeSum != data.prizesum) {
      return res.send({
        status: 1,
        message: "设置失败，总奖品数与各奖品数和不等！",
      });
    } else {
      const sql = "update drawset set ? where id=1";
      db.query(sql, data, (err, result) => {
        if (err) {
          return res.send({ status: 1, message: err.message });
        }
        if (result.affectedRows !== 1) {
          return res.send({ status: 1, message: "跟新抽奖设置失败！" });
        }
        return res.send({ status: 0, message: "跟新抽奖设置成功！" });
      });
    }
  });
};
