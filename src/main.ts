import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router"
import "./index.css"

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

createApp(App)
  .use(router)
  .mount('#app')
