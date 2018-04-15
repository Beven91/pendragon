/**
 * @name:mock数据全局共享上下文
 * @date：2018-04-15
 * 描述：用于提供mock流程数据构建功能相
 */
const dantejs = require('dantejs');
const validator = dantejs.Validator.validator;

class MockContext {

  constructor() {
    Object.defineProperty(this, 'throwRequired', { writable: false, value: this.throwRequired });
    Object.defineProperty(this, 'toRule', { writable: false, value: this.toRule });
  }

  /**
   * 校验数据Mock接口传入参数
   * @param {IncommingMessage} req express的request对象
   * @param {Object} parameters 当前mock接口需要的参数
   */
  throwRequired(req, parameters) {
    const query = req.query;
    const body = req.body;
    const rule = this.toRule(parameters);
    const data = Object.assign({}, query, body);
    if (!validator.model(data, rule)) {
      throw new Error(validator.currentMessage)
    }
  }

  /**
   * 转换参数类型为验证模型
   * @param {Object} parameters 当前mock接口需要的参数
   */
  toRule(parameters) {
    parameters = parameters || [];
    const rule = {};
    for (var i in parameters) {
      rule[i] = { required: `${i}参数必须提供` };
    }
    return rule;
  }
}

module.exports = MockContext;