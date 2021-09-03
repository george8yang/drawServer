//将datetime转换为时间字符串
exports.timeStr = (str) => {
  return str.replace(/[\-:T]+/g, "");
};

//获取本地时间并转换为datetime
exports.getTime = () => {
  let date = new Date();
  let y = date.getFullYear();
  let M = date.getMonth() + 1;
  M = M < 10 ? "0" + M : M;
  let d = date.getDate();
  d = d < 10 ? "0" + d : d;
  let h = date.getHours();
  h = h < 10 ? "0" + h : h;
  let m = date.getMinutes();
  m = m < 10 ? "0" + m : m;
  return y + "-" + M + "-"  + d+ "T"  + h + ":" + m;
};
