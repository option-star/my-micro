// 描述应用的整个状态
export const NOT_LOADED = "NOT_LOADED"; // 应用初始状态（没有加载过）
export const LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE"; // 加载资源
export const NOT_BOOTSTRAPPED = "NOT_BOOTSTRAPPED"; // 启动前
export const BOOTSTRAPPING = "BOOTSTRAPPING"; // 启动中
export const NOT_MOUNTED = "NOT_MOUNTED"; // 挂载前
export const MOUNTING = "MOUNTING"; // 挂载中
export const MOUNTED = "MOUNTED"; // 挂载完毕
export const UPDATING = "UPDATING"; // 更新中
export const UNMOUNTING = "UNMOUNTING"; // 卸载中
export const UNLOADING = "UNLOADING"; // 没有加载中
export const LOAD_ERROR = "LOAD_ERROR"; // 加载失败
export const SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN"; // 运行出错

/**
 * 判断当前应用是否处于激活状态
 * @param {*} app 应用
 * @returns
 */
export function isActive(app) {
  return app.status === MOUNTED;
}

/**
 * 判断当前应用是否需要被激活（即判断当前是否处于activeWhen）
 * @param {*} app 应用
 */
export function shouldBeActive(app) {
  return app.activeWhen(window.location);
}
