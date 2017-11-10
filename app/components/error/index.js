/**
 * 名称：前端异常捕获
 * 日期：2017-11-10
 * 描述：用于捕获前端异常信息，
 *      例如在开发环境会将异常上报至控制台，
 *      以及显示一个浮层信息到设备屏幕上 便于排错
 */

import "./index.css";

window.onWebpackRequireErrorCapture = function (error) {
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