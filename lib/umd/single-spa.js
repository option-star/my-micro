(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.singleSpa = {}));
}(this, (function (exports) { 'use strict';

  let started = false;
  function start() {
    started = true;
    reroute(); // 加载与挂载应用
  }

  function reroute() {
    if (started) {
      console.log("调用start方法");
    } else {
      console.log("调用register方法");
    }
  }

  /**
   * 注册应用
   * @param {*} appName 应用名称
   * @param {*} loadApp 加载的应用
   * @param {*} activeWhen 当激活时会调用loadApp
   * @param {*} customProps 自定义属性（用于全局通信）
   */
  function registerApplication(appName, loadApp, activeWhen, customProps) {

    reroute(); // 加载应用
  }

  exports.registerApplication = registerApplication;
  exports.start = start;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=single-spa.js.map
