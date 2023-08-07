import { NOT_MOUNTED, MOUNTING, MOUNTED } from "../applications/app.helper";

/**
 * 挂载应用：调用应用的mount方法
 * @param {*} app
 */
export async function toMountPromise(app) {
  // 如果应用当前状态不为挂载前，则跳过
  if (app.status !== NOT_MOUNTED) return app;

  // 改变当前状态为挂载中
  app.status = MOUNTING;

  // 调用应用的mount方法
  await app.mount(app.customProps);

  // 改变当前状态为已挂载
  app.status = MOUNTED;
}
