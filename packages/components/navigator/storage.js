/**
 * 名称：本地存储兼容工具
 * 日期：2018-01-23
 * 描述：用于解决部分浏览器不支持sessionStorage时，使用cookie作为临时方案
 */
import dantejs from 'dantejs';
// import lz from 'lz-string';

const cookies = new dantejs.CookieParser(document.cookie);

export class Storage {

  constructor() {
    this.sessionStorageOK = sessionStorageOK();
  }

  /**
   * 获取指定名称的存储值
   * @param {String} key 
   */
  get(key) {
    if (this.sessionStorageOK) {
      return window.sessionStorage.getItem(key);
    } else {
      return (cookies.getCookie(key));
    }
  }

  /**
   * 存储指定名称的值
   * @param {String} key 存储key
   * @param {String} value 存储值
   */
  set(key, value) {
    if (this.sessionStorageOK) {
      window.sessionStorage.setItem(key, value);
    } else {
      //value = (lz.compressToBase64(value));
      cookies.setCookie(key,value,null,location.pathname);
    }
  }

  /**
   * 获取一个json格式的数据
   * @param {String} key 要获取的数据的名称
   * @param {Object} dv 默认值
   */
  getJSON(key, dv = {}) {
    const v = this.get(key) || null;
    return JSON.parse(v) || dv;
  }

  /**
   * 保存一个json对象
   */
  setJSON(key, value) {
    this.set(key, JSON.stringify(value));
  }
}

//是否支持sessionStorage
function sessionStorageOK() {
  try {
    const sessionStorage = window.sessionStorage;
    sessionStorage.setItem('ACCESS_TEST', '1');
    sessionStorage.removeItem('ACCESS_TEST');
    return true;
  } catch (e) {
    return false;
  }
}

export default new Storage();