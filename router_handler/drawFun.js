//·····地狱模式·····没多写几个接口   等我学完promise来改！
const db = require("../db/database");
//导入时间处理函数
const timeFun = require("../Time");

exports.drawFun = (req, res) => {
  //抽奖人
  let user = req.body.username;
  //一、获取抽奖设置信息
  const sql = "select bigprizeId,time,probability,cost from drawset";
  db.query(sql, (err, result) => {
    if (err) {
      return res.send({ status: 1, message: err.message });
    }
    if (result.length !== 1) {
      return res.send({ status: 1, message: "获取抽奖设置信息失败！" });
    }
    //花销
    let cost = result[0].cost;
    let minerals;
    // 中奖概率
    let probability = result[0].probability;
    let random = Math.random();
    //大奖
    let bigprizeId = result[0].bigprizeId;
    //投放时间
    let time = result[0].time;
    let setTime = timeFun.timeStr(time);
    let nowDateTime = timeFun.getTime();
    let nowTime = timeFun.timeStr(nowDateTime);
    //扣金币
    //1.获取金币
    const sql = "select minerals from usertable where username=?";

    db.query(sql, user, (err, result) => {
      if (err) {
        return res.send({ status: 1, message: err.message });
      }
      if (result.length !== 1) {
        return res.send({ status: 1, message: "获取用户金币失败！" });
      }
      minerals = result[0].minerals;
      minerals = minerals - cost;
      //2.扣除金币
      const sqlStr = "update usertable set minerals=? where username=?";
      db.query(sqlStr, [minerals, user], (err, result) => {
        if (err) {
          return res.send({ status: 1, message: err.message });
        }
        if (result.affectedRows !== 1) {
          return res.send({
            status: 1,
            message: "更新失败！",
          });
        }
        // 二、判断是否中奖
        if (random <= probability) {
          //获取所有奖品数
          let sql = "";
          let sqlStr = "";
          //三、判断抽奖时间是否在投放时间之后
          if (nowTime < setTime) {
            sql = `select sum(number) from prizetable where id<>8 and id<>${bigprizeId}`;
            sqlStr = `select prizename,number from prizetable where id<>8 and id<>${bigprizeId}`;
          } else {
            sql = "select  sum(number) from prizetable where id<>8";
            sqlStr = "select id,prizename,number from prizetable where id<>8";
          }
          db.query(sql, (err, result) => {
            if (err) {
              return res.send({ status: 1, message: err.message });
            }
            if (result.length !== 1) {
              return res.send({ status: 1, message: "获取奖品总数失败！" });
            }
            let prizeSum = result[0]["sum(number)"];
            //四、判断是否还有奖品可抽,没有的话未中奖
            if (prizeSum == 0) {
              return res.send({ status: 2, message: "很遗憾，未中奖！" });
            } else {
              //五、获取可抽奖品和数目
              db.query(sqlStr, (err, result) => {
                if (err) {
                  return res.send({ status: 1, message: err.message });
                }
                if (result.length == 1) {
                  return res.send({
                    status: 1,
                    message: "获取奖品名和奖品数失败！",
                  });
                }
                //抽奖函数核心
                //奖品数组
                let prizeArr = [];
                //奖品id数组;
                let prizeId = [];
                //奖品数量数组
                let number = [];
                //奖品概率数组
                let probabilityArr = [];
                result.forEach((e) => {
                  prizeArr.push(e.prizename);
                  number.push(e.number);
                  prizeId.push(e.id);
                  probabilityArr.push(e.number / prizeSum);
                });
                let sum = 0,
                  factor = 0,
                  random = Math.random();
                for (var i = probabilityArr.length - 1; i >= 0; i--) {
                  sum += probabilityArr[i]; // 统计概率总和
                }
                random *= sum; // 生成概率随机数
                for (var i = probabilityArr.length - 1; i >= 0; i--) {
                  factor += probabilityArr[i];
                  if (random <= factor) {
                    //六、中奖奖品数量减1
                    const sql =
                      "update prizetable set number=? where prizename=?";
                    db.query(
                      sql,
                      [number[i] - 1, prizeArr[i]],
                      (err, result) => {
                        if (err) {
                          return res.send({ status: 1, message: err.message });
                        }
                        if (result.affectedRows !== 1) {
                          return res.send({
                            status: 1,
                            message: "更新奖品数量失败！",
                          });
                        }
                        //七、用户中奖记录
                        //1.获取用户中奖记录
                        const sqlStr =
                          "select prizes from usertable where username=?";
                        db.query(sqlStr, user, (err, result) => {
                          if (err) {
                            return res.send({
                              status: 1,
                              message: err.message,
                            });
                          }
                          if (result.length !== 1) {
                            return res.send({
                              status: 1,
                              message: "获取用户中奖信息失败！",
                            });
                          }
                          let str = result[0].prizes;
                          // 中奖时间
                          let timeStr = nowDateTime.replace(/T/, " ");
                          if (!str) {
                            str = `${prizeArr[i]}.${timeStr}`;
                          } else {
                            str = `${str},${prizeArr[i]}.${timeStr}`;
                          }
                          //2.修改用户表单中的中奖信息
                          let sql = "";
                          //抽中矿石加200
                          if (prizeId[i] == 1) {
                            sql ="update usertable set prizes=?,minerals=minerals+200  where username=?";
                          }else{sql =
                            "update usertable set prizes=?  where username=?";} 
                          db.query(sql, [str, user], (err, result) => {
                            if (err) {
                              return res.send({
                                status: 1,
                                message: err.message,
                              });
                            }
                            if (result.affectedRows !== 1) {
                              return res.send({
                                status: 1,
                                message: "跟新用户中奖信息失败！",
                              });
                            }
                          });
                        });
                        return res.send({
                          status: 0,
                          message: "恭喜中奖！！！",
                          prize: { id: i + 1, prizename: prizeArr[i] },
                        });
                      }
                    );

                    break;
                  }
                }
              });
            }
          });
        } else {
          return res.send({ status: 2, message: "很遗憾，未中奖！" });
        }
      });
    });
  });
};
