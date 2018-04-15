/**
 * @name 用户登陆信息模块
 * @date 2018-04-15
 * @description 用于提供用户登陆状等信息
 */
import { CookieParser } from 'dantejs';

const cookies = new CookieParser(document.cookie);

export default class Profile {

  /**
   * 获取当前用户登陆态token
   */
  static get token() {
    return cookies.token;
  }

  /**
   * 当前用户是否已登陆
   */
  static get authed() {
    return !!this.token;
  }
}