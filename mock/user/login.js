module.exports = function (request) {
  const { name, password } = request.query;
  const isPass = (name == 'beven' && password == '123456');
  return {
    code: isPass ? 0 : 99,
    name:'beven',
    message: isPass ? '登陆成功' : '用户名或者密码错误'
  }
}