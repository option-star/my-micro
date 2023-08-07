import { getAppChanges } from "../applications/app";
import { toBootstrapPromise } from "../lifecycles/bootstrap";
import { toLoadPromise } from "../lifecycles/load";
import { toMountPromise } from "../lifecycles/mount";
import { toUnmountPromise } from "../lifecycles/unmount";
import { started } from "../start";

export function reroute() {
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
