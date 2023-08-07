import { reroute } from "./navigations/reroute";

export let started = false;
export function start() {
  started = true;
  reroute(); // 加载与挂载应用
}
