import { reroute } from "./reroute";

// 用户有没有监听对应的路由方法
export const routingEventsListeningTo = ["hashchange", "popstate"];

/**
 * 重新加载应用（路由事件触发后调用）
 */
function urlReroute() {
  reroute([], arguments);
}

window.addEventListener("hashchange", urlReroute);
window.addEventListener("popstate", urlReroute);
