import {
  BOOTSTRAPPING,
  NOT_BOOTSTRAPPED,
  NOT_MOUNTED,
} from "../applications/app.helper";

/**
 * 启动应用: 调用应用的bootstrap方法
 * @param {*} app
 */
export async function toBootstrapPromise(app) {
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
