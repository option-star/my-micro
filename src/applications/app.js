import { reroute } from "../navigations/reroute";
import {
  BOOTSTRAPPING,
  LOADING_SOURCE_CODE,
  MOUNTED,
  NOT_BOOTSTRAPPED,
  NOT_LOADED,
  NOT_MOUNTED,
  SKIP_BECAUSE_BROKEN,
  shouldBeActive,
} from "./app.helper";

const apps = []; // 用来存放所有应用

/**
 * 注册应用
 * @param {*} appName 应用名称
 * @param {*} loadApp 加载的应用
 * @param {*} activeWhen 当激活时会调用loadApp
 * @param {*} customProps 自定义属性（用于全局通信）
 */
export function registerApplication(appName, loadApp, activeWhen, customProps) {
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
export function getAppChanges() {
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
