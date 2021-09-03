//导入数据库操作模块
const db = require("../db/database");

exports.getUserInfo = (req, res) => {
  const sql =
    "select id,username,isAdministrator,minerals,prizes from usertable where username=?";
  db.query(sql, req.query.username, (err, result) => {
    if (err) {
      return res.send({ status: 1, message: err.message });
    }
    if (result.length !== 1) {
      return res.send({ status: 1, message: "获取用户信息失败！" });
    }
    res.send({
      status: 0,
      message: "获取用户信息成功！",
      data: result[0],
    });
  });
};
