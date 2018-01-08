/**
 * 名称：pushState辅助工具
 * 描述：记录路由跳转数据，用于判断当前路由(pushstate)是前进还是后台
 */
import { UrlParser } from 'dantejs';

const name = '@_StateId__@'

let PATHEXTENSION = '';
let PATHROOT = '';
let NavigateMode = 'pushState';

export default class NavigateHelper {

  /**
   * 获取当前的pushStatea对应的state.id
   */
  static getCurrentStateID() {
    return parseInt(window.localStorage.getItem(name) || 0);
  }

  /**
   * 设置当前pushState的state.id
   * @param {*} id 
   */
  static setCurrentStateID(id) {
    window.localStorage.setItem(name, id);
  }

  /**
   * 設置當前路由模式
   * @param {String} mode 路由模式 pushState hash 
   */
  static setMode(mode) {
    NavigateMode = mode;
  }

  /**
   * 設置當前路由模式
   * @param {String} mode 路由模式 pushState hash 
   */
  static getMode() {
    return NavigateMode;
  }

  /**
   * 在单页跳转到第N页时，刷新了界面时的路由参数同步
   */
  static getRouteParams() {
    let url = null;
    switch (this.getMode()) {
      case 'hash':
        url = NavigateHelper.getWebPath();
        break;
      default:
        url = location.href;
        break;
    }
    const parser = new UrlParser(url);
    const qs = parser.paras.qs || '{}';
    const data = JSON.parse(qs);
    data._path = this.getWebPath();
    return data;
  }

  /**
   * 生成一个新的state.id
   */
  static genStateID() {
    let stateid = window.localStorage.getItem(name) || "0";
    stateid = isNaN(stateid) ? 0 : stateid;
    return parseInt(stateid) + 1;
  }

  /**
   * 初始化state.id
   */
  static initRoute() {
    const history = window.history;
    const state = history.state;
    const id = (state && !isNaN(state.id) && state.id > 0) ? state.id : this.genStateID();
    this.setCurrentStateID(id);
    if (!state || isNaN(state.id)) {
      history.replaceState({ id: id }, '', window.location.href);
    }
  }

  /**
   * 判断当前popstate是前进还是后退
   * 根据当前history.state.id > 上次的state.id 如果为true则会前进 否则后退
   * @param {Boolean} isBack 辅助判断在 history.state.id < 上次state.id时，是否有指示说明本次路由操作是后退操作
   */
  static isForward(isBack) {
    const history = window.history;
    const state = history.state || {};
    const isThan = (state && state.id > this.getCurrentStateID());
    return isThan;
  }

  /**
   * 设置路由后缀 例如设置成.html  那么所有路由path默认会拼接.html 例如: path:'login' 那么可以 login.html
   * @param {String} extension 后缀名 
   * @param {String} rootPath 默认路由根部分 例如  web/order
   */
  setPathExtension(extension, rootPath = '') {
    PATHEXTENSION = extension;
    PATHROOT = rootPath;
  }

  /**
   * 获取当前路由pathname
   */
  static getWebPath() {
    const pathname = this.getLocationPath();
    const pathRoot = PATHROOT;
    const pathRootIndex = pathname.indexOf(pathRoot);
    if (pathRoot && pathRootIndex > -1) {
      return pathname.substr(pathRootIndex + pathRoot.length);
    } else {
      return pathname;
    }
  }

  /**
   * 处理路由path后缀
   * @param {*} routeConfigs 
   */
  static handlePathExtensions(routeConfigs) {
    const extension = PATHEXTENSION;
    if (extension) {
      Object.keys(routeConfigs).map((k) => {
        const route = routeConfigs[k];
        if (route.path && !route.rest) {
          route.path = route.path + extension;
        }
      })
    }
    return routeConfigs;
  }

  /**
   * 獲取初始化的路由
   */
  static getInitialRouteName() {
    return this.getWebPath().replace(/^\//, '');
  }

  /**
   * 获取PathRoot
   */
  static getPathRoot() {
    return PATHROOT;
  }

  /**
   * 获取当前location.pathname
   */
  static getLocationPath() {
    switch (NavigateMode) {
      case 'hash':
        return window.location.hash.substr(1).toLowerCase();
      default:
        return window.location.pathname.toLowerCase();
    }
  }

  /**
   * 跳转到指定url
   * @param {String} url 跳转的目标url
   */
  static goUrl(url, state) {
    const id = this.genStateID();
    window.history.pushState({ id }, state.title, url);
  }
}