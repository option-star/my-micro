import { MOUNTED, NOT_MOUNTED, UNMOUNTING } from "../applications/app.helper";

/**
 * 卸载应用：调用应用中的unmount方法
 * @param {*} app 应用
 */
export async function toUnmountPromise(app) {
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
