/**
 * 名称：函数锁React组件
 * 日期：2018-01-11
 * 描述：使指定组件支持锁机制，
 *      同时解决React绑定事件函数时的this指向问题 例如: <div onClick={this.doSomething}></div>
 */

import React from 'react';

//获取所有keys
const reflectKeys = (a) => Reflect.ownKeys(a);
//不进行adapter的函数
const blackList = [
  'constructor',
  'render'
];

export default class ComponentLock extends React.Component {

  constructor(props) {
    super(props);
    //定义函数锁
    Object.defineProperty(this, '__locked', { writable: false, value: [], configurable: false })
    //锁定指定函数
    Object.defineProperty(this, '_lock', { writable: false, value: lockFunction, configurable: false })
    //解锁指定函数
    Object.defineProperty(this, '_unlock', { writable: false, value: unLockFunction, configurable: false })
    //原型属性对象化
    const keys = ([
      ...reflectKeys(this.__proto__),
      ...reflectKeys(this.__proto__.__proto__)
    ])
    keys.filter((k) => blackList.indexOf(k) < 0).map((key) => adapterProperty(this, key))
  }

  /**
  * 锁定当前页面实例指定函数
  * @param {Function} handler 要锁定的函数 注意：该函数必须为当前页面类定义的函数
  * @example  this.lock(this.submit)
  */
  lock(handler) {
    return this._lock(handler);
  }

  /**
   * 解锁指定函数
   * @param {Function} handler 要锁定的函数 注意：该函数必须为当前页面类定义的函数
   * @example  this.unlock(this.submit)
   */
  unlock(handler) {
    return this._unlock(handler);
  }
}

/**
 * 适配属性
 * @param {Object} target 目标对象 
 * @param {String} name 属性名称
 */
function adapterProperty(target, name) {
  var handler = target[name];
  if (typeof handler === 'function') {
    target[name] = adapterFunction(target, name);
  }
}

/**
 * 适配函数
 * @param {Object} target 目标对象 
 * @param {String} name 属性名称
 */
function adapterFunction(target, name) {
  var handler = target[name];
  var locked = target.__locked;
  return function () {
    var nowHandler = target[name];
    if (locked.indexOf(nowHandler) > -1) {
      console.warn(`函数:${name}被锁定，您是否忘记解锁？ 解锁操作:this.unlock(this.${name})`)
    } else {
      return handler.apply(target, arguments);
    }
  }
}

/**
 * 锁定指定函数
 */
function lockFunction(handler) {
  var locked = this.__locked;
  if (typeof handler === 'function') {
    if (locked.indexOf(handler) < 0) {
      locked.push(handler);
    }
  }
  var unlock = unLockFunction.bind(this);
  return function (response) {
    unlock(handler);
    return response;
  }
}

/**
 * 解锁指定函数
 */
function unLockFunction(handler) {
  var locked = this.__locked;
  var index = locked.indexOf(handler);
  if (typeof handler === 'function' && index >= 0) {
    //延迟300毫秒解锁，防止函数在300毫秒内可并发调用
    setTimeout(() => locked.splice(index, 1), 300);
  }
}