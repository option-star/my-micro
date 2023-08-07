import { started } from "../start";

export function reroute() {
  if (started) {
    console.log("调用start方法");
  } else {
    console.log("调用register方法");
  }
}
