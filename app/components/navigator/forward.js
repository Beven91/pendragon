/**
 * 名称：pushState辅助工具
 * 描述：记录路由跳转数据，用于判断当前路由(pushstate)是前进还是后台
 */
const name = '@_StateId__@'

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
   * 生成一个新的state.id
   */
  static genStateID() {
    let stateid = window.localStorage.getItem(name) || "0";
    var id = parseInt(stateid) + 1;
    return id;
  }

  /**
   * 初始化state.id
   */
  static initRoute() {
    const history = window.history;
    const state = history.state;
    const id = (state && state.id > 0) ? state.id : this.genStateID();
    this.setCurrentStateID(id);
    if (!state) {
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
}