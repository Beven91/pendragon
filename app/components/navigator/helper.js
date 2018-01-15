/**
 * 名称：pushState辅助工具
 * 描述：记录路由跳转数据，用于判断当前路由(pushstate)是前进还是后台
 */
import './polyfill';

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
    const state = history.state || {};
    const params = state.params || "{}";
    return JSON.parse(params);
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
   */
  static isForward() {
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
  static push(url, state) {
    const id = this.genStateID();
    const params = JSON.stringify(state.params || {});
    window.history.pushState({ id, params }, state.title, url);
  }

  /**
   * 使用新的id替换当前history.state
   */
  static replace(url, state) {
    const id = this.genStateID();
    const params = JSON.stringify(state.params || {});
    window.history.replaceState({ id, params }, state.path, url);
  }
}