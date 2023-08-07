import {
  LOADING_SOURCE_CODE,
  NOT_BOOTSTRAPPED,
} from "../applications/app.helper";

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
export async function toLoadPromise(app) {
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
