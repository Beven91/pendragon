/**
 * 名称：前端异常捕获
 * 日期：2017-11-10
 * 描述：用于捕获前端异常信息，
 *      例如在开发环境会将异常上报至控制台，
 *      以及显示一个浮层信息到设备屏幕上 便于排错
 */

import "./index.css";
import BJ_REPORT from "./bj-report-tryjs.min";

class Saber {

  static initReport() {
    window.onWebpackRequireErrorCapture = (error) =>{
      console.error(error);
      BJ_REPORT.report(error);
    } 
    BJ_REPORT.init({
      //上报 id, 不指定 id 将不上报
      id: 1,
      // 指定用户 id
      uin: 1,
      // combo 是否合并上报， 0 关闭， 1 启动（默认）
      combo: 0,
      // 当 combo 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
      delay: 1000,
      // 指定上报地址
      url: '/saber',
      // 忽略某个错误
      //ignore: [/Script error/i],
      // 抽样上报，1~0 之间数值，1为100%上报（默认 1）
      random: 1,
      // 重复上报次数(对于同一个错误超过多少次不上报)  避免出现单个用户同一错误上报过多的情况
      repeat: 3,
      onReport: (id,ex) => {
        this.showReport({stack:ex.msg.split('@').join('\n@')});
      }
    });
    //绑定所有异常场景 例如 SpyJquery , SpyModule , SpySystem
    BJ_REPORT.tryJs().spyAll();
  }

  static showReport(error) {
    const id = 'pendragon_stack_error_overly';
    const element = document.createElement('div');
    let overlay = document.getElementById(id);
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = id;
      overlay.className = "stack-error";
      document.body.appendChild(overlay);
    }
    element.className = "error";
    element.innerHTML = `<span class="error-icon">ERROR</span>${(error || {}).stack}`;
    overlay.appendChild(element);
  }
}

Saber.initReport();