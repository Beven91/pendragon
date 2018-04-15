/**
 * @name：网络接口异常消息定制
 * @date：2018-04-15
 * @description：用于定制接口异常消息
 */

/**
 * 获取指定接口，对应的接口异常消息
 * @param {String} name 接口名称
 * @param {Object} code 对应的stateItem.code
 */
export function getMessage(name, code) {
  const keys = Object.keys(Constants);
  const apiKey = keys.find((k) => k.toLowerCase() === (name || '').toLowerCase())
  const api = Constants[apiKey] || {};
  return api[code] || api['default'];
}

export const Constants = {
  'network': {
    '-1': '未登陆',
  },
}