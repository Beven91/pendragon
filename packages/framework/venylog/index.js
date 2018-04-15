/**
 * 名称：数据打点推送工具
 * 日期:2018-04-15
 * 描述：采用navigator.sendBeancon以及image兼容方式推送打点数据
 */
import { Type } from 'dantejs';

//打点配置
const Options = {
  server: ''
}

export default class Venylog {

  /**
   * 全局配置打点信息
   * @param config 配置对象 例如: 
   * {
   *   server:'' //发送的服务端地址
   * }
   */
  static config(config) {
    Object.assign(Options, config);
  }

  /**
   * Venylog构造函数
   * @param {Page} page 页面实例 
   * @param {String} name 打点页面名称
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * 发送一条打点日志
   * @param {Object} record
   */
  sendBeancon(record) {
    if (record) {
      this.push(this.coloration(record));
    }
  }

  /**
   * 发送一条映射日志，通过属性名称，映射成打点日志对象
   * @param {Object} original 原始日志属性对象
   */
  sendOriginalBeancon(original) {
    if (Type.isNnObject(original)) {
      this.sendBeancon(original);
    }
  }


  /**
   * 将日志推入发送队列
   */
  push(log) {
    const uri = Options.server + '?data=' + encodeURIComponent(log);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(uri)
    } else {
      const image = new Image();
      image.src = uri;
      image.style.cssText = "display:none";
      image.onload = image.onerror = image.onabort = () => {
        document.body.removeChild(image);
      }
      document.body.appendChild(image);
    }
  }

  /**
   * 渲染打点日志对象通用数据
   * @param {Object} record
   */
  coloration(record) {
    if (record) {
      const color = { "page": this.name }
      const log = { ...record, ...color };
      return (JSON.stringify(log));
    }
  }
}