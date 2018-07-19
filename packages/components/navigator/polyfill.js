/**
 * 名称：history.state polyfill
 * 日期
 */
import Storage from './storage'

const { history } = window

if (!history.constructor.prototype.hasOwnProperty('state')) {
  (function (push, rep) {

    class HistoryPolyfill {

      constructor() {
        this.allState = Storage.getJSON('History.state', {});
        //初始化history.state
        history.state = this.allState[this.urlId()];
        //覆盖原始history.pushState
        history.pushState = this.pushState.bind(this);
        //覆盖原始history.replaceState
        history.replaceState = this.replaceState.bind(this);
        //同步popstate
        window.addEventListener('popstate', function (e) {
          this.state = this.allState[this.urlId()] || e.state;
        }.bind(this));
      }

      /**
       * 设置当当前history.state
       */
      set state(state) {
        history.state = state;
        const id = this.urlId();
        this.allState[id] = state;
        Storage.setJSON('History.state', this.allState);
      }

      /**
       * 将url转为history.state本地存储id
       */
      urlId() {
        return encodeURIComponent(location.href.split(location.host)[1]);
      }

      /**
       * 推送一个state
       * @param {*} state 
       */
      pushState(state) {
        push.apply(history, arguments);
        this.state = state;
      }

      /**
       * 替换一个state
       * @param {*} state 
       */
      replaceState(state) {
        rep.apply(history, arguments);
        this.state = state;
      }
    }

    new HistoryPolyfill();

  })(history.pushState, history.replaceState);
}