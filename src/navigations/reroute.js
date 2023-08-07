import { getAppChanges } from "../applications/app";
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
}

/**
 * 加载应用
 */
async function loadApps() {}

/**
 * 根据路径来装载应用
 */
async function preformAppChanges() {}
