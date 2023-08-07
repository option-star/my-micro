(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.singleSpa = {}));
}(this, (function (exports) { 'use strict';

  // 描述应用的整个状态
  const NOT_LOADED = "NOT_LOADED"; // 应用初始状态（没有加载过）
  const LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE"; // 加载资源
  const NOT_BOOTSTRAPPED = "NOT_BOOTSTRAPPED"; // 启动前
  const BOOTSTRAPPING = "BOOTSTRAPPING"; // 启动中
  const NOT_MOUNTED = "NOT_MOUNTED"; // 挂载前
  const MOUNTED = "MOUNTED"; // 挂载完毕
  const SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN"; // 运行出错

  /**
   * 判断当前应用是否需要被激活（即判断当前是否处于activeWhen）
   * @param {*} app 应用
   */
  function shouldBeActive(app) {
    return app.activeWhen(window.location);
  }

  function flattenFnArray(fns) {
    // 兼容不是数组形式
    fns = Array.isArray(fns) ? fns : [fns];

    // props为组合前函数传参
    // 通过promise链来链式调用Promise.resolve().then(() => fn1(props)).then(() => fn2(props))
    return (props) =>
      fns.reduce((p, fn) => p.then(() => fn(props)), Promise.resolve());
  }

  /**
   * 将bootstrap、mount、unmount方法挂载在应用上
   * @param {*} app 应用
   */
  async function toLoadPromise(app) {
    // 开始加载，表示状态为加载中
    app.status = LOADING_SOURCE_CODE;

    // 获取对应的生命周期函数
    let { bootstrap, mount, unmount } = await app.loadApp(app.customProps);

    // 加载完毕，表示状态为启动前
    app.status = NOT_BOOTSTRAPPED;

    // 将对应的生命周期方法挂载在应用上
    app.bootstrap = flattenFnArray(bootstrap);
    app.mount = flattenFnArray(mount);
    app.unmount = flattenFnArray(unmount);

    return app;
  }

  let started = false;
  function start() {
    started = true;
    reroute(); // 加载与挂载应用
  }

  function reroute() {
    const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();

    console.log(appsToLoad, appsToMount, appsToUnmount);

    if (started) {
      // start: 进行应用挂载
      return preformAppChanges(); // 根据路径来装载应用
    } else {
      // register: 进行应用加载
      return loadApps(); // 预先加载应用
    }

    /**
     * 加载应用
     */
    async function loadApps() {
      // 将需要加载的应用，取得其bootstrap、mount、unmount方法放到应用上，完成应用加载
      let apps = await Promise.all(appsToLoad.map(toLoadPromise));

      console.log(apps);
    }

    /**
     * 根据路径来装载应用
     */
    async function preformAppChanges() {}
  }

  const apps = []; // 用来存放所有应用

  /**
   * 注册应用
   * @param {*} appName 应用名称
   * @param {*} loadApp 加载的应用
   * @param {*} activeWhen 当激活时会调用loadApp
   * @param {*} customProps 自定义属性（用于全局通信）
   */
  function registerApplication(appName, loadApp, activeWhen, customProps) {
    apps.push({
      // 存储应用
      name: appName,
      loadApp,
      activeWhen,
      customProps,
      status: NOT_LOADED,
    });

    reroute(); // 加载应用
  }

  /**
   * 根据应用的状态来进行筛选，判断哪些应用是加载还是装载的
   */
  function getAppChanges() {
    const appsToUnmount = []; // 要卸载的应用
    const appsToLoad = []; // 要加载的应用
    const appsToMount = []; // 要挂载的应用

    apps.forEach((app) => {
      // 根据当前hash判断是否被激活
      const appShouldBeActive =
        app.status !== SKIP_BECAUSE_BROKEN && shouldBeActive(app);
      switch (app.status) {
        case NOT_LOADED:
        case LOADING_SOURCE_CODE:
          if (appShouldBeActive) {
            appsToLoad.push(app);
          }
          break;
        case NOT_BOOTSTRAPPED:
        case BOOTSTRAPPING:
        case NOT_MOUNTED:
          if (appShouldBeActive) {
            appsToMount.push(app);
          }
          break;
        case MOUNTED:
          if (!appShouldBeActive) {
            appsToUnmount.push(app);
          }
      }
    });

    return { appsToLoad, appsToUnmount, appsToMount };
  }

  exports.registerApplication = registerApplication;
  exports.start = start;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=single-spa.js.map
