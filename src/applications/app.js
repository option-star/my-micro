import { NOT_LOADED } from "./app.helper";

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
}
