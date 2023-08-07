import { getAppChanges } from "../applications/app";
import { toLoadPromise } from "../lifecycles/load";
import { started } from "../start";

export function reroute() {
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
