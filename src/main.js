import { createApp } from "vue";
import Antd from "ant-design-vue";
import App from "./App";
import "ant-design-vue/dist/antd.css";
import "./index.css";
import { message } from "ant-design-vue";

const app = createApp(App);
app.config.productionTip = false;
window.$message = message;
app.use(Antd).mount("#app");
