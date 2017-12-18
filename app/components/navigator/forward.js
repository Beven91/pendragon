/**
 *  用于记录路由数据，用于判断当前路由(pushstate)是前进还是后台
 *  
 */

export default class NavigateHelper {

    static getCurrentStateID() {
        return parseInt(window.localStorage.getItem("currentStateID") || 0);
    }

    static setCurrentStateID(id) {
        window.localStorage.setItem("currentStateID", id);
    }

    static genStateID() {
        let stateid = window.localStorage.getItem("stateid") || "0";
        var id = parseInt(stateid) + 1;
        window.localStorage.setItem("stateid", id);
        return id;
    }

    static initRoute() {
        const history = window.history;
        const state = history.state || {};
        const id = (state && state.id > 0) ? state.id : this.genStateID();
        this.setCurrentStateID(id);
        if (!state) {
            history.replaceState({ id: id }, '', window.location.href);
        }
    }

    static isForward(ispopstate) {
        const history = window.history;
        const state = history.state || {};
        const isThan  = (state && state.id > this.getCurrentStateID());
        return isThan || (!ispopstate);
    }
}