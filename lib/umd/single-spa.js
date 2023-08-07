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
  const MOUNTING = "MOUNTING"; // 挂载中
  const MOUNTED = "MOUNTED"; // 挂载完毕
  const UNMOUNTING = "UNMOUNTING"; // 卸载中
  const SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN"; // 运行出错

  /**
   * 判断当前应用是否需要被激活（即判断当前是否处于activeWhen）
   * @param {*} app 应用
   */
  function shouldBeActive(app) {
    return app.activeWhen(window.location);
  }

  /**
   * 启动应用: 调用应用的bootstrap方法
   * @param {*} app
   */
  async function toBootstrapPromise(app) {
    // 当前不为启动前状态不做处理
    if (app.status !== NOT_BOOTSTRAPPED) return app;

    // 表示当前状态为启动中
    app.status = BOOTSTRAPPING;

    // 调用应用的bootstrap方法
    await app.bootstrap(app.customProps);

    // 表示当前状态为挂载前
    app.status = NOT_MOUNTED;

    return app;
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
   * 加载应用：将bootstrap、mount、unmount方法挂载在应用上
   * @param {*} app 应用
   */
  async function toLoadPromise(app) {
    // 如果还没执行完返回当前执行的
    if (app.loadPromise) return app.loadPromise;

    return (app.loadPromise = Promise.resolve().then(async () => {
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
      delete app.loadPromise;

      return app;
    }));
  }

  /**
   * 挂载应用：调用应用的mount方法
   * @param {*} app
   */
  async function toMountPromise(app) {
    // 如果应用当前状态不为挂载前，则跳过
    if (app.status !== NOT_MOUNTED) return app;

    // 改变当前状态为挂载中
    app.status = MOUNTING;

    // 调用应用的mount方法
    await app.mount(app.customProps);

    // 改变当前状态为已挂载
    app.status = MOUNTED;
  }

  /**
   * 卸载应用：调用应用中的unmount方法
   * @param {*} app 应用
   */
  async function toUnmountPromise(app) {
    // 如果应用没有在挂载，则跳过
    if (app.status !== MOUNTED) return app;

    // 表示为卸载中状态
    app.status = UNMOUNTING;

    // 调用应用的unmount方法，进行卸载
    await app.unmount(app.customProps);

    // 表示为挂载前状态
    app.status = NOT_MOUNTED;

    // 最后返回应用
    return app;
  }

  let started = false;
  function start() {
    started = true;
    reroute(); // 加载与挂载应用
  }

  function reroute() {
    const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();

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
    }

    /**
     * 根据路径来装载应用
     */
    async function preformAppChanges() {
      // 先卸载已激活的应用
      let unmountPromises = appsToUnmount.map(toUnmountPromise);

      // 将需要加载的应用，进行加载(load)、启动(bootstrap)、挂载(mount)
      appsToLoad.map(async (app) => {
        app = await toLoadPromise(app); // 加载(load)
        app = await toBootstrapPromise(app); // 启动(bootstrap)
        return toMountPromise(app); // 挂载(mount)
      });

      // 如果应用已加载，进行启动(bootstrap), 挂载(mount)
      appsToMount.map(async (app) => {
        app = await toBootstrapPromise(app);
        return toMountPromise(app);
      });
    }
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
