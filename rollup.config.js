import serve from "rollup-plugin-serve";
export default {
  input: "./src/single-spa.js", // 入口文件
  output: {
    file: "./lib/umd/single-spa.js", // 打包输出文件
    format: "umd", // 输出格式
    name: "singleSpa", // 挂载在window上的名称
    sourcemap: true, // 是否生成sourcemap
  },
  plugins: [
    serve({
      // 配置开发环境服务
      openPage: "/index.html", // 开发服务默认打开文件
      contentBase: "", // 开发服务基准目录
      port: 3000, // 开发服务端口
    }),
  ],
};
